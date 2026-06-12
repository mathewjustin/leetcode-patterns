"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const nums = [3, 0, 1];
const expected = [0, 1, 2, 3];
const bitWidth = 2;

function binary(value: number) {
  return value.toString(2).padStart(bitWidth, "0");
}

const steps = [
  {
    title: "Spot the missing value",
    note: "There are n = 3 array items, so the complete range must contain n + 1 values: 0, 1, 2, 3. Comparing the lists by eye shows that 2 is missing.",
    expectedPaired: [] as number[],
    actualPaired: [] as number[],
    expression: "expected: [0, 1, 2, 3]   actual: [3, 0, 1]",
    result: null,
  },
  {
    title: "Learn the XOR rules",
    note: "XOR (^) compares each bit. A bit becomes 1 only when the two input bits are different. This gives us the useful cancellation rule x ^ x = 0.",
    expectedPaired: [],
    actualPaired: [],
    expression: "same bits -> 0, different bits -> 1",
    result: null,
  },
  {
    title: "Combine both lists",
    note: "XOR every number that should exist with every number that actually exists. We are deliberately putting matching values into the same cancellation pool.",
    expectedPaired: [],
    actualPaired: [],
    expression: "0 ^ 1 ^ 2 ^ 3 ^ 3 ^ 0 ^ 1",
    result: null,
  },
  {
    title: "Reorder matching values",
    note: "XOR is commutative and associative, so order does not matter. Move equal values next to each other without changing the result.",
    expectedPaired: [0, 1, 3],
    actualPaired: [0, 1, 3],
    expression: "(0 ^ 0) ^ (1 ^ 1) ^ (3 ^ 3) ^ 2",
    result: null,
  },
  {
    title: "Cancel every pair",
    note: "Each matching pair becomes zero. The missing value has no partner in the array, so it is the only value that survives.",
    expectedPaired: [0, 1, 3],
    actualPaired: [0, 1, 3],
    expression: "0 ^ 0 ^ 0 ^ 2 = 2",
    result: 2,
  },
  {
    title: "Turn the idea into one loop",
    note: "Array indices provide 0, 1, 2. Initialize missing with n = 3 to complete the expected range. The array provides 3, 0, 1. XORing both sides recreates the same cancellation pool.",
    expectedPaired: [0, 1, 3],
    actualPaired: [0, 1, 3],
    expression: "missing = n; then missing ^= i ^ nums[i]",
    result: 2,
  },
];

export default function MissingNumberAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1900);
  const step = steps[walkthrough.stepIndex];
  const showBits = walkthrough.stepIndex === 1;
  const showLoop = walkthrough.stepIndex === steps.length - 1;

  return (
    <section className="rounded-md border border-violet-200 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
            Missing Number: Why XOR Works
          </h3>
          <p className="mt-1 text-sm leading-6 text-violet-950/75 dark:text-violet-100/75">
            nums = [3, 0, 1], complete range = [0, 1, 2, 3]
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <NumberRows
            expectedPaired={step.expectedPaired}
            actualPaired={step.actualPaired}
          />

          <div className="rounded-md border border-violet-200 bg-white p-3 text-sm text-zinc-700 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-semibold text-zinc-950 dark:text-zinc-50">{step.title}</div>
            <p className="mt-1 leading-6">{step.note}</p>
            <div className="mt-3 overflow-x-auto rounded-md bg-violet-100 px-3 py-2 text-center font-mono font-semibold text-violet-950 dark:bg-violet-950/60 dark:text-violet-100">
              {step.expression}
            </div>
            {step.result !== null && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                The unpaired value is {step.result}
              </div>
            )}
          </div>

          <BinaryJourney stepIndex={walkthrough.stepIndex} />

          {showLoop && <LoopBridge />}
        </div>

        <div className="space-y-3">
          <XorRules showBits={showBits} />
          <div className="rounded-md border border-violet-200 bg-white p-3 text-sm leading-6 text-zinc-600 dark:border-violet-900 dark:bg-zinc-950 dark:text-zinc-300">
            <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">Core intuition</h4>
            <p className="mt-2">
              XOR acts like a cancellation tool. Put one copy of every expected value and one copy
              of every present value into it. Present values appear twice and disappear; the
              missing value appears once and remains.
            </p>
          </div>
        </div>
      </div>

      <OtherApproaches />

      <ComplexityTable
        accentClass="text-violet-700 dark:text-violet-300"
        rows={[
          ["Loop", "Visit each array value once", "n steps"],
          ["Work", "XOR the index and value", "O(1) each"],
          ["Time", "One linear pass", "O(n)"],
          ["Space", "One integer accumulator", "O(1)"],
        ]}
      />
    </section>
  );
}

