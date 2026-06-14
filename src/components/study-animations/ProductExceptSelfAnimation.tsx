"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const nums = [2, -1, 3, 4, 5];

type Step = {
  phase: "prefix" | "suffix";
  index: number;
  output: number[];
  leftProduct: number;
  rightProduct: number;
  note: string;
};

const steps = buildSteps();

function product(values: number[]) {
  return values.reduce((result, value) => result * value, 1);
}

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
      leftProduct: prefix,
      rightProduct: 1,
      note: `Save ${prefix}, the product of every value left of index ${index}. Then let ${nums[index]} join the running prefix.`,
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
      leftProduct,
      rightProduct: suffix,
      note: `The two sides meet: ${leftProduct} × ${suffix} = ${output[index]}. The crossed-out ${nums[index]} never enters either side.`,
    });
    suffix *= nums[index];
  }

  return result;
}

export default function ProductExceptSelfAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1750);
  const step = steps[walkthrough.stepIndex];
  const isPrefix = step.phase === "prefix";
  const isDone = walkthrough.stepIndex === steps.length - 1;
  const leftFactors = nums.slice(0, step.index);
  const rightFactors = nums.slice(step.index + 1);

  return (
    <section className="overflow-hidden rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-3 shadow-sm dark:border-cyan-900 dark:from-cyan-950/30 dark:via-zinc-950 dark:to-violet-950/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-cyan-950 dark:text-cyan-100">
            Product Except Self: Meet in the Middle
          </h3>
          <p className="mt-1 text-sm leading-6 text-cyan-950/70 dark:text-cyan-100/70">
            nums = [2, -1, 3, 4, 5] · one negative · no division
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

      <div className="mt-4 rounded-xl border border-white/80 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
        <div className="flex items-center gap-2">
          <PhasePill active={isPrefix} label="1. Collect left products" />
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-300 to-violet-300 dark:from-cyan-800 dark:to-violet-800" />
          <PhasePill active={!isPrefix} label="2. Multiply right products" />
        </div>

        <div className="mt-4">
          <IndexTrack activeIndex={step.index} output={step.output} isDone={isDone} />
        </div>

        <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          <FactorLane
            title="Everything left"
            values={leftFactors}
            product={step.leftProduct}
            color="cyan"
            active={!isPrefix}
          />

          <div className="flex min-w-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-rose-300 bg-rose-50 px-4 py-3 text-center dark:border-rose-900 dark:bg-rose-950/30">
            <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-300">
              exclude self
            </div>
            <div className="relative mt-2 text-4xl font-black text-rose-950 dark:text-rose-100">
              {nums[step.index]}
              <span className="absolute left-1/2 top-1/2 h-1 w-14 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded bg-rose-500" />
            </div>
            <div className="mt-2 text-xs font-medium text-rose-700 dark:text-rose-300">
              index {step.index}
            </div>
          </div>

          <FactorLane
            title="Everything right"
            values={rightFactors}
            product={isPrefix ? product(rightFactors) : step.rightProduct}
            color="violet"
            active={!isPrefix}
          />
        </div>

        <div
          className={`mt-4 rounded-xl border p-4 text-center transition-colors ${
            isPrefix
              ? "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30"
              : "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
          }`}
        >
          {isPrefix ? (
            <>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
                First pass stores the left half
              </div>
              <div className="mt-2 font-mono text-lg font-bold text-cyan-950 dark:text-cyan-100">
                output[{step.index}] = {formatFactors(leftFactors)} = {step.leftProduct}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                Left and right snap together
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-lg font-black">
                <ProductBadge color="cyan" value={step.leftProduct} label="left" />
                <span className="text-zinc-400">×</span>
                <ProductBadge color="violet" value={step.rightProduct} label="right" />
                <span className="text-zinc-400">=</span>
                <ProductBadge
                  color="emerald"
                  value={step.output[step.index]}
                  label={`answer[${step.index}]`}
                />
              </div>
            </>
          )}
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {step.note}
          </p>
        </div>

        {isDone && (
          <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-[1px]">
            <div className="rounded-[11px] bg-white px-4 py-3 text-center dark:bg-zinc-950">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                Final answer
              </div>
              <div className="mt-1 font-mono text-xl font-black text-zinc-950 dark:text-white">
                [-60, 120, -40, -30, -24]
              </div>
            </div>
          </div>
        )}
      </div>

      <OneShotRule />

      <ComplexityTable
        accentClass="text-cyan-700 dark:text-cyan-300"
        rows={[
          ["Forward", "Store products strictly left of i", "O(n)"],
          ["Backward", "Multiply products strictly right of i", "O(n)"],
          ["Time", "Every value is touched twice", "O(n)"],
          ["Space", "Two running products beyond output", "O(1)*"],
        ]}
      />
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        *The required output array is not counted as auxiliary space.
      </p>
    </section>
  );
}

