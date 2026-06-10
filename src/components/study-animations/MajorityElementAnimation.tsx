"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const nums = [2, 2, 1, 1, 1, 2, 2];

const steps = [
  { index: 0, candidate: 2, count: 1, action: "Choose 2, then add one vote." },
  { index: 1, candidate: 2, count: 2, action: "2 matches the candidate, so count becomes 2." },
  { index: 2, candidate: 2, count: 1, action: "1 differs from 2, so they cancel one vote." },
  { index: 3, candidate: 2, count: 0, action: "Another 1 cancels the remaining vote for 2." },
  { index: 4, candidate: 1, count: 1, action: "Count is zero, so choose 1 as the new candidate." },
  { index: 5, candidate: 1, count: 0, action: "2 differs from 1, so the pair cancels." },
  { index: 6, candidate: 2, count: 1, action: "Count is zero, so choose 2. It survives as the final candidate." },
];

export default function MajorityElementAnimation() {
  const walkthrough = useWalkthrough(steps.length);
  const step = steps[walkthrough.stepIndex];
  const isDone = walkthrough.stepIndex === steps.length - 1;

  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
            Boyer-Moore Voting Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-amber-950/75 dark:text-amber-100/75">
            nums = [2, 2, 1, 1, 1, 2, 2]
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {nums.map((value, index) => {
              const isCurrent = index === step.index;
              const isProcessed = index < step.index;

              return (
                <div
                  key={index}
                  className={`rounded-md border p-2 text-center ${
                    isCurrent
                      ? "border-amber-500 bg-amber-100 text-amber-950 dark:border-amber-500 dark:bg-amber-950/60 dark:text-amber-100"
                      : isProcessed
                        ? "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                        : "border-amber-200 bg-white text-zinc-700 dark:border-amber-900 dark:bg-zinc-950 dark:text-zinc-200"
                  }`}
                >
                  <div className="text-[10px] font-medium">index {index}</div>
                  <div className="mt-1 text-2xl font-semibold">{value}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-md border border-amber-200 bg-white p-3 text-sm text-zinc-700 dark:border-amber-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              Process nums[{step.index}] = {nums[step.index]}
            </div>
            <p className="mt-1 leading-6">{step.action}</p>
            {isDone && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                Return candidate 2
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-amber-200 bg-white p-3 dark:border-amber-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Vote State
          </h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <StateCard label="candidate" value={step.candidate} />
            <StateCard label="count" value={step.count} />
          </div>
          <div className="mt-3 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            A different value cancels one candidate vote. A strict majority has more votes than all
            other values combined, so it survives every cancellation.
          </div>
        </div>
      </div>

      <ComplexityTable
        accentClass="text-amber-700 dark:text-amber-300"
        rows={[
          ["Loop", "Process each number once", "n steps"],
          ["State", "Candidate and vote count only", "2 integers"],
          ["Time", "One linear voting pass", "O(n)"],
          ["Space", "No frequency table", "O(1)"],
        ]}
      />
    </section>
  );
}

function StateCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-amber-100 p-3 text-center dark:bg-amber-950/50">
      <div className="text-xs uppercase text-amber-700 dark:text-amber-300">{label}</div>
      <div className="mt-1 text-3xl font-bold text-amber-950 dark:text-amber-100">{value}</div>
    </div>
  );
}
