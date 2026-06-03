"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const nums = [2, 7, 11, 15];
const target = 9;

const steps = [
  {
    index: 0,
    seen: [] as Array<[number, number]>,
    complement: 7,
    foundIndex: null,
    note: "At i=0, 9 - 2 = 7. The map is empty, so store 2 -> 0.",
  },
  {
    index: 1,
    seen: [[2, 0]] as Array<[number, number]>,
    complement: 2,
    foundIndex: 0,
    note: "At i=1, 9 - 7 = 2. The map has 2 at index 0, so return [0, 1].",
  },
];

export default function TwoSumAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = steps[stepIndex];
  const result = step.foundIndex === null ? null : [step.foundIndex, step.index];

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
      ["Map lookup", "Average O(1) per number", "n x O(1)"],
      ["Time", "n constant-time checks", "O(n)"],
      ["Space", "Up to n stored values before a match", "O(n)"],
    ],
    [],
  );

  return (
    <section className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-blue-950 dark:text-blue-100">
            Two Sum Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-blue-950/75 dark:text-blue-100/75">
            nums = [2, 7, 11, 15], target = 9
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
              const isMatch = result?.includes(index) ?? false;

              return (
                <div
                  key={`${value}-${index}`}
                  className={`min-h-20 rounded-md border p-2 text-center transition-colors sm:min-h-20 ${
                    isMatch
                      ? "border-emerald-400 bg-emerald-100 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-100"
                      : isCurrent
                        ? "border-blue-500 bg-white text-blue-950 shadow-sm dark:border-blue-400 dark:bg-zinc-950 dark:text-blue-100"
                        : "border-blue-200 bg-white/70 text-blue-950/70 dark:border-blue-900 dark:bg-zinc-950/60 dark:text-blue-100/60"
                  }`}
                >
                  <div className="text-xs font-medium">index {index}</div>
                  <div className="mt-2 text-2xl font-semibold">{value}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-md border border-blue-200 bg-white p-3 text-sm text-zinc-700 dark:border-blue-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              complement = {target} - {nums[step.index]} = {step.complement}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            {result && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                Return [{result.join(", ")}]
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-blue-200 bg-white p-3 dark:border-blue-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Seen Map
          </h4>
          <div className="mt-2 space-y-2">
            {step.seen.length > 0 ? (
              step.seen.map(([value, index]) => (
                <div
                  key={value}
                  className={`flex items-center justify-between rounded-md border px-2 py-1.5 text-sm ${
                    value === step.complement
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                      : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <span>{value}</span>
                  <span className="text-xs">index {index}</span>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-zinc-300 px-2 py-3 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
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
              <span className="font-semibold text-blue-700 dark:text-blue-300">{resultText}</span>
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
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-white text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900 dark:bg-zinc-950 dark:text-blue-200 dark:hover:bg-blue-950"
    >
      {children}
    </button>
  );
}