function IndexTrack({
  activeIndex,
  output,
  isDone,
}: {
  activeIndex: number;
  output: number[];
  isDone: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {nums.map((value, index) => {
        const active = index === activeIndex;

        return (
          <div
            key={index}
            className={`relative rounded-lg border p-2 text-center transition-all ${
              active
                ? "z-10 scale-105 border-cyan-500 bg-white shadow-lg shadow-cyan-200/60 dark:border-cyan-400 dark:bg-zinc-900 dark:shadow-cyan-950"
                : "border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/70"
            }`}
          >
            <div className="text-[9px] font-bold uppercase text-zinc-400">i={index}</div>
            <div className="mt-1 text-lg font-black text-zinc-900 dark:text-zinc-100">
              {value}
            </div>
            <div
              className={`mt-2 rounded px-1 py-1 text-xs font-bold ${
                isDone
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200"
              }`}
            >
              out: {output[index]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FactorLane({
  title,
  values,
  product: laneProduct,
  color,
  active,
}: {
  title: string;
  values: number[];
  product: number;
  color: "cyan" | "violet";
  active: boolean;
}) {
  const classes =
    color === "cyan"
      ? "border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100"
      : "border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-100";

  return (
    <div className={`rounded-xl border p-3 ${classes} ${active ? "shadow-sm" : ""}`}>
      <div className="text-center text-xs font-bold uppercase tracking-wider">{title}</div>
      <div className="mt-3 flex min-h-10 flex-wrap items-center justify-center gap-1.5">
        {values.length ? (
          values.map((value, index) => (
            <span key={index} className="contents">
              {index > 0 && <span className="text-xs opacity-50">×</span>}
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full border border-current/20 bg-white px-2 font-bold shadow-sm dark:bg-zinc-950">
                {value}
              </span>
            </span>
          ))
        ) : (
          <span className="rounded-full border border-dashed border-current/30 px-3 py-1 text-sm">
            empty = 1
          </span>
        )}
      </div>
      <div className="mt-3 text-center text-sm font-bold">product = {laneProduct}</div>
    </div>
  );
}

function ProductBadge({
  color,
  value,
  label,
}: {
  color: "cyan" | "violet" | "emerald";
  value: number;
  label: string;
}) {
  const classes = {
    cyan: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100",
    violet: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
    emerald: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  }[color];

  return (
    <span className={`rounded-lg px-3 py-2 ${classes}`}>
      <span className="block text-[9px] font-bold uppercase tracking-wide opacity-60">{label}</span>
      {value}
    </span>
  );
}

function PhasePill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition-all ${
        active
          ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500"
      }`}
    >
      {label}
    </span>
  );
}

function OneShotRule() {
  return (
    <div className="mt-4 grid gap-3 rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-white dark:border-zinc-800 md:grid-cols-[1fr_auto_1fr] md:items-center">
      <div className="text-center md:text-right">
        <div className="text-xs font-bold uppercase tracking-widest text-cyan-300">
          forward pass
        </div>
        <div className="mt-1 font-mono font-bold">write prefix, then include nums[i]</div>
      </div>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xl font-black shadow-lg shadow-cyan-950">
        ×
      </div>
      <div className="text-center md:text-left">
        <div className="text-xs font-bold uppercase tracking-widest text-violet-300">
          backward pass
        </div>
        <div className="mt-1 font-mono font-bold">use suffix, then include nums[i]</div>
      </div>
      <div className="text-center text-sm text-zinc-300 md:col-span-3">
        Write first, multiply second. That tiny ordering rule is how each value excludes itself.
      </div>
    </div>
  );
}

function formatFactors(values: number[]) {
  return values.length ? values.join(" × ") : "1";
}
