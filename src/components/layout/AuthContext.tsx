"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  fetchGoogleProfile,
  isGoogleDriveSyncConfigured,
  requestGoogleAccessToken,
  revokeGoogleAccessToken,
  type GoogleProfile,
} from "@/lib/google-identity";
import { configureGoogleDriveSync, downloadAndMerge, flushPendingUpload, scheduleUpload } from "@/lib/sync";
import { trackEvent } from "@/lib/analytics";

export interface AppUser {
  id: string;
  provider: "google";
  name: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => void;
  syncVersion: number;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  syncNow: () => {},
  syncVersion: 0,
});

const STORED_GOOGLE_USER_KEY = "leetcode-patterns.google-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => readStoredGoogleUser());
  const [loading, setLoading] = useState(false);
  const [syncVersion, setSyncVersion] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [toastFading, setToastFading] = useState(false);
  const accessTokenRef = useRef<string | null>(null);
  const restoredUserRef = useRef<AppUser | null>(user);
  const hasSessionRef = useRef(Boolean(user));

  useEffect(() => {
    if (!toast) return;
    const fadeTimer = setTimeout(() => setToastFading(true), 3000);
    const removeTimer = setTimeout(() => { setToast(null); setToastFading(false); }, 3700);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, [toast]);

  const completeGoogleSignIn = useCallback(async (
    accessToken: string,
    options: { silent?: boolean; cancelled?: boolean } = {},
  ) => {
    accessTokenRef.current = accessToken;
    configureGoogleDriveSync(accessToken);

    const profile = await fetchGoogleProfile(accessToken);
    if (options.cancelled) return;

    const nextUser = mapGoogleProfile(profile);
    setUser(nextUser);
    storeGoogleUser(nextUser);
    setLoading(false);

    const changed = await downloadAndMerge();
    setSyncVersion((v) => v + 1);

    if (!options.silent && !hasSessionRef.current) {
      trackEvent("sign_in", { provider: "google" });
      setToast({ message: `Signed in as ${nextUser.name}`, type: "success" });
    } else if (options.silent && changed) {
      trackEvent("google_drive_sync_restore");
    }
    hasSessionRef.current = true;
  }, []);

  useEffect(() => {
    if (!isGoogleDriveSyncConfigured()) return;

    const storedUser = restoredUserRef.current;
    if (!storedUser) return;

    let cancelled = false;

    const restoreSession = async () => {
      try {
        const accessToken = await requestGoogleAccessToken("");
        if (cancelled) return;
        await completeGoogleSignIn(accessToken, { silent: true });
      } catch {
        if (cancelled) return;
        accessTokenRef.current = null;
        configureGoogleDriveSync(null);
        setUser(null);
        hasSessionRef.current = false;
        clearStoredGoogleUser();
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [completeGoogleSignIn]);

  useEffect(() => {
    const flush = () => flushPendingUpload();
    const onVisChange = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisChange);
    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, []);

  const signIn = useCallback(async () => {
    if (!isGoogleDriveSyncConfigured()) {
      setToast({ message: "Google Drive sync is not configured. Local progress still works.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const accessToken = await requestGoogleAccessToken("consent");
      await completeGoogleSignIn(accessToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in failed.";
      trackEvent("sign_in_error", { provider: "google", error: message });
      setToast({ message, type: "error" });
      setLoading(false);
    }
  }, [completeGoogleSignIn]);

  const signOut = useCallback(async () => {
    const accessToken = accessTokenRef.current;
    accessTokenRef.current = null;
    configureGoogleDriveSync(null);
    setUser(null);
    clearStoredGoogleUser();
    hasSessionRef.current = false;
    if (accessToken) await revokeGoogleAccessToken(accessToken);
    trackEvent("sign_out", { provider: "google" });
    setToast({ message: "Signed out", type: "success" });
  }, []);

  const syncNow = useCallback(() => {
    if (accessTokenRef.current) scheduleUpload();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, syncNow, syncVersion }}>
      {children}
      {toast && (
        <div
          className={`fixed inset-x-0 bottom-6 z-50 mx-auto w-fit animate-[fadeInUp_0.3s_ease-out] rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-opacity duration-700 ease-in-out ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
              : "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
          } ${toastFading ? "opacity-0" : "opacity-100"}`}
        >
          {toast.type === "error" ? "x" : "✓"} {toast.message}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function mapGoogleProfile(profile: GoogleProfile): AppUser {
  return {
    id: profile.id,
    provider: "google",
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
  };
}

function readStoredGoogleUser(): AppUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORED_GOOGLE_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AppUser;
    if (!user || user.provider !== "google" || !user.id || !user.name) return null;
    return user;
  } catch {
    return null;
  }
}

function storeGoogleUser(user: AppUser): void {
  try {
    window.localStorage.setItem(STORED_GOOGLE_USER_KEY, JSON.stringify(user));
  } catch {
    // Progress still works without persisted auth UI state.
  }
}

function clearStoredGoogleUser(): void {
  try {
    window.localStorage.removeItem(STORED_GOOGLE_USER_KEY);
  } catch {
    // Ignore storage failures; sign-out should still clear in-memory auth.
  }
}
