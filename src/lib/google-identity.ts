const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";
const GOOGLE_USERINFO = "https://www.googleapis.com/oauth2/v3/userinfo";

export const GOOGLE_DRIVE_SYNC_SCOPE = [
  "https://www.googleapis.com/auth/drive.appdata",
  "profile",
  "email",
].join(" ");

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
  callback: (response: GoogleTokenResponse) => void;
}

interface GoogleAccounts {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
    }) => GoogleTokenClient;
    revoke: (token: string, done?: () => void) => void;
  };
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

let scriptPromise: Promise<void> | null = null;
let tokenClient: GoogleTokenClient | null = null;

export interface GoogleProfile {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
}

export function isGoogleDriveSyncConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
}

export async function requestGoogleAccessToken(prompt: "" | "consent" = "consent"): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("Google Drive sync is not configured.");

  await loadGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    const client = getTokenClient(clientId);
    client.callback = (response) => {
      if (response.error || !response.access_token) {
        reject(new Error(response.error || "Google sign-in was cancelled."));
        return;
      }
      resolve(response.access_token);
    };
    client.requestAccessToken({ prompt });
  });
}

export async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch(GOOGLE_USERINFO, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error(`Google profile fetch failed (${res.status})`);
  const data = (await res.json()) as {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };
  return {
    id: data.sub,
    email: data.email,
    name: data.name ?? data.email ?? "Google user",
    avatarUrl: data.picture,
  };
}

export async function revokeGoogleAccessToken(accessToken: string): Promise<void> {
  await loadGoogleIdentityScript();
  await new Promise<void>((resolve) => {
    window.google?.accounts.oauth2.revoke(accessToken, resolve);
  });
}

function getTokenClient(clientId: string): GoogleTokenClient {
  if (!tokenClient) {
    tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_DRIVE_SYNC_SCOPE,
      callback: () => {},
    });
  }
  return tokenClient;
}

function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Google sign-in requires a browser."));
  if (window.google?.accounts) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}
