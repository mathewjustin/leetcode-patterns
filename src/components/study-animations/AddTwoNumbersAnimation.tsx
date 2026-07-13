"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const l1 = [9, 9, 9];
const l2 = [1];

type Step = {
  index: number;
  a: number;
  b: number;
  incomingCarry: number;
  sum: number;
  digit: number;
  outgoingCarry: number;
  result: number[];
  note: string;
  finalCarry: boolean;
};

const steps = buildSteps();

function buildSteps(): Step[] {
  const result: number[] = [];
  const built: Step[] = [];
  let carry = 0;
  let index = 0;

  while (index < l1.length || index < l2.length) {
    const a = l1[index] ?? 0;
    const b = l2[index] ?? 0;
    const sum = a + b + carry;
    const digit = sum % 10;
    const outgoingCarry = Math.floor(sum / 10);
    result.push(digit);
    built.push({
      index,
      a,
      b,
      incomingCarry: carry,
      sum,
      digit,
      outgoingCarry,
      result: [...result],
      finalCarry: false,
      note:
        index === 0
          ? "Add the two current nodes and the incoming carry. Store only the ones digit in the result node."
          : "The second list is empty now, so treat its value as 0 and keep moving through the first list.",
    });
    carry = outgoingCarry;
    index++;
  }

  if (carry > 0) {
    result.push(carry);
    built.push({
      index,
      a: 0,
      b: 0,
      incomingCarry: carry,
      sum: carry,
      digit: carry,
      outgoingCarry: 0,
      result: [...result],
      finalCarry: true,
      note: "After both lists end, carry is still 1. Create one extra node so 999 + 1 becomes 1000.",
    });
  }

  return built;
}

export default function AddTwoNumbersAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1700);
  const step = steps[walkthrough.stepIndex];
  const isDone = walkthrough.stepIndex === steps.length - 1;

  return (
    <section className="overflow-hidden rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-3 dark:border-fuchsia-900 dark:bg-fuchsia-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-fuchsia-950 dark:text-fuchsia-100">
            Add Two Numbers: Carry Moves With the Pointers
          </h3>
          <p className="mt-1 text-sm leading-6 text-fuchsia-950/70 dark:text-fuchsia-100/70">
            l1 stores 999 as [9, 9, 9]. l2 stores 1 as [1]. Digits are already reversed.
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
        <div className="rounded-md border border-fuchsia-200 bg-white p-3 dark:border-fuchsia-900 dark:bg-zinc-950">
          <LinkedListRow label="l1" values={l1} activeIndex={step.finalCarry ? null : step.index} color="fuchsia" />
          <LinkedListRow label="l2" values={l2} activeIndex={step.finalCarry ? null : step.index} color="sky" />
          <LinkedListRow label="result" values={step.result} activeIndex={step.result.length - 1} color="emerald" />

          <div className="mt-4 rounded-md border border-fuchsia-200 bg-fuchsia-50 p-3 dark:border-fuchsia-900 dark:bg-fuchsia-950/30">
            <div className="text-xs font-bold uppercase text-fuchsia-700 dark:text-fuchsia-300">
              current calculation
            </div>
            <div className="mt-1 font-mono text-lg font-black text-fuchsia-950 dark:text-fuchsia-100">
              {step.a} + {step.b} + carry {step.incomingCarry} = {step.sum}
            </div>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <FormulaBadge label="write digit" value={step.digit} />
              <FormulaBadge label="next carry" value={step.outgoingCarry} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {step.note}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-fuchsia-200 bg-white p-3 dark:border-fuchsia-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Pointer Invariant
          </h4>
          <div className="mt-3 space-y-2 text-sm">
            <Invariant active={!step.finalCarry} label="Read current nodes">
              Missing nodes count as 0, so uneven list lengths need no special branch.
            </Invariant>
            <Invariant active label="Append one result node">
              Each loop writes exactly one digit: sum % 10.
            </Invariant>
            <Invariant active={step.outgoingCarry > 0} label="Carry forward">
              Carry is Math.floor(sum / 10), and it joins the next column.
            </Invariant>
            <Invariant active={step.finalCarry} label="Finish final carry">
              If carry remains after both lists end, append one last node.
            </Invariant>
          </div>

          {isDone && (
            <div className="mt-4 rounded-md bg-emerald-100 px-3 py-3 text-center dark:bg-emerald-950">
              <div className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                final linked list
              </div>
              <div className="mt-1 font-mono text-xl font-black text-emerald-950 dark:text-emerald-100">
                [0, 0, 0, 1]
              </div>
            </div>
          )}
        </div>
      </div>

      <ComplexityTable
        accentClass="text-fuchsia-700 dark:text-fuchsia-300"
        rows={[
          ["Loop", "Walk until both lists and carry are empty", "O(max)"],
          ["Work", "Constant math per output node", "O(1)"],
          ["Time", "One pass over the longer list", "O(max(m,n))"],
          ["Space", "New answer list", "O(max(m,n))"],
        ]}
      />
    </section>
  );
}

function LinkedListRow({
  label,
  values,
  activeIndex,
  color,
}: {
  label: string;
  values: number[];
  activeIndex: number | null;
  color: "fuchsia" | "sky" | "emerald";
}) {
  const colors = {
    fuchsia:
      "border-fuchsia-400 bg-fuchsia-100 text-fuchsia-950 dark:border-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-100",
    sky:
      "border-sky-400 bg-sky-100 text-sky-950 dark:border-sky-600 dark:bg-sky-950 dark:text-sky-100",
    emerald:
      "border-emerald-400 bg-emerald-100 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100",
  }[color];

  return (
    <div className="mb-3">
      <div className="mb-1 text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="flex min-h-14 flex-wrap items-center gap-2">
        {values.map((value, index) => {
          const active = activeIndex === index;
          return (
            <div key={`${label}-${index}`} className="flex items-center gap-2">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-lg font-black transition-colors ${
                  active
                    ? colors
                    : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                }`}
              >
                {value}
              </div>
              {index < values.length - 1 && (
                <div className="h-0.5 w-6 rounded bg-zinc-300 dark:bg-zinc-700" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormulaBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white px-3 py-2 text-center dark:bg-zinc-950">
      <div className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-black text-zinc-950 dark:text-zinc-50">
        {value}
      </div>
    </div>
  );
}

function Invariant({
  active,
  label,
  children,
}: {
  active: boolean;
  label: string;
  children: string;
}) {
  return (
    <div
      className={`rounded-md border px-3 py-2 ${
        active
          ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950 dark:border-fuchsia-900 dark:bg-fuchsia-950/30 dark:text-fuchsia-100"
          : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
      }`}
    >
      <div className="font-semibold">{label}</div>
      <div className="mt-1 leading-6">{children}</div>
    </div>
  );
}
