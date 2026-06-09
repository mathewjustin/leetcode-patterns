import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveCompleted,
  saveStarred,
  saveNotes,
  saveSolvedDates,
  saveReminders,
  loadCompleted,
  loadStarred,
  loadNotes,
  loadSolvedDates,
  loadReminders,
  loadPersonalTips,
  savePersonalTips,
} from "@/lib/storage";
import {
  createCloudDocument,
  withPersonalTipsNamespace,
  withProgressNamespace,
  type CloudDocument,
} from "@/lib/cloud-document";
import type { ProgressPayload } from "@/lib/progress-state";
import type { PersonalTipsPayload } from "@/lib/tips-state";

const { mockRead, mockWrite } = vi.hoisted(() => ({
  mockRead: vi.fn(),
  mockWrite: vi.fn(),
}));

vi.mock("@/lib/google-drive", () => ({
  GoogleDriveAppDataStore: vi.fn().mockImplementation(function GoogleDriveAppDataStore() {
    return {
      read: mockRead,
      write: mockWrite,
    };
  }),
}));

import {
  configureGoogleDriveSync,
  downloadAndMerge,
  flushPendingUpload,
  mergeFromRealtimePayload,
  scheduleUpload,
  uploadProgress,
} from "@/lib/sync";

beforeEach(() => {
  localStorage.clear();
  mockRead.mockReset();
  mockWrite.mockReset();
  mockRead.mockResolvedValue({ fileId: null, document: null });
  mockWrite.mockResolvedValue("drive-file-1");
  configureGoogleDriveSync("token");
});

