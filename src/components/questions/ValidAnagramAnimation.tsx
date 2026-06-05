"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const source = "anagram";
const target = "nagaram";

const steps = [
  {
    phase: "count",
    label: "Count s",
    index: 0,
    counts: {} as Record<string, number>,
    note: "Start with empty counts. Read s[0] = 'a' and add one a.",
  },
  {
    phase: "count",
    label: "Count s",
    index: 3,
    counts: { a: 2, n: 1 } as Record<string, number>,
    note: "After reading 'ana', the count map remembers a:2 and n:1. Now add g.",
  },
  {
    phase: "spend",
    label: "Spend t",
    index: 0,
    counts: { a: 3, n: 1, g: 1, r: 1, m: 1 } as Record<string, number>,
    note: "Finished s: a:3, n:1, g:1, r:1, m:1. Now read t[0] = 'n' and spend one n.",
  },
  {
    phase: "spend",
    label: "Spend t",
    index: 4,
    counts: { a: 2, g: 1, r: 1, m: 1 } as Record<string, number>,
    note: "After spending 'naga', the remaining need is a:2, g:1, r:1, m:1. Now spend r.",
  },
  {
    phase: "done",
    label: "Balanced",
    index: 6,
    counts: {} as Record<string, number>,
    note: "Every count returned to zero. The strings use the same characters with the same frequencies.",
  },
];

const letters = ["a", "n", "g", "r", "m"];

export default function ValidAnagramAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = steps[stepIndex];
  const activeText = step.phase === "spend" ? target : source;
  const activeChar = activeText[step.index];
  const isDone = step.phase === "done";

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current === steps.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1500);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const complexityRows = useMemo(
    () => [
      ["Length", "Reject unequal lengths first", "O(1)"],
      ["Scan", "Touch each character once", "O(n)"],
      ["Verify", "Check fixed 26 counters", "O(1)"],
      ["Space", "One counter per lowercase letter", "O(1)"],
    ],
    [],
  );

  return (
    <section className="rounded-md border border-violet-200 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
            Valid Anagram Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-violet-950/75 dark:text-violet-100/75">
            s = &quot;anagram&quot;, t = &quot;nagaram&quot;
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <IconButton
            label="Previous step"
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={stepIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </IconButton>
          <IconButton
            label={isPlaying ? "Pause walkthrough" : "Play walkthrough"}
            onClick={() => setIsPlaying((current) => !current)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </IconButton>
          <IconButton
            label="Next step"
            onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}
            disabled={stepIndex === steps.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </IconButton>
          <IconButton
            label="Restart walkthrough"
            onClick={() => {
              setIsPlaying(false);
              setStepIndex(0);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <WordRow label="s" word={source} activeIndex={step.phase === "count" ? step.index : null} />
          <WordRow label="t" word={target} activeIndex={step.phase === "spend" ? step.index : null} />

          <div className="rounded-md border border-violet-200 bg-white p-3 text-sm text-zinc-700 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              {isDone ? "all counts are zero" : `${step.label}: current character = '${activeChar}'`}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            {isDone && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                Return true
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Character Counts
          </h4>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {letters.map((letter) => {
              const count = step.counts[letter] ?? 0;
              const isActive = letter === activeChar && !isDone;

              return (
                <div
                  key={letter}
                  className={`rounded-md border px-2 py-2 text-center ${
                    isDone
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                      : isActive
                        ? "border-violet-400 bg-violet-100 text-violet-950 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-100"
                        : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <div className="text-xs font-medium">{letter}</div>
                  <div className="mt-1 text-xl font-semibold">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Complexity Calculation
        </h4>
        <div className="mt-2 grid gap-2 text-sm">
          {complexityRows.map(([label, reason, resultText]) => (
            <div
              key={label}
              className="grid gap-1 rounded-md bg-zinc-50 px-2 py-2 dark:bg-zinc-900 sm:grid-cols-[4.5rem_minmax(0,1fr)_5rem]"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
              <span className="text-zinc-600 dark:text-zinc-300">{reason}</span>
              <span className="font-semibold text-violet-700 dark:text-violet-300">{resultText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WordRow({
  label,
  word,
  activeIndex,
}: {
  label: string;
  word: string;
  activeIndex: number | null;
}) {
  return (
    <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
      <div className="text-xs font-semibold uppercase text-violet-800 dark:text-violet-200">
        {label}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {word.split("").map((char, index) => (
          <div
            key={`${label}-${char}-${index}`}
            className={`rounded-md border px-2 py-2 text-center text-sm font-semibold ${
              activeIndex === index
                ? "border-violet-400 bg-violet-100 text-violet-950 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-100"
                : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
            }`}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 bg-white text-violet-700 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-900 dark:bg-zinc-950 dark:text-violet-200 dark:hover:bg-violet-950"
    >
      {children}
    </button>
  );
}
