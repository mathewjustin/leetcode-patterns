"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const nums = [1, 2, 3, 4];

type Step = {
  phase: "prefix" | "suffix";
  index: number;
  output: number[];
  runningProduct: number;
  factor: number;
  note: string;
};

const steps = buildSteps();

function buildSteps(): Step[] {
  const output = Array(nums.length).fill(1);
  const result: Step[] = [];
  let prefix = 1;

  for (let index = 0; index < nums.length; index++) {
    output[index] = prefix;
    result.push({
      phase: "prefix",
      index,
      output: [...output],
      runningProduct: prefix,
      factor: nums[index],
      note: `Write ${prefix} at index ${index}. It is the product of everything strictly to the left.`,
    });
    prefix *= nums[index];
  }

  let suffix = 1;
  for (let index = nums.length - 1; index >= 0; index--) {
    const leftProduct = output[index];
    output[index] *= suffix;
    result.push({
      phase: "suffix",
      index,
      output: [...output],
      runningProduct: suffix,
      factor: nums[index],
      note: `Multiply the saved left product ${leftProduct} by right product ${suffix}. output[${index}] becomes ${output[index]}.`,
    });
    suffix *= nums[index];
  }

  return result;
}

export default function ProductExceptSelfAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1600);
  const step = steps[walkthrough.stepIndex];
  const isDone = walkthrough.stepIndex === steps.length - 1;
  const isPrefix = step.phase === "prefix";

  return (
    <section className="rounded-md border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">
            Product Except Self: Two Running Products
          </h3>
          <p className="mt-1 text-sm leading-6 text-cyan-950/75 dark:text-cyan-100/75">
            nums = [1, 2, 3, 4] · no division
          </p>
        </div>
        <AnimationControls
          {...walkthrough}
          stepCount={steps.length}
          accent="indigo"
          onPrevious={walkthrough.previous}
          onTogglePlaying={walkthrough.togglePlaying}
          onNext={walkthrough.next}
          onRestart={walkthrough.restart}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-3">
          <ArrayRow
            label="input"
            values={nums}
            activeIndex={step.index}
            mutedUntil={isPrefix ? step.index : -1}
          />
          <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            <span>{isPrefix ? "prefix pass" : "suffix pass"}</span>
            <span aria-hidden="true">{isPrefix ? "left to right →" : "← right to left"}</span>
          </div>
          <ArrayRow
            label="output"
            values={step.output}
            activeIndex={step.index}
            complete={isDone}
          />

          <div className="rounded-md border border-cyan-200 bg-white p-3 text-sm text-zinc-700 dark:border-cyan-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-semibold text-zinc-950 dark:text-zinc-50">
              {isPrefix
                ? `output[${step.index}] = prefix = ${step.runningProduct}`
                : `output[${step.index}] *= suffix = ${step.runningProduct}`}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Afterward: {isPrefix ? "prefix" : "suffix"} *= nums[{step.index}] ({step.factor})
            </div>
            {isDone && (
              <div className="mt-3 rounded-md bg-emerald-100 px-3 py-2 text-center font-semibold text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100">
                Return [24, 12, 8, 6]
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <StateCard
            label={isPrefix ? "prefix" : "suffix"}
            value={step.runningProduct}
            description={
              isPrefix
                ? "product strictly left of i"
                : "product strictly right of i"
            }
          />
          <div className="rounded-md border border-cyan-200 bg-white p-3 text-sm leading-6 text-zinc-600 dark:border-cyan-900 dark:bg-zinc-950 dark:text-zinc-300">
            <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
              The invariant
            </h4>
            <div className="mt-2 rounded-md bg-cyan-50 p-3 text-center font-mono font-semibold text-cyan-950 dark:bg-cyan-950/40 dark:text-cyan-100">
              answer[i] = left[i] × right[i]
            </div>
            <p className="mt-2">
              The output array stores the left side first. The reverse pass multiplies in the
              right side, so nums[i] is never included.
            </p>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            <strong>Why not division?</strong> Division breaks around zeros. Prefix and suffix
            products handle zero values naturally.
          </div>
        </div>
      </div>

      <ComplexityTable
        accentClass="text-cyan-700 dark:text-cyan-300"
        rows={[
          ["Prefix", "One left-to-right pass", "O(n)"],
          ["Suffix", "One right-to-left pass", "O(n)"],
          ["Time", "Two linear passes", "O(n)"],
          ["Space", "Output plus two running products", "O(1)*"],
        ]}
      />
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        *The required output array is not counted as auxiliary space.
      </p>
    </section>
  );
}

function ArrayRow({
  label,
  values,
  activeIndex,
  mutedUntil = -1,
  complete = false,
}: {
  label: string;
  values: number[];
  activeIndex: number;
  mutedUntil?: number;
  complete?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
        {label}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {values.map((value, index) => (
          <div
            key={index}
            className={`rounded-md border p-2 text-center transition-colors ${
              complete
                ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                : index === activeIndex
                  ? "border-cyan-500 bg-cyan-100 text-cyan-950 shadow-sm dark:border-cyan-500 dark:bg-cyan-950/60 dark:text-cyan-100"
                  : index > mutedUntil && mutedUntil >= 0
                    ? "border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
                    : "border-cyan-200 bg-white text-zinc-700 dark:border-cyan-900 dark:bg-zinc-950 dark:text-zinc-200"
            }`}
          >
            <div className="text-[10px] font-medium">index {index}</div>
            <div className="mt-1 text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StateCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-md border border-cyan-200 bg-white p-3 text-center dark:border-cyan-900 dark:bg-zinc-950">
      <div className="text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
        running {label}
      </div>
      <div className="mt-2 text-4xl font-bold text-cyan-950 dark:text-cyan-100">{value}</div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</div>
    </div>
  );
}