function NumberRows({
  expectedPaired,
  actualPaired,
}: {
  expectedPaired: number[];
  actualPaired: number[];
}) {
  return (
    <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
      <NumberRow label="Should exist" values={expected} paired={expectedPaired} missing={2} />
      <div className="my-3 border-t border-violet-100 dark:border-violet-900" />
      <NumberRow label="Actually present" values={nums} paired={actualPaired} />
    </div>
  );
}

function NumberRow({
  label,
  values,
  paired,
  missing,
}: {
  label: string;
  values: number[];
  paired: number[];
  missing?: number;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-violet-700 dark:text-violet-300">
        {label}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value, index) => {
          const isPaired = paired.includes(value);
          const isMissing = value === missing && paired.length > 0;

          return (
            <div
              key={`${value}-${index}`}
              className={`relative min-w-12 rounded-md border px-3 py-2 text-center text-lg font-semibold ${
                isMissing
                  ? "border-emerald-400 bg-emerald-100 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : isPaired
                    ? "border-zinc-300 bg-zinc-100 text-zinc-400 line-through dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
                    : "border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100"
              }`}
            >
              <div>{value}</div>
              <div className="mt-0.5 font-mono text-[10px] font-medium opacity-70">
                {binary(value)}
              </div>
              {isPaired && (
                <span className="absolute -right-1.5 -top-2 text-xs text-zinc-500">cancel</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BinaryJourney({ stepIndex }: { stepIndex: number }) {
  const content = [
    {
      title: "The same lists in binary",
      body: (
        <div className="grid gap-2 text-sm">
          <BinaryLine label="Should exist" expression="00, 01, 10, 11" />
          <BinaryLine label="Actually present" expression="11, 00, 01" />
          <p className="text-zinc-600 dark:text-zinc-300">
            Binary <code className="font-mono">10</code>, which is decimal 2, appears only in the
            expected row.
          </p>
        </div>
      ),
    },
    {
      title: "XOR compares one column at a time",
      body: (
        <div className="space-y-3">
          <BitCalculation left={2} right={3} result={1} />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Right bit: 0 and 1 differ, so output 1. Left bit: 1 and 1 match, so output 0.
          </p>
        </div>
      ),
    },
    {
      title: "Put all binary values into one XOR chain",
      body: (
        <div className="space-y-2">
          <BinaryExpression expression="00 ^ 01 ^ 10 ^ 11 ^ 11 ^ 00 ^ 01" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            This is exactly the decimal expression above, with every number written as two bits.
          </p>
        </div>
      ),
    },
    {
      title: "Group identical bit patterns",
      body: (
        <div className="space-y-2">
          <BinaryExpression expression="(00 ^ 00) ^ (01 ^ 01) ^ (11 ^ 11) ^ 10" />
          <div className="grid gap-2 sm:grid-cols-3">
            <BinaryPair value={0} />
            <BinaryPair value={1} />
            <BinaryPair value={3} />
          </div>
        </div>
      ),
    },
    {
      title: "Watch the binary pairs become zero",
      body: (
        <div className="space-y-2">
          <BinaryExpression expression="00 ^ 00 ^ 00 ^ 10 = 10" />
          <div className="rounded-md bg-emerald-100 p-3 text-center text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100">
            <div className="font-mono text-2xl font-bold">10</div>
            <div className="mt-1 text-sm">binary 10 = decimal 2</div>
          </div>
        </div>
      ),
    },
    {
      title: "Binary accumulator trace",
      body: <AccumulatorTrace />,
    },
  ][stepIndex];

  return (
    <div className="rounded-md border border-violet-300 bg-white p-3 dark:border-violet-800 dark:bg-zinc-950">
      <h4 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
        {content.title}
      </h4>
      <div className="mt-3">{content.body}</div>
    </div>
  );
}

function BinaryLine({ label, expression }: { label: string; expression: string }) {
  return (
    <div className="grid gap-1 rounded-md bg-zinc-50 p-2 dark:bg-zinc-900 sm:grid-cols-[7rem_1fr]">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <code className="font-mono font-semibold tracking-wider text-violet-800 dark:text-violet-200">
        {expression}
      </code>
    </div>
  );
}

function BitCalculation({
  left,
  right,
  result,
}: {
  left: number;
  right: number;
  result: number;
}) {
  const rows = [
    { label: `${left}`, bits: binary(left) },
    { label: `^ ${right}`, bits: binary(right) },
    { label: `= ${result}`, bits: binary(result) },
  ];

  return (
    <div className="mx-auto max-w-56 rounded-md bg-zinc-950 p-3 font-mono text-zinc-100">
      {rows.map((row, rowIndex) => (
        <div
          key={row.label}
          className={`grid grid-cols-[3rem_1fr] py-1 ${
            rowIndex === rows.length - 1 ? "border-t border-zinc-500" : ""
          }`}
        >
          <span className="text-zinc-400">{row.label}</span>
          <span className="grid grid-cols-2 gap-2 text-center text-lg font-bold">
            {row.bits.split("").map((bit, index) => (
              <span
                key={`${row.label}-${index}`}
                className={
                  rowIndex === rows.length - 1
                    ? "rounded bg-violet-700 py-0.5"
                    : "rounded bg-zinc-800 py-0.5"
                }
              >
                {bit}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function BinaryExpression({ expression }: { expression: string }) {
  return (
    <div className="overflow-x-auto rounded-md bg-violet-100 px-3 py-3 text-center font-mono font-semibold tracking-wider text-violet-950 dark:bg-violet-950/60 dark:text-violet-100">
      {expression}
    </div>
  );
}

function BinaryPair({ value }: { value: number }) {
  return (
    <div className="rounded-md border border-zinc-200 p-2 text-center dark:border-zinc-800">
      <div className="font-mono font-semibold">
        {binary(value)} ^ {binary(value)}
      </div>
      <div className="mt-1 font-mono text-violet-700 dark:text-violet-300">= 00</div>
    </div>
  );
}

function AccumulatorTrace() {
  const rows = [
    {
      iteration: "start",
      calculation: "n = 3",
      decimal: "3",
      bits: "11",
    },
    {
      iteration: "i = 0",
      calculation: "11 ^ 00 ^ 11",
      decimal: "0",
      bits: "00",
    },
    {
      iteration: "i = 1",
      calculation: "00 ^ 01 ^ 00",
      decimal: "1",
      bits: "01",
    },
    {
      iteration: "i = 2",
      calculation: "01 ^ 10 ^ 01",
      decimal: "2",
      bits: "10",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[30rem]">
        <div className="grid grid-cols-[4rem_1fr_4rem_4rem] gap-2 px-2 text-xs font-semibold uppercase text-violet-700 dark:text-violet-300">
          <span>Step</span>
          <span>Binary calculation</span>
          <span>Decimal</span>
          <span>Binary</span>
        </div>
        <div className="mt-2 space-y-2">
          {rows.map((row, index) => (
            <div
              key={row.iteration}
              className={`grid grid-cols-[4rem_1fr_4rem_4rem] items-center gap-2 rounded-md px-2 py-2 text-sm ${
                index === rows.length - 1
                  ? "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : "bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              <span className="font-medium">{row.iteration}</span>
              <code className="font-mono">{row.calculation}</code>
              <span>{row.decimal}</span>
              <code className="font-mono font-bold">{row.bits}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function XorRules({ showBits }: { showBits: boolean }) {
  return (
    <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
      <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        What is bitwise XOR (^), exactly?
      </h4>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        Integers are stored as binary bits. XOR compares corresponding bits and outputs 1 when
        they differ.
      </p>
      <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs">
        {["A", "B", "A ^ B", "Meaning"].map((heading) => (
          <div key={heading} className="font-semibold text-violet-800 dark:text-violet-200">
            {heading}
          </div>
        ))}
        <TruthRow a="0" b="0" result="0" meaning="same" />
        <TruthRow a="0" b="1" result="1" meaning="different" />
        <TruthRow a="1" b="0" result="1" meaning="different" />
        <TruthRow a="1" b="1" result="0" meaning="same" />
      </div>

      <div
        className={`mt-3 rounded-md p-3 font-mono text-sm transition-colors ${
          showBits
            ? "bg-violet-100 text-violet-950 dark:bg-violet-950/60 dark:text-violet-100"
            : "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
        }`}
      >
        <div>2 = 10</div>
        <div>3 = 11</div>
        <div className="border-t border-current pt-1">2 ^ 3 = 01 = 1</div>
      </div>

      <div className="mt-3 grid gap-2 text-sm">
        <Rule text="x ^ x = 0: equal values cancel" />
        <Rule text="x ^ 0 = x: zero changes nothing" />
        <Rule text="a ^ b ^ a = b: order does not matter" />
      </div>
    </div>
  );
}

function TruthRow({
  a,
  b,
  result,
  meaning,
}: {
  a: string;
  b: string;
  result: string;
  meaning: string;
}) {
  return (
    <>
      <div className="rounded bg-zinc-50 py-1 dark:bg-zinc-900">{a}</div>
      <div className="rounded bg-zinc-50 py-1 dark:bg-zinc-900">{b}</div>
      <div className="rounded bg-violet-100 py-1 font-semibold dark:bg-violet-950">{result}</div>
      <div className="rounded bg-zinc-50 py-1 text-zinc-500 dark:bg-zinc-900">{meaning}</div>
    </>
  );
}

function LoopBridge() {
  return (
    <div className="rounded-md border border-violet-200 bg-white p-3 dark:border-violet-900 dark:bg-zinc-950">
      <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Where does the expected range come from?
      </h4>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <SourceCard label="Indices + n" values="0, 1, 2 + 3" description="Every expected value" />
        <SourceCard label="Array values" values="3, 0, 1" description="Every present value" />
      </div>
      <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
        <code>{`int missing = nums.length; // includes n

for (int i = 0; i < nums.length; i++) {
  missing ^= i;       // expected value
  missing ^= nums[i]; // present value
}`}</code>
      </pre>
    </div>
  );
}

function SourceCard({
  label,
  values,
  description,
}: {
  label: string;
  values: string;
  description: string;
}) {
  return (
    <div className="rounded-md bg-violet-50 p-3 dark:bg-violet-950/40">
      <div className="font-semibold text-violet-950 dark:text-violet-100">{label}</div>
      <div className="mt-1 font-mono text-violet-800 dark:text-violet-200">{values}</div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</div>
    </div>
  );
}

function OtherApproaches() {
  const approaches = [
    {
      title: "Sum formula",
      complexity: "O(n) time, O(1) space",
      detail: "Compute n(n + 1) / 2 minus the array sum. Usually the simplest answer; use a wider integer type if overflow is possible.",
    },
    {
      title: "Hash set",
      complexity: "O(n) time, O(n) space",
      detail: "Store all present values, then scan 0 through n. Very intuitive, but it uses extra memory.",
    },
    {
      title: "Sort and scan",
      complexity: "O(n log n) time",
      detail: "Sort, then find the first index whose value does not equal the index. Easy to reason about, but slower and may mutate the input.",
    },
    {
      title: "Binary search",
      complexity: "O(n log n) total with sorting",
      detail: "After sorting, search for the first index where nums[i] > i. The search is logarithmic, but sorting still dominates.",
    },
  ];

  return (
    <div className="mt-4 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        Other Ways To Solve It
      </h4>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {approaches.map((approach) => (
          <div
            key={approach.title}
            className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {approach.title}
              </span>
              <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
                {approach.complexity}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {approach.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-zinc-200 px-2 py-2 font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
      {text}
    </div>
  );
}
