import type { Tip } from "@/types/tip";
import { loadPersonalTips, savePersonalTips } from "./storage";

export interface PersonalTipsPayload {
  items: Tip[];
  updated_at: string;
}

export function readPersonalTipsPayload(): PersonalTipsPayload {
  return {
    items: loadPersonalTips(),
    updated_at: new Date().toISOString(),
  };
}

export function applyPersonalTipsPayload(
  data: Partial<PersonalTipsPayload> | null | undefined,
): void {
  savePersonalTips(Array.isArray(data?.items) ? data.items : []);
}

export function personalTipsPayloadChanged(
  data: Partial<PersonalTipsPayload> | null | undefined,
): boolean {
  return JSON.stringify(loadPersonalTips()) !== JSON.stringify(data?.items ?? []);
}

export function mergePersonalTips(local: Tip[], remote: Tip[]): Tip[] {
  const merged = new Map(remote.map((tip) => [tip.id, tip]));

  for (const localTip of local) {
    const remoteTip = merged.get(localTip.id);
    if (
      !remoteTip ||
      Date.parse(localTip.updatedAt) >= Date.parse(remoteTip.updatedAt)
    ) {
      merged.set(localTip.id, localTip);
    }
  }

  return [...merged.values()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}
