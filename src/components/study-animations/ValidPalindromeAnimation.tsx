"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const phrase = "A man, a plan, a canal: Panama";
const normalized = "amanaplanacanalpanama";
const originalChars = phrase.split("");

const steps = [
  {
    label: "Normalize",
    left: null,
    right: null,
    activeOriginal: [0],
    normalizedLeft: null,
    normalizedRight: null,
    note: "Ignore case and keep only letters and digits. 'A' becomes 'a' and punctuation will be skipped.",
  },
  {
    label: "Compare ends",
    left: 0,
    right: normalized.length - 1,
    activeOriginal: [0, phrase.length - 1],
    normalizedLeft: 0,
    normalizedRight: normalized.length - 1,
    note: "left sees 'a' and right sees 'a'. They match, so both pointers move inward.",
  },
  {
    label: "Skip noise",
    left: 1,
    right: 19,
    activeOriginal: [2, 28],
    normalizedLeft: 1,
    normalizedRight: 19,
    note: "Spaces, commas, and the colon never enter the comparison. The next real pair is 'm' and 'm'.",
  },
  {
    label: "Keep closing",
    left: 5,
    right: 16,
    activeOriginal: [7, 23],
    normalizedLeft: 5,
    normalizedRight: 16,
    note: "Every outside pair has matched so far. The unchecked middle is the only part that still matters.",
  },
  {
    label: "Pointers meet",
    left: 10,
    right: 10,
    activeOriginal: [14],
    normalizedLeft: 10,
    normalizedRight: 10,
    note: "The pointers meet in the middle without finding a mismatch, so the cleaned string is a palindrome.",
  },
];

export default function ValidPalindromeAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = steps[stepIndex];
  const isDone = stepIndex === steps.length - 1;
  const comparisonText =
    step.left === null || step.right === null
      ? step.label
      : `left = ${step.left}, right = ${step.right}: '${normalized[step.left]}' vs '${normalized[step.right]}'`;

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
      ["Clean", "Each original character is inspected once", "O(n)"],
      ["Compare", "Each cleaned character is paired at most once", "O(n)"],
      ["Time", "One linear scan with inward pointers", "O(n)"],
      ["Space", "Can compare in place without building a new string", "O(1)"],
    ],
    [],
  );

  return (
    <section className="rounded-md border border-teal-200 bg-teal-50 p-3 dark:border-teal-900 dark:bg-teal-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-teal-950 dark:text-teal-100">
            Valid Palindrome Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-teal-950/75 dark:text-teal-100/75">
            s = &quot;A man, a plan, a canal: Panama&quot;
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <OriginalPhrase activeOriginal={step.activeOriginal} />
          <NormalizedRow
            left={step.normalizedLeft}
            right={step.normalizedRight}
            isDone={isDone}
          />

          <div className="rounded-md border border-teal-200 bg-white p-3 text-sm text-zinc-700 dark:border-teal-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              {comparisonText}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            {isDone && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                Return true
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-teal-200 bg-white p-3 dark:border-teal-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Pointer Invariant
          </h4>
          <div className="mt-3 space-y-2 text-sm">
            <InvariantRow label="Left side" active={step.left !== null} value="already matched" />
            <InvariantRow label="Middle" active={!isDone} value="still unchecked" />
            <InvariantRow label="Right side" active={step.right !== null} value="already matched" />
          </div>
          <div className="mt-3 rounded-md bg-zinc-50 p-2 text-sm leading-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            A mismatch at any pair returns false immediately. Matching pairs let both pointers move
            inward because those outside characters are proven safe.
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
              <span className="font-semibold text-teal-700 dark:text-teal-300">{resultText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OriginalPhrase({ activeOriginal }: { activeOriginal: number[] }) {
  return (
    <div className="rounded-md border border-teal-200 bg-white p-3 dark:border-teal-900 dark:bg-zinc-950">
      <div className="text-xs font-semibold uppercase text-teal-800 dark:text-teal-200">
        original
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {originalChars.map((char, index) => {
          const isKept = /[a-z0-9]/i.test(char);
          const isActive = activeOriginal.includes(index);

          return (
            <div
              key={`${char}-${index}`}
              className={`min-w-8 rounded-md border px-2 py-2 text-center text-sm font-semibold ${
                isActive
                  ? "border-teal-500 bg-teal-100 text-teal-950 dark:border-teal-600 dark:bg-teal-950/60 dark:text-teal-100"
                  : isKept
                    ? "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                    : "border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
              }`}
            >
              {char === " " ? "space" : char}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NormalizedRow({
  left,
  right,
  isDone,
}: {
  left: number | null;
  right: number | null;
  isDone: boolean;
}) {
  return (
    <div className="rounded-md border border-teal-200 bg-white p-3 dark:border-teal-900 dark:bg-zinc-950">
      <div className="text-xs font-semibold uppercase text-teal-800 dark:text-teal-200">
        normalized
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1.5 sm:grid-cols-11">
        {normalized.split("").map((char, index) => {
          const isPointer = index === left || index === right;
          const isMatched = left !== null && right !== null && (index < left || index > right);

          return (
            <div
              key={`${char}-${index}`}
              className={`rounded-md border px-1.5 py-2 text-center text-sm font-semibold ${
                isDone
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : isPointer
                    ? "border-teal-500 bg-teal-100 text-teal-950 dark:border-teal-600 dark:bg-teal-950/60 dark:text-teal-100"
                    : isMatched
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
              }`}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvariantRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md border px-2 py-2 ${
        active
          ? "border-teal-300 bg-teal-50 text-teal-950 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-100"
          : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span>{value}</span>
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
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-teal-200 bg-white text-teal-700 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-teal-900 dark:bg-zinc-950 dark:text-teal-200 dark:hover:bg-teal-950"
    >
      {children}
    </button>
  );
}
