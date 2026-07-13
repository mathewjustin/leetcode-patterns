import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const {
  mockIsConfigured,
  mockRequestGoogleAccessToken,
  mockFetchGoogleProfile,
  mockRevokeGoogleAccessToken,
  mockConfigureGoogleDriveSync,
  mockDownloadAndMerge,
  mockScheduleUpload,
  mockTrackEvent,
} = vi.hoisted(() => ({
  mockIsConfigured: vi.fn(() => true),
  mockRequestGoogleAccessToken: vi.fn(),
  mockFetchGoogleProfile: vi.fn(),
  mockRevokeGoogleAccessToken: vi.fn(),
  mockConfigureGoogleDriveSync: vi.fn(),
  mockDownloadAndMerge: vi.fn(),
  mockScheduleUpload: vi.fn(),
  mockTrackEvent: vi.fn(),
}));

vi.mock("@/lib/google-identity", () => ({
  isGoogleDriveSyncConfigured: mockIsConfigured,
  requestGoogleAccessToken: mockRequestGoogleAccessToken,
  fetchGoogleProfile: mockFetchGoogleProfile,
  revokeGoogleAccessToken: mockRevokeGoogleAccessToken,
}));

vi.mock("@/lib/sync", () => ({
  configureGoogleDriveSync: mockConfigureGoogleDriveSync,
  downloadAndMerge: mockDownloadAndMerge,
  scheduleUpload: mockScheduleUpload,
  flushPendingUpload: vi.fn(),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: mockTrackEvent,
}));

import { AuthProvider, useAuth } from "@/components/layout/AuthContext";

const fakeProfile = {
  id: "google-user-1",
  name: "Test User",
  email: "test@example.com",
  avatarUrl: "https://example.com/avatar.png",
};

const storedGoogleUserKey = "leetcode-patterns.google-user";

function TestConsumer() {
  const { user, signIn, signOut, syncNow } = useAuth();
  return (
    <div>
      <p>{user ? `signed-in:${user.name}` : "signed-out"}</p>
      <button onClick={signIn}>sign-in</button>
      <button onClick={signOut}>sign-out</button>
      <button onClick={syncNow}>sync-now</button>
    </div>
  );
}

describe("AuthProvider Google Drive sync", () => {
  beforeEach(() => {
    mockIsConfigured.mockReturnValue(true);
    mockRequestGoogleAccessToken.mockResolvedValue("access-token");
    mockFetchGoogleProfile.mockResolvedValue(fakeProfile);
    mockDownloadAndMerge.mockResolvedValue(false);
    mockRevokeGoogleAccessToken.mockResolvedValue(undefined);
    mockRequestGoogleAccessToken.mockClear();
    mockFetchGoogleProfile.mockClear();
    mockDownloadAndMerge.mockClear();
    mockConfigureGoogleDriveSync.mockClear();
    mockScheduleUpload.mockClear();
    mockTrackEvent.mockClear();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("signs in with Google and downloads Drive progress", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    await user.click(screen.getByRole("button", { name: "sign-in" }));

    expect(await screen.findByText("signed-in:Test User")).toBeInTheDocument();
    expect(mockRequestGoogleAccessToken).toHaveBeenCalledWith("consent");
    expect(mockConfigureGoogleDriveSync).toHaveBeenCalledWith("access-token");
    expect(mockDownloadAndMerge).toHaveBeenCalledWith();
    expect(mockTrackEvent).toHaveBeenCalledWith("sign_in", { provider: "google" });
    expect(screen.getByText(/Signed in as Test User/)).toBeInTheDocument();
  });

  it("does not request Google access before a user clicks sign in", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    expect(screen.getByText("signed-out")).toBeInTheDocument();
    expect(mockRequestGoogleAccessToken).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "sign-in" }));

    expect(await screen.findByText("signed-in:Test User")).toBeInTheDocument();
    expect(mockRequestGoogleAccessToken).toHaveBeenCalledWith("consent");
  });

  it("restores a previous Google session silently after refresh", async () => {
    let resolveToken: (token: string) => void = () => {};
    mockRequestGoogleAccessToken.mockReturnValue(new Promise((resolve) => {
      resolveToken = resolve;
    }));
    window.localStorage.setItem(storedGoogleUserKey, JSON.stringify({
      id: "google-user-1",
      provider: "google",
      name: "Cached User",
      email: "cached@example.com",
      avatarUrl: "https://example.com/cached.png",
    }));

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    expect(screen.getByText("signed-in:Cached User")).toBeInTheDocument();
    expect(mockRequestGoogleAccessToken).toHaveBeenCalledWith("");
    await act(async () => {
      resolveToken("access-token");
    });
    expect(await screen.findByText("signed-in:Test User")).toBeInTheDocument();
    expect(mockConfigureGoogleDriveSync).toHaveBeenCalledWith("access-token");
    expect(mockDownloadAndMerge).toHaveBeenCalledWith();
    expect(mockTrackEvent).not.toHaveBeenCalledWith("sign_in", { provider: "google" });
  });

  it("clears the cached Google session when silent refresh fails", async () => {
    let rejectToken: (error: Error) => void = () => {};
    mockRequestGoogleAccessToken.mockReturnValue(new Promise((_, reject) => {
      rejectToken = reject;
    }));
    window.localStorage.setItem(storedGoogleUserKey, JSON.stringify({
      id: "google-user-1",
      provider: "google",
      name: "Cached User",
    }));

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    expect(screen.getByText("signed-in:Cached User")).toBeInTheDocument();
    await act(async () => {
      rejectToken(new Error("interaction required"));
    });
    expect(await screen.findByText("signed-out")).toBeInTheDocument();
    expect(mockConfigureGoogleDriveSync).toHaveBeenCalledWith(null);
    expect(window.localStorage.getItem(storedGoogleUserKey)).toBeNull();
  });

  it("shows a local-only toast when Google sync is not configured", async () => {
    mockIsConfigured.mockReturnValue(false);
    const user = userEvent.setup();

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    await user.click(screen.getByRole("button", { name: "sign-in" }));

    expect(screen.getByText(/Google Drive sync is not configured/)).toBeInTheDocument();
    expect(mockRequestGoogleAccessToken).not.toHaveBeenCalled();
  });

  it("schedules uploads only after a Google token is configured", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    await user.click(screen.getByRole("button", { name: "sync-now" }));
    expect(mockScheduleUpload).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "sign-in" }));
    await screen.findByText("signed-in:Test User");
    await user.click(screen.getByRole("button", { name: "sync-now" }));

    expect(mockScheduleUpload).toHaveBeenCalledWith();
  });

  it("revokes the token and clears sync on sign-out", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );
    });

    await user.click(screen.getByRole("button", { name: "sign-in" }));
    await screen.findByText("signed-in:Test User");
    await user.click(screen.getByRole("button", { name: "sign-out" }));

    expect(mockRevokeGoogleAccessToken).toHaveBeenCalledWith("access-token");
    expect(mockConfigureGoogleDriveSync).toHaveBeenCalledWith(null);
    expect(window.localStorage.getItem(storedGoogleUserKey)).toBeNull();
    expect(screen.getByText("signed-out")).toBeInTheDocument();
  });
});
