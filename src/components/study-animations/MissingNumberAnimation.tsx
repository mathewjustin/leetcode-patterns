"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

type Drop = {
  value: number;
  source: "expected" | "array";
};

const drops: Drop[] = [
  { value: 3, source: "array" },
  { value: 1, source: "expected" },
  { value: 0, source: "array" },
  { value: 3, source: "expected" },
  { value: 2, source: "expected" },
  { value: 0, source: "expected" },
  { value: 1, source: "array" },
];

const steps = [
  {
    title: "The XOR bucket starts empty",
    note: "We will drop in every expected value (0, 1, 2, 3) and every value actually in nums (3, 0, 1). The order is deliberately mixed.",
    processed: 0,
  },
  ...drops.map((drop, index) => {
    const before = survivors(drops.slice(0, index));
    const cancels = before.includes(drop.value);

    return {
      title: cancels ? `${drop.value} meets another ${drop.value}` : `Drop in ${drop.value}`,
      note: cancels
        ? `The bucket already contains ${drop.value}. XOR makes ${drop.value} ^ ${drop.value} = 0, so both copies disappear.`
        : `This ${drop.value} came from the ${sourceLabel(drop.source)}. It stays in the bucket until another ${drop.value} arrives.`,
      processed: index + 1,
    };
  }),
  {
    title: "Only the missing number survives",
    note: "0, 1, and 3 each entered twice, so their pairs canceled. The expected value 2 entered once because it is missing from nums.",
    processed: drops.length,
  },
];

export default function MissingNumberAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1300);
  const step = steps[walkthrough.stepIndex];
  const processedDrops = drops.slice(0, step.processed);
  const bucket = survivors(processedDrops);
  const incoming =
    walkthrough.stepIndex > 0 && walkthrough.stepIndex <= drops.length
      ? drops[walkthrough.stepIndex - 1]
      : null;
  const priorBucket = incoming
    ? survivors(drops.slice(0, walkthrough.stepIndex - 1))
    : [];
  const didCancel = incoming ? priorBucket.includes(incoming.value) : false;
  const isComplete = walkthrough.stepIndex === steps.length - 1;

  return (
    <section className="rounded-md border border-violet-200 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
            Missing Number: The XOR Bucket
          </h3>
          <p className="mt-1 text-sm leading-6 text-violet-950/75 dark:text-violet-100/75">
            Expected: [0, 1, 2, 3] · nums: [3, 0, 1]
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[0.72fr_1.28fr]">
        <DropQueue processed={step.processed} />

        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border-2 border-violet-300 bg-white p-4 dark:border-violet-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                  XOR bucket
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Matching values vanish
                </div>
              </div>
              <code className="rounded-md bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-900 dark:bg-violet-950 dark:text-violet-100">
                x ^ x = 0
              </code>
            </div>

            <div className="mt-5 flex min-h-36 flex-wrap content-center items-center justify-center gap-3 rounded-b-[2rem] border-x-4 border-b-4 border-violet-400 bg-violet-50/70 px-4 py-6 dark:border-violet-700 dark:bg-violet-950/20">
              {bucket.length === 0 ? (
                <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                  empty
                </span>
              ) : (
                bucket.map((value) => (
                  <BucketToken key={value} value={value} final={isComplete} />
                ))
              )}
            </div>

            {incoming && (
              <div
                className={`mt-3 rounded-md px-3 py-2 text-center text-sm font-semibold ${
                  didCancel
                    ? "bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-100"
                    : "bg-violet-100 text-violet-900 dark:bg-violet-950/50 dark:text-violet-100"
                }`}
              >
                {didCancel
                  ? `${incoming.value} ^ ${incoming.value} = 0 · pair canceled`
                  : `${incoming.value} is waiting for its pair`}
              </div>
            )}
          </div>

          <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
            <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">{step.title}</h4>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {step.note}
            </p>
            {isComplete && (
              <div className="mt-3 rounded-md bg-emerald-100 px-3 py-2 text-center font-semibold text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100">
                The value left in the bucket is 2
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
        <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Why one loop creates the same bucket
        </h4>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Start with <code className="font-mono">n</code>. Each index supplies the expected
          values 0 through n - 1, and each array entry supplies a present value.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
          <code>{`int missing = nums.length;

for (int i = 0; i < nums.length; i++) {
  missing ^= i;
  missing ^= nums[i];
}

return missing;`}</code>
        </pre>
      </div>

      <ComplexityTable
        accentClass="text-violet-700 dark:text-violet-300"
        rows={[
          ["Loop", "Drop each index and value into XOR", "n steps"],
          ["Cancel", "Each XOR operation is constant time", "O(1)"],
          ["Time", "One pass through nums", "O(n)"],
          ["Space", "The bucket is one integer", "O(1)"],
        ]}
      />
    </section>
  );
}

function DropQueue({ processed }: { processed: number }) {
  return (
    <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
      <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Shuffled drop order
      </h4>
      <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        XOR is commutative, so this order can be anything.
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-2">
        {drops.map((drop, index) => {
          const isProcessed = index < processed;
          const isCurrent = index === processed - 1;

          return (
            <div
              key={`${drop.source}-${drop.value}`}
              className={`rounded-md border px-2 py-2 text-center transition-all ${
                isCurrent
                  ? "border-violet-500 bg-violet-100 text-violet-950 shadow-sm dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-100"
                  : isProcessed
                    ? "border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
                    : "border-violet-200 text-violet-900 dark:border-violet-900 dark:text-violet-200"
              }`}
            >
              <div className={`text-lg font-bold ${isProcessed && !isCurrent ? "line-through" : ""}`}>
                {drop.value}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wide opacity-70">
                {drop.source}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BucketToken({ value, final }: { value: number; final: boolean }) {
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-xl font-bold shadow-sm transition-all ${
        final
          ? "scale-110 border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-100 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100 dark:ring-emerald-950"
          : "border-violet-400 bg-white text-violet-950 dark:border-violet-700 dark:bg-zinc-900 dark:text-violet-100"
      }`}
    >
      {value}
    </div>
  );
}

function survivors(items: Drop[]) {
  const oddValues = new Set<number>();

  for (const item of items) {
    if (oddValues.has(item.value)) {
      oddValues.delete(item.value);
    } else {
      oddValues.add(item.value);
    }
  }

  return [...oddValues].sort((a, b) => a - b);
}

function sourceLabel(source: Drop["source"]) {
  return source === "expected" ? "expected range" : "array";
}
