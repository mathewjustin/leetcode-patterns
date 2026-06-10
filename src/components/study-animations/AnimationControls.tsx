"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function useWalkthrough(stepCount: number, interval = 1400) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current === stepCount - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, isPlaying, stepCount]);

  return {
    stepIndex,
    isPlaying,
    previous: () => setStepIndex((current) => Math.max(0, current - 1)),
    next: () => setStepIndex((current) => Math.min(stepCount - 1, current + 1)),
    togglePlaying: () => setIsPlaying((current) => !current),
    restart: () => {
      setIsPlaying(false);
      setStepIndex(0);
    },
  };
}

export function AnimationControls({
  stepIndex,
  stepCount,
  isPlaying,
  accent,
  onPrevious,
  onTogglePlaying,
  onNext,
  onRestart,
}: {
  stepIndex: number;
  stepCount: number;
  isPlaying: boolean;
  accent: "indigo" | "violet" | "amber";
  onPrevious: () => void;
  onTogglePlaying: () => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const colorClasses = {
    indigo:
      "border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-950",
    violet:
      "border-violet-200 text-violet-700 hover:bg-violet-100 dark:border-violet-900 dark:text-violet-200 dark:hover:bg-violet-950",
    amber:
      "border-amber-200 text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:text-amber-200 dark:hover:bg-amber-950",
  }[accent];

  return (
    <div className="flex flex-wrap items-center gap-1">
      <IconButton
        label="Previous step"
        className={colorClasses}
        onClick={onPrevious}
        disabled={stepIndex === 0}
      >
        <SkipBack className="h-4 w-4" />
      </IconButton>
      <IconButton
        label={isPlaying ? "Pause walkthrough" : "Play walkthrough"}
        className={colorClasses}
        onClick={onTogglePlaying}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </IconButton>
      <IconButton
        label="Next step"
        className={colorClasses}
        onClick={onNext}
        disabled={stepIndex === stepCount - 1}
      >
        <SkipForward className="h-4 w-4" />
      </IconButton>
      <IconButton
        label="Restart walkthrough"
        className={colorClasses}
        onClick={onRestart}
      >
        <RotateCcw className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

export function ComplexityTable({
  rows,
  accentClass,
}: {
  rows: string[][];
  accentClass: string;
}) {
  return (
    <div className="mt-4 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Complexity Calculation
      </h4>
      <div className="mt-2 grid gap-2 text-sm">
        {rows.map(([label, reason, result]) => (
          <div
            key={label}
            className="grid gap-1 rounded-md bg-zinc-50 px-2 py-2 dark:bg-zinc-900 sm:grid-cols-[4.5rem_minmax(0,1fr)_5rem]"
          >
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
            <span className="text-zinc-600 dark:text-zinc-300">{reason}</span>
            <span className={`font-semibold ${accentClass}`}>{result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  className,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  className: string;
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
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-950 ${className}`}
    >
      {children}
    </button>
  );
}
