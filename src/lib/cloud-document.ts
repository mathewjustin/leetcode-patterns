import type { ProgressPayload } from "./progress-state";
import type { PersonalTipsPayload } from "./tips-state";

export const CLOUD_DOCUMENT_NAME = "justin-leetcode-patterns-store.v1.json";

export interface CloudNamespace<T> {
  version: number;
  updated_at: string;
  data: T;
}

export interface CloudDocument {
  version: 1;
  app: {
    id: "leetcode-patterns";
    name: "LeetCode Patterns";
    updated_at: string;
  };
  namespaces: {
    progress?: CloudNamespace<ProgressPayload>;
    personal_tips?: CloudNamespace<PersonalTipsPayload>;
    [namespace: string]: CloudNamespace<unknown> | undefined;
  };
}

export function createCloudDocument(): CloudDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    app: {
      id: "leetcode-patterns",
      name: "LeetCode Patterns",
      updated_at: now,
    },
    namespaces: {},
  };
}

export function normalizeCloudDocument(raw: unknown): CloudDocument {
  if (!raw || typeof raw !== "object") return createCloudDocument();
  const doc = raw as Partial<CloudDocument>;
  const fallback = createCloudDocument();

  return {
    version: 1,
    app: {
      id: "leetcode-patterns",
      name: "LeetCode Patterns",
      updated_at: doc.app?.updated_at ?? fallback.app.updated_at,
    },
    namespaces: doc.namespaces && typeof doc.namespaces === "object" ? doc.namespaces : {},
  };
}

export function withProgressNamespace(doc: CloudDocument, progress: ProgressPayload): CloudDocument {
  const now = new Date().toISOString();
  return {
    ...doc,
    app: {
      ...doc.app,
      updated_at: now,
    },
    namespaces: {
      ...doc.namespaces,
      progress: {
        version: 1,
        updated_at: progress.updated_at,
        data: progress,
      },
    },
  };
}

export function withPersonalTipsNamespace(
  doc: CloudDocument,
  personalTips: PersonalTipsPayload,
): CloudDocument {
  const now = new Date().toISOString();
  return {
    ...doc,
    app: {
      ...doc.app,
      updated_at: now,
    },
    namespaces: {
      ...doc.namespaces,
      personal_tips: {
        version: 1,
        updated_at: personalTips.updated_at,
        data: personalTips,
      },
    },
  };
}
