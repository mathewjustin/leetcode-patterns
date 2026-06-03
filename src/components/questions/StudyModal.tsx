"use client";

import { BookOpen, Bug, ExternalLink, X } from "lucide-react";
import type { Question } from "@/types/question";
import { getStudyGuide } from "@/lib/study";
import TwoSumAnimation from "./TwoSumAnimation";

interface StudyModalProps {
  question: Question;
  onClose: () => void;
}

export default function StudyModal({ question, onClose }: StudyModalProps) {
  const guide = getStudyGuide(question);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <section
        aria-modal="true"
        role="dialog"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-950"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {guide.pattern}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {question.difficulty}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              {question.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Close study guide"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto px-4 py-4 pb-6 sm:px-5">
          <StudyAnimation question={question} />

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-4">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Pattern Lens
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {guide.mentalModel}
                </p>
              </div>

              <StudyList title="When To Reach For It" items={guide.recognition} />
              <StudyList title="Solve Plan" items={guide.plan} ordered />
              <StudyList title="Edge Cases" items={guide.edgeCases} />

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Complexity Target
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {guide.complexityTarget}
                </p>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                  <Bug className="h-4 w-4" />
                  Debug Drill
                </h3>
                <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/80">
                  {guide.bugPrompt}
                </p>
                <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
                  <code>{guide.buggyCode}</code>
                </pre>
              </div>

              <StudyList title="Fix Hints" items={guide.fixHints} />

              <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Practice Loop
                </h3>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Predict the bug before reading the hints.</li>
                  <li>Write the invariant in your own note.</li>
                  <li>Solve on LeetCode, then mark this row complete.</li>
                </ol>
              </div>
            </aside>
          </div>
        </div>

        <footer className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <a
            href={`https://leetcode.com/problems/${question.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Open LeetCode
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to list
          </button>
        </footer>
      </section>
    </div>
  );
}

function StudyAnimation({ question }: { question: Question }) {
  if (question.slug !== "two-sum") return null;

  return (
    <div className="mb-4">
      <TwoSumAnimation />
    </div>
  );
}

function StudyList({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <List
        className={`mt-2 space-y-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-300 ${
          ordered ? "list-decimal pl-5" : "list-disc pl-5"
        }`}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </div>
  );
}
