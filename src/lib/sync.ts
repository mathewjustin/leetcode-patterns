import {
  createCloudDocument,
  withPersonalTipsNamespace,
  withProgressNamespace,
  type CloudDocument,
} from "./cloud-document";
import { GoogleDriveAppDataStore } from "./google-drive";
import {
  applyProgressPayload,
  progressPayloadChanged,
  readProgressPayload,
  type ProgressPayload,
} from "./progress-state";
import {
  applyPersonalTipsPayload,
  mergePersonalTips,
  personalTipsPayloadChanged,
  readPersonalTipsPayload,
  type PersonalTipsPayload,
} from "./tips-state";

let driveStore: GoogleDriveAppDataStore | null = null;
let cachedFileId: string | null = null;

export function configureGoogleDriveSync(accessToken: string | null): void {
  driveStore = accessToken ? new GoogleDriveAppDataStore(accessToken) : null;
  cachedFileId = null;
}

export async function uploadProgress(): Promise<void> {
  if (!driveStore) return;

  const existing = await driveStore.read();
  cachedFileId = existing.fileId;
  const document = withCurrentLocalData(
    existing.document ?? createCloudDocument(),
  );
  cachedFileId = await driveStore.write(document, cachedFileId);
}

export async function downloadAndMerge(): Promise<boolean> {
  if (!driveStore) return false;

  const existing = await driveStore.read();
  cachedFileId = existing.fileId;

  if (!existing.document) {
    await uploadProgress();
    return false;
  }

  const remoteProgress = getProgress(existing.document);
  const remotePersonalTips = getPersonalTips(existing.document);
  const progressChanged = remoteProgress
    ? progressPayloadChanged(remoteProgress)
    : false;
  const localPersonalTips = readPersonalTipsPayload();
  const mergedPersonalTips = remotePersonalTips
    ? mergePersonalTips(localPersonalTips.items, remotePersonalTips.items)
    : localPersonalTips.items;
  const personalTipsChanged = personalTipsPayloadChanged({
    items: mergedPersonalTips,
  });
  const remotePersonalTipsChanged = remotePersonalTips
    ? JSON.stringify(remotePersonalTips.items) !==
      JSON.stringify(mergedPersonalTips)
    : true;

  if (progressChanged && remoteProgress) applyProgressPayload(remoteProgress);
  if (personalTipsChanged) {
    applyPersonalTipsPayload({ items: mergedPersonalTips });
  }

  if (!remoteProgress || !remotePersonalTips || remotePersonalTipsChanged) {
    const document = withCurrentLocalData(existing.document);
    cachedFileId = await driveStore.write(document, cachedFileId);
  }

  return progressChanged || personalTipsChanged;
}

let lastUploadAt = 0;

async function doUpload(): Promise<void> {
  lastUploadAt = Date.now();
  await uploadProgress();
}

let uploadTimer: ReturnType<typeof setTimeout> | null = null;
let pendingUpload = false;

export function scheduleUpload(): void {
  if (!driveStore) return;
  pendingUpload = true;
  if (uploadTimer) clearTimeout(uploadTimer);
  uploadTimer = setTimeout(() => {
    pendingUpload = false;
    uploadTimer = null;
    doUpload();
  }, 1000);
}

export function flushPendingUpload(): void {
  if (uploadTimer && pendingUpload) {
    clearTimeout(uploadTimer);
    uploadTimer = null;
    pendingUpload = false;
    doUpload();
  }
}

export function mergeFromRealtimePayload(data: Record<string, unknown>): boolean {
  if (Date.now() - lastUploadAt < 5000) return false;
  const changed = progressPayloadChanged(data as Partial<ProgressPayload>);
  if (changed) applyProgressPayload(data as Partial<ProgressPayload>);
  return changed;
}

function getProgress(document: CloudDocument): ProgressPayload | null {
  const progress = document.namespaces.progress?.data;
  return progress ?? null;
}

function getPersonalTips(document: CloudDocument): PersonalTipsPayload | null {
  const personalTips = document.namespaces.personal_tips?.data;
  return personalTips ?? null;
}

function withCurrentLocalData(document: CloudDocument): CloudDocument {
  return withPersonalTipsNamespace(
    withProgressNamespace(document, readProgressPayload()),
    readPersonalTipsPayload(),
  );
}
