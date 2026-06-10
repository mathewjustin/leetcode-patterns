"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const nums = [3, 0, 1];

const steps = [
  {
    index: null,
    before: 3,
    afterIndex: 3,
    afterValue: 3,
    note: "Start with n = 3 so the expected value 3 is included.",
  },
  {
    index: 0,
    before: 3,
    afterIndex: 3,
    afterValue: 0,
    note: "XOR index 0, then value 3. The two 3s cancel to 0.",
  },
  {
    index: 1,
    before: 0,
    afterIndex: 1,
    afterValue: 1,
    note: "XOR index 1, then value 0. Zero changes nothing, so the accumulator is 1.",
  },
  {
    index: 2,
    before: 1,
    afterIndex: 3,
    afterValue: 2,
    note: "XOR index 2, then value 1. Every paired number cancels, leaving 2.",
  },
];

export default function MissingNumberAnimation() {
  const walkthrough = useWalkthrough(steps.length);
  const step = steps[walkthrough.stepIndex];
  const isDone = walkthrough.stepIndex === steps.length - 1;

  return (
    <section className="rounded-md border border-violet-200 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
            XOR Cancellation Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-violet-950/75 dark:text-violet-100/75">
            nums = [3, 0, 1], expected range = [0, 1, 2, 3]
          </p>
        </div>
        <AnimationControls
          {...walkthrough}
          stepCount={steps.length}
          accent="violet"
          onPrevious={walkthrough.previous}
          onTogglePlaying={walkthrough.togglePlaying}
          onNext={walkthrough.next}
          onRestart={walkthrough.restart}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {nums.map((value, index) => (
              <div
                key={index}
                className={`rounded-md border p-3 text-center ${
                  index === step.index
                    ? "border-violet-500 bg-violet-100 text-violet-950 dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-100"
                    : "border-violet-200 bg-white text-zinc-700 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-200"
                }`}
              >
                <div className="text-xs font-medium">index {index}</div>
                <div className="mt-1 text-2xl font-semibold">{value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-md border border-violet-200 bg-white p-3 text-sm text-zinc-700 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              {step.index === null
                ? "missing = n = 3"
                : `${step.before} ^ index ${step.index} = ${step.afterIndex}; ${step.afterIndex} ^ nums[${step.index}] = ${step.afterValue}`}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            {isDone && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                Return 2
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            XOR Accumulator
          </h4>
          <div className="mt-3 rounded-md bg-violet-100 p-4 text-center dark:bg-violet-950/50">
            <div className="text-xs uppercase text-violet-700 dark:text-violet-300">
              missing
            </div>
            <div className="mt-1 text-4xl font-bold text-violet-950 dark:text-violet-100">
              {step.afterValue}
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <Rule text="x ^ x = 0" />
            <Rule text="x ^ 0 = x" />
            <Rule text="XOR order does not matter" />
          </div>
        </div>
      </div>

      <ComplexityTable
        accentClass="text-violet-700 dark:text-violet-300"
        rows={[
          ["Loop", "Visit each array value once", "n steps"],
          ["Work", "Two constant-time XORs per value", "O(1) each"],
          ["Time", "One linear pass", "O(n)"],
          ["Space", "One integer accumulator", "O(1)"],
        ]}
      />
    </section>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-zinc-200 px-2 py-2 text-center font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
      {text}
    </div>
  );
}
