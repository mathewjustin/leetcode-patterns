"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const nums = [100, 4, 200, 1, 3, 2];
const setValues = [...nums].sort((a, b) => a - b);
const candidates = setValues.map((value) => {
  const isStart = !setValues.includes(value - 1);
  let length = 1;
  if (isStart) {
    while (setValues.includes(value + length)) length++;
  }

  return {
    value,
    isStart,
    chain: Array.from({ length }, (_, offset) => value + offset),
    best: isStart ? length : 0,
    note: isStart
      ? `${value} has no ${value - 1}, so it starts a sequence. Count forward while the set contains the next number.`
      : `${value} is skipped because ${value - 1} already starts this chain.`,
  };
});

const steps = candidates.map((candidate, index) => ({
  ...candidate,
  best: Math.max(...candidates.slice(0, index + 1).map((item) => item.best)),
}));

export default function LongestConsecutiveSequenceAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1600);
  const step = steps[walkthrough.stepIndex];

  return (
    <section className="overflow-hidden rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
            Longest Consecutive Sequence: Start at Heads
          </h3>
          <p className="mt-1 text-sm leading-6 text-amber-950/70 dark:text-amber-100/70">
            nums = [100, 4, 200, 1, 3, 2] to set lookup gives O(1) membership checks.
          </p>
        </div>
        <AnimationControls
          {...walkthrough}
          stepCount={steps.length}
          accent="amber"
          onPrevious={walkthrough.previous}
          onTogglePlaying={walkthrough.togglePlaying}
          onNext={walkthrough.next}
          onRestart={walkthrough.restart}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-md border border-amber-200 bg-white p-3 dark:border-amber-900 dark:bg-zinc-950">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {setValues.map((value) => {
              const active = value === step.value;
              const inChain = step.chain.includes(value);

              return (
                <div
                  key={value}
                  className={`min-h-20 rounded-md border p-2 text-center transition-colors ${
                    active
                      ? "border-amber-500 bg-amber-100 text-amber-950 shadow-sm dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100"
                      : inChain
                        ? "border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                        : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  <div className="text-xs font-medium">value</div>
                  <div className="mt-2 text-2xl font-black">{value}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">
              current decision
            </div>
            <div className="mt-1 font-mono text-lg font-black text-amber-950 dark:text-amber-100">
              {step.value - 1} in set? {step.isStart ? "no" : "yes"}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {step.note}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-amber-200 bg-white p-3 dark:border-amber-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Sequence Counter
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {step.chain.map((value) => (
              <span
                key={value}
                className="rounded-md bg-emerald-100 px-3 py-2 font-mono text-sm font-bold text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"
              >
                {value}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <Metric label="chain length" value={step.isStart ? step.chain.length : 0} />
            <Metric label="best so far" value={step.best} />
          </div>
          {walkthrough.stepIndex === steps.length - 1 && (
            <div className="mt-3 rounded-md bg-emerald-100 px-3 py-2 text-center font-bold text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
              Return 4 for [1, 2, 3, 4]
            </div>
          )}
        </div>
      </div>

      <ComplexityTable
        accentClass="text-amber-700 dark:text-amber-300"
        rows={[
          ["Set", "Insert every number once", "O(n)"],
          ["Starts", "Skip values with a predecessor", "O(n)"],
          ["Counts", "Each chain is counted from its head", "O(n)"],
          ["Space", "Hash set stores unique values", "O(n)"],
        ]}
      />
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-zinc-50 px-3 py-3 dark:bg-zinc-900">
      <div className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black text-zinc-950 dark:text-zinc-50">
        {value}
      </div>
    </div>
  );
}
