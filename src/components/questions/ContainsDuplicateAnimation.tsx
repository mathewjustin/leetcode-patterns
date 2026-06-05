"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const nums = [1, 2, 3, 1];

const steps = [
  {
    index: 0,
    seen: [] as number[],
    duplicate: false,
    note: "At i=0, the set is empty. 1 has not appeared, so add 1.",
  },
  {
    index: 1,
    seen: [1],
    duplicate: false,
    note: "At i=1, 2 is not in the set. Add 2 and keep scanning.",
  },
  {
    index: 2,
    seen: [1, 2],
    duplicate: false,
    note: "At i=2, 3 is not in the set. Add 3 and keep scanning.",
  },
  {
    index: 3,
    seen: [1, 2, 3],
    duplicate: true,
    note: "At i=3, 1 is already in the set. One repeat is enough, so return true.",
  },
];

export default function ContainsDuplicateAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = steps[stepIndex];
  const currentValue = nums[step.index];

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
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const complexityRows = useMemo(
    () => [
      ["Loop", "One pass over n numbers", "n iterations"],
      ["Set lookup", "Average O(1) per number", "n x O(1)"],
      ["Time", "n constant-time checks", "O(n)"],
      ["Space", "Up to n unique values stored", "O(n)"],
    ],
    [],
  );

  return (
    <section className="rounded-md border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">
            Contains Duplicate Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-cyan-950/75 dark:text-cyan-100/75">
            nums = [1, 2, 3, 1]
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {nums.map((value, index) => {
              const isCurrent = index === step.index;
              const isDuplicateHit = step.duplicate && value === currentValue;

              return (
                <div
                  key={`${value}-${index}`}
                  className={`min-h-20 rounded-md border p-2 text-center transition-colors ${
                    isDuplicateHit
                      ? "border-rose-400 bg-rose-100 text-rose-950 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-100"
                      : isCurrent
                        ? "border-cyan-500 bg-white text-cyan-950 shadow-sm dark:border-cyan-400 dark:bg-zinc-950 dark:text-cyan-100"
                        : "border-cyan-200 bg-white/70 text-cyan-950/70 dark:border-cyan-900 dark:bg-zinc-950/60 dark:text-cyan-100/60"
                  }`}
                >
                  <div className="text-xs font-medium">index {index}</div>
                  <div className="mt-2 text-2xl font-semibold">{value}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-md border border-cyan-200 bg-white p-3 text-sm text-zinc-700 dark:border-cyan-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              seen.contains({currentValue}) = {step.duplicate ? "true" : "false"}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            {step.duplicate && (
              <div className="mt-2 rounded-md bg-rose-100 px-2 py-1 font-medium text-rose-900 dark:bg-rose-950 dark:text-rose-100">
                Return true
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Seen Set
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {step.seen.length > 0 ? (
              step.seen.map((value) => (
                <span
                  key={value}
                  className={`rounded-md border px-2 py-1.5 text-sm font-medium ${
                    step.duplicate && value === currentValue
                      ? "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100"
                      : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {value}
                </span>
              ))
            ) : (
              <div className="w-full rounded-md border border-dashed border-zinc-300 px-2 py-3 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                empty
              </div>
            )}
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
              <span className="font-semibold text-cyan-700 dark:text-cyan-300">{resultText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-cyan-900 dark:bg-zinc-950 dark:text-cyan-200 dark:hover:bg-cyan-950"
    >
      {children}
    </button>
  );
}
