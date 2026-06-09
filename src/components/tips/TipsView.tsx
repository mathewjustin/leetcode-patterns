"use client";

import { useMemo, useState } from "react";
import {
  BookOpenText,
  Lightbulb,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import ConfirmModal from "@/components/questions/ConfirmModal";
import {
  loadPersonalTips,
  savePersonalTips,
  STARTER_TIPS,
} from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import {
  useAuth,
  type AppUser,
} from "@/components/layout/AuthContext";
import type { Tip } from "@/types/tip";

interface TipDraft {
  title: string;
  category: string;
  content: string;
  code: string;
}

const EMPTY_DRAFT: TipDraft = {
  title: "",
  category: "Arrays",
  content: "",
  code: "",
};

function now() {
  return new Date().toISOString();
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tip-${Date.now()}`;
}

export default function TipsView() {
  const { user, syncNow, syncVersion } = useAuth();
  return (
    <TipsContent key={syncVersion} user={user} syncNow={syncNow} />
  );
}

function TipsContent({
  user,
  syncNow,
}: {
  user: AppUser | null;
  syncNow: () => void;
}) {
  const [personalTips, setPersonalTips] = useState<Tip[]>(() =>
    loadPersonalTips(),
  );
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TipDraft>(EMPTY_DRAFT);
  const [showEditor, setShowEditor] = useState(false);
  const [deletingTip, setDeletingTip] = useState<Tip | null>(null);

  const filteredTips = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const tips = [...STARTER_TIPS, ...personalTips];
    if (!normalized) return tips;
    return tips.filter((tip) =>
      [tip.title, tip.category, tip.content, tip.code ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, personalTips]);

  const persist = (nextTips: Tip[]) => {
    setPersonalTips(nextTips);
    savePersonalTips(nextTips);
    syncNow();
  };

  const startAdding = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setShowEditor(true);
  };

  const startEditing = (tip: Tip) => {
    setEditingId(tip.id);
    setDraft({
      title: tip.title,
      category: tip.category,
      content: tip.content,
      code: tip.code ?? "",
    });
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

  const saveDraft = () => {
    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title || !content) return;

    const timestamp = now();
    if (editingId) {
      persist(
        personalTips.map((tip) =>
          tip.id === editingId
            ? {
                ...tip,
                title,
                category: draft.category.trim() || "General",
                content,
                code: draft.code.trim() || undefined,
                updatedAt: timestamp,
              }
            : tip,
        ),
      );
      trackEvent("personal_tip_update");
    } else {
      persist([
        {
          id: makeId(),
          title,
          category: draft.category.trim() || "General",
          content,
          code: draft.code.trim() || undefined,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        ...personalTips,
      ]);
      trackEvent("personal_tip_add");
    }
    closeEditor();
  };

  const deleteTip = () => {
    if (!deletingTip) return;
    persist(personalTips.filter((tip) => tip.id !== deletingTip.id));
    setDeletingTip(null);
    trackEvent("personal_tip_delete");
  };

  return (
    <section>
      <div className="mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 dark:border-amber-900/70 dark:from-amber-950/30 dark:via-zinc-950 dark:to-orange-950/20 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Lightbulb className="h-4 w-4" />
              Personal learning notebook
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">My Tips</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Built-in tips stay unchanged for everyone. Your own tips are stored
              locally and {user ? "synced to your private Google Drive app data." : "sync to your private Google Drive app data when you sign in."}
            </p>
          </div>
          <button
            type="button"
            onClick={startAdding}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-sm transition-colors hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            Add tip
          </button>
        </div>
      </div>

      {showEditor && (
        <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm dark:border-blue-900 dark:bg-blue-950/20">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editingId ? "Edit tip" : "Add a new tip"}
            </h3>
            <button
              type="button"
              onClick={closeEditor}
              aria-label="Close tip editor"
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-white dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
            <label className="text-sm font-medium">
              Title
              <input
                autoFocus
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                placeholder="What did you learn?"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-normal outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="text-sm font-medium">
              Category
              <input
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
                placeholder="Arrays"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-normal outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium">
            Explanation
            <textarea
              rows={5}
              value={draft.content}
              onChange={(event) =>
                setDraft({ ...draft, content: event.target.value })
              }
              placeholder="Describe the idea and why it works..."
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-normal leading-6 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Code example <span className="font-normal text-zinc-400">(optional)</span>
            <textarea
              rows={6}
              value={draft.code}
              onChange={(event) =>
                setDraft({ ...draft, code: event.target.value })
              }
              placeholder="moveRight = !moveRight;"
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-950 px-3 py-2 font-mono text-sm leading-6 text-zinc-100 outline-none focus:border-blue-500"
            />
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={!draft.title.trim() || !draft.content.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save tip
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <label className="relative block flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <span className="sr-only">Search tips</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your tips"
            className="w-full rounded-xl border border-zinc-300 bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500 dark:border-zinc-700"
          />
        </label>
        <span className="shrink-0 text-sm text-zinc-500">
          {filteredTips.length} {filteredTips.length === 1 ? "tip" : "tips"}
        </span>
      </div>

      {filteredTips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-14 text-center dark:border-zinc-700">
          <BookOpenText className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
          <h3 className="font-semibold">No tips found</h3>
          <p className="mt-1 text-sm text-zinc-500">
            {query ? "Try a different search." : "Add the first lesson you want to remember."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTips.map((tip) => {
            const isBuiltIn = STARTER_TIPS.some(
              (starterTip) => starterTip.id === tip.id,
            );
            return (
            <article
              key={tip.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {tip.category}
                    </span>
                    {isBuiltIn && (
                      <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        Built in
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold leading-6">{tip.title}</h3>
                </div>
                {!isBuiltIn && (
                  <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEditing(tip)}
                    aria-label={`Edit ${tip.title}`}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTip(tip)}
                    aria-label={`Delete ${tip.title}`}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  </div>
                )}
              </div>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {tip.content}
              </p>
              {tip.code && (
                <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
                  <code>{tip.code}</code>
                </pre>
              )}
              <p className="mt-auto pt-4 text-xs text-zinc-400">
                Learned {formatDate(tip.createdAt)}
                {tip.updatedAt !== tip.createdAt &&
                  ` · Updated ${formatDate(tip.updatedAt)}`}
              </p>
            </article>
            );
          })}
        </div>
      )}

      {deletingTip && (
        <ConfirmModal
          title="Delete tip?"
          message={
            <>
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {deletingTip.title}
              </span>{" "}
              will be removed locally and from your synced private Drive data.
            </>
          }
          confirmLabel="Delete tip"
          onConfirm={deleteTip}
          onCancel={() => setDeletingTip(null)}
        />
      )}
    </section>
  );
}
