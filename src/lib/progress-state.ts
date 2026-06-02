import {
  loadCompleted,
  loadNotes,
  loadReminders,
  loadSolvedDates,
  loadStarred,
  saveCompleted,
  saveNotes,
  saveReminders,
  saveSolvedDates,
  saveStarred,
} from "./storage";
import type { Reminder } from "./reminders";

export interface ProgressPayload {
  completed: number[];
  starred: number[];
  notes: Record<number, string>;
  solved_dates: Record<number, string>;
  reminders: Record<number, Reminder>;
  updated_at: string;
}

export function readProgressPayload(): ProgressPayload {
  return {
    completed: [...loadCompleted()],
    starred: [...loadStarred()],
    notes: loadNotes(),
    solved_dates: loadSolvedDates(),
    reminders: loadReminders(),
    updated_at: new Date().toISOString(),
  };
}

export function applyProgressPayload(data: Partial<ProgressPayload> | null | undefined): void {
  saveCompleted(new Set<number>(data?.completed ?? []));
  saveStarred(new Set<number>(data?.starred ?? []));
  saveNotes((data?.notes as Record<number, string>) ?? {});
  saveSolvedDates((data?.solved_dates as Record<number, string>) ?? {});
  saveReminders((data?.reminders as Record<number, Reminder>) ?? {});
}

export function progressPayloadChanged(data: Partial<ProgressPayload> | null | undefined): boolean {
  const local = readProgressPayload();
  return (
    !setsEqual(new Set(local.completed), new Set(data?.completed ?? [])) ||
    !setsEqual(new Set(local.starred), new Set(data?.starred ?? [])) ||
    !recordsEqual(local.notes, (data?.notes as Record<number, string>) ?? {}) ||
    !recordsEqual(local.solved_dates, (data?.solved_dates as Record<number, string>) ?? {}) ||
    JSON.stringify(local.reminders) !== JSON.stringify(data?.reminders ?? {})
  );
}

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function recordsEqual(a: Record<number, string>, b: Record<number, string>): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => a[Number(k)] === b[Number(k)]);
}