function progress(overrides: Partial<ProgressPayload> = {}): ProgressPayload {
  return {
    completed: [],
    starred: [],
    notes: {},
    solved_dates: {},
    reminders: {},
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function documentWithProgress(payload: ProgressPayload): CloudDocument {
  return withPersonalTipsNamespace(
    withProgressNamespace(createCloudDocument(), payload),
    personalTips(),
  );
}

function personalTips(
  overrides: Partial<PersonalTipsPayload> = {},
): PersonalTipsPayload {
  return {
    items: [],
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("mergeFromRealtimePayload", () => {
  it("applies remote completed when local is empty", () => {
    const changed = mergeFromRealtimePayload(progress({ completed: [1, 2, 3] }) as unknown as Record<string, unknown>);

    expect(changed).toBe(true);
    expect(loadCompleted()).toEqual(new Set([1, 2, 3]));
  });

  it("returns false when remote and local are identical", () => {
    saveCompleted(new Set([1, 2]));
    saveStarred(new Set([3]));
    saveNotes({ 1: "note" });
    saveSolvedDates({ 1: "2026-01-01" });
    saveReminders({ 1: { nextReview: "2026-01-02", interval: 1 } });
    const changed = mergeFromRealtimePayload(progress({
      completed: [1, 2],
      starred: [3],
      notes: { 1: "note" },
      solved_dates: { 1: "2026-01-01" },
      reminders: { 1: { nextReview: "2026-01-02", interval: 1 } },
    }) as unknown as Record<string, unknown>);

    expect(changed).toBe(false);
  });

  it("applies remote notes, solved dates, starred, and reminders", () => {
    const changed = mergeFromRealtimePayload(progress({
      starred: [5],
      notes: { 1: "hello" },
      solved_dates: { 1: "2026-02-02" },
      reminders: { 1: { nextReview: "2026-02-03", interval: 1 } },
    }) as unknown as Record<string, unknown>);

    expect(changed).toBe(true);
    expect(loadStarred()).toEqual(new Set([5]));
    expect(loadNotes()).toEqual({ 1: "hello" });
    expect(loadSolvedDates()).toEqual({ 1: "2026-02-02" });
    expect(loadReminders()).toEqual({ 1: { nextReview: "2026-02-03", interval: 1 } });
  });
});

describe("uploadProgress", () => {
  it("writes current localStorage state to Google Drive app data", async () => {
    saveCompleted(new Set([1, 2]));
    saveStarred(new Set([3]));
    saveNotes({ 1: "note" });
    saveSolvedDates({ 1: "2026-01-01" });
    saveReminders({ 1: { nextReview: "2026-01-02", interval: 1 } });
    savePersonalTips([
      {
        id: "tip-1",
        title: "My tip",
        category: "Arrays",
        content: "Remember this",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ]);

    await uploadProgress();

    expect(mockWrite).toHaveBeenCalledWith(
      expect.objectContaining({
        namespaces: expect.objectContaining({
          progress: expect.objectContaining({
            data: expect.objectContaining({
              completed: [1, 2],
              starred: [3],
              notes: { 1: "note" },
              solved_dates: { 1: "2026-01-01" },
              reminders: { 1: { nextReview: "2026-01-02", interval: 1 } },
            }),
          }),
          personal_tips: expect.objectContaining({
            data: expect.objectContaining({
              items: [
                expect.objectContaining({
                  id: "tip-1",
                  title: "My tip",
                }),
              ],
            }),
          }),
        }),
      }),
      null,
    );
  });

  it("does nothing when Google Drive sync is not configured", async () => {
    configureGoogleDriveSync(null);
    await uploadProgress();
    expect(mockWrite).not.toHaveBeenCalled();
  });
});

describe("downloadAndMerge", () => {
  it("uploads local data when no remote document exists", async () => {
    saveCompleted(new Set([1]));

    const result = await downloadAndMerge();

    expect(result).toBe(false);
    expect(mockWrite).toHaveBeenCalled();
  });

  it("overwrites local progress with remote progress namespace", async () => {
    saveCompleted(new Set([1, 2]));
    mockRead.mockResolvedValueOnce({
      fileId: "drive-file-1",
      document: documentWithProgress(progress({
        completed: [2, 3],
        starred: [8],
        notes: { 8: "remote" },
      })),
    });

    const result = await downloadAndMerge();

    expect(result).toBe(true);
    expect(loadCompleted()).toEqual(new Set([2, 3]));
    expect(loadStarred()).toEqual(new Set([8]));
    expect(loadNotes()).toEqual({ 8: "remote" });
  });

  it("does not upload when remote progress exists", async () => {
    mockRead.mockResolvedValueOnce({
      fileId: "drive-file-1",
      document: documentWithProgress(progress({ completed: [1] })),
    });

    await downloadAndMerge();

    expect(mockWrite).not.toHaveBeenCalled();
  });

  it("restores personal tips from their Drive namespace", async () => {
    const remoteTip = {
      id: "remote-tip",
      title: "Remote tip",
      category: "Graphs",
      content: "Synced from Drive",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    mockRead.mockResolvedValueOnce({
      fileId: "drive-file-1",
      document: withPersonalTipsNamespace(
        withProgressNamespace(createCloudDocument(), progress()),
        personalTips({ items: [remoteTip] }),
      ),
    });

    const result = await downloadAndMerge();

    expect(result).toBe(true);
    expect(loadPersonalTips()).toEqual([remoteTip]);
  });

  it("adds missing personal tips namespace without replacing remote progress", async () => {
    savePersonalTips([
      {
        id: "local-tip",
        title: "Local tip",
        category: "Arrays",
        content: "Keep this",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ]);
    mockRead.mockResolvedValueOnce({
      fileId: "drive-file-1",
      document: withProgressNamespace(
        createCloudDocument(),
        progress({ completed: [9] }),
      ),
    });

    await downloadAndMerge();

    expect(loadCompleted()).toEqual(new Set([9]));
    expect(mockWrite).toHaveBeenCalledWith(
      expect.objectContaining({
        namespaces: expect.objectContaining({
          progress: expect.objectContaining({
            data: expect.objectContaining({ completed: [9] }),
          }),
          personal_tips: expect.objectContaining({
            data: expect.objectContaining({
              items: [expect.objectContaining({ id: "local-tip" })],
            }),
          }),
        }),
      }),
      "drive-file-1",
    );
  });

  it("merges signed-out local tips into an existing Drive namespace", async () => {
    const localTip = {
      id: "local-tip",
      title: "Local tip",
      category: "Arrays",
      content: "Created before sign-in",
      createdAt: "2026-06-09T01:00:00.000Z",
      updatedAt: "2026-06-09T01:00:00.000Z",
    };
    const remoteTip = {
      id: "remote-tip",
      title: "Remote tip",
      category: "Graphs",
      content: "Already in Drive",
      createdAt: "2026-06-08T01:00:00.000Z",
      updatedAt: "2026-06-08T01:00:00.000Z",
    };
    savePersonalTips([localTip]);
    mockRead.mockResolvedValueOnce({
      fileId: "drive-file-1",
      document: withPersonalTipsNamespace(
        withProgressNamespace(createCloudDocument(), progress()),
        personalTips({ items: [remoteTip] }),
      ),
    });

    await downloadAndMerge();

    expect(loadPersonalTips()).toEqual([localTip, remoteTip]);
    expect(mockWrite).toHaveBeenCalledWith(
      expect.objectContaining({
        namespaces: expect.objectContaining({
          personal_tips: expect.objectContaining({
            data: expect.objectContaining({
              items: [localTip, remoteTip],
            }),
          }),
        }),
      }),
      "drive-file-1",
    );
  });
});

describe("scheduleUpload", () => {
  it("debounces upload calls", async () => {
    vi.useFakeTimers();

    scheduleUpload();
    scheduleUpload();
    scheduleUpload();

    expect(mockWrite).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(mockWrite).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

describe("flushPendingUpload", () => {
  it("fires the pending upload immediately without waiting for debounce", async () => {
    vi.useFakeTimers();

    scheduleUpload();
    expect(mockWrite).not.toHaveBeenCalled();

    flushPendingUpload();

    await vi.advanceTimersByTimeAsync(0);
    expect(mockWrite).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1000);
    expect(mockWrite).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("does nothing when there is no pending upload", () => {
    flushPendingUpload();
    expect(mockWrite).not.toHaveBeenCalled();
  });
});
