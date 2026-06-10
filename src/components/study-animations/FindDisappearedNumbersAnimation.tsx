"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const original = [4, 3, 2, 7, 8, 2, 3, 1];

interface MarkStep {
  phase: "mark";
  source: number;
  target: number;
  values: number[];
  note: string;
}

interface ScanStep {
  phase: "scan";
  source: number;
  target: null;
  values: number[];
  missing: number[];
  note: string;
}

const steps: Array<MarkStep | ScanStep> = buildSteps();

function buildSteps(): Array<MarkStep | ScanStep> {
  const values = [...original];
  const result: Array<MarkStep | ScanStep> = [];

  original.forEach((_, source) => {
    const value = Math.abs(values[source]);
    const target = value - 1;
    const alreadyMarked = values[target] < 0;

    if (!alreadyMarked) values[target] *= -1;

    result.push({
      phase: "mark",
      source,
      target,
      values: [...values],
      note: alreadyMarked
        ? `Read |${values[source]}| = ${value}. Index ${target} is already negative, so keep it marked.`
        : `Read |${values[source]}| = ${value}. Mark index ${target} negative to record that ${value} exists.`,
    });
  });

  const missing: number[] = [];
  values.forEach((value, source) => {
    if (value > 0) missing.push(source + 1);
    result.push({
      phase: "scan",
      source,
      target: null,
      values: [...values],
      missing: [...missing],
      note:
        value > 0
          ? `Index ${source} stayed positive, so value ${source + 1} never appeared.`
          : `Index ${source} is negative, so value ${source + 1} was present.`,
    });
  });

  return result;
}

export default function FindDisappearedNumbersAnimation() {
  const walkthrough = useWalkthrough(steps.length);
  const step = steps[walkthrough.stepIndex];
  const isDone = walkthrough.stepIndex === steps.length - 1;

  return (
    <section className="rounded-md border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900 dark:bg-indigo-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">
            In-Place Marking Walkthrough
          </h3>
          <p className="mt-1 text-sm leading-6 text-indigo-950/75 dark:text-indigo-100/75">
            nums = [4, 3, 2, 7, 8, 2, 3, 1]
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {step.values.map((value, index) => {
              const isSource = index === step.source;
              const isTarget = index === step.target;

              return (
                <div
                  key={index}
                  className={`rounded-md border p-2 text-center ${
                    isTarget
                      ? "border-indigo-500 bg-indigo-100 text-indigo-950 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-100"
                      : isSource
                        ? "border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                        : value < 0
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                          : "border-indigo-200 bg-white text-zinc-700 dark:border-indigo-900 dark:bg-zinc-950 dark:text-zinc-200"
                  }`}
                >
                  <div className="text-[10px] font-medium">index {index}</div>
                  <div className="mt-1 text-xl font-semibold">{value}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-md border border-indigo-200 bg-white p-3 text-sm text-zinc-700 dark:border-indigo-900 dark:bg-zinc-950 dark:text-zinc-200">
            <div className="font-medium text-zinc-950 dark:text-zinc-50">
              {step.phase === "mark"
                ? `Mark phase: value ${Math.abs(step.values[step.source])} maps to index ${step.target}`
                : `Scan phase: inspect index ${step.source}`}
            </div>
            <p className="mt-1 leading-6">{step.note}</p>
            {isDone && (
              <div className="mt-2 rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                Return [5, 6]
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-indigo-200 bg-white p-3 dark:border-indigo-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Value-to-Index Rule
          </h4>
          <div className="mt-3 rounded-md bg-indigo-50 p-3 text-center dark:bg-indigo-950/40">
            <div className="text-xs text-indigo-700 dark:text-indigo-300">value x</div>
            <div className="mt-1 text-lg font-semibold text-indigo-950 dark:text-indigo-100">
              index = x - 1
            </div>
          </div>
          <div className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Negative means present. Positive after the marking pass means missing.
          </div>
          {step.phase === "scan" && (
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase text-indigo-700 dark:text-indigo-300">
                Missing so far
              </div>
              <div className="mt-2 min-h-10 rounded-md border border-dashed border-indigo-300 p-2 text-center font-semibold text-indigo-900 dark:border-indigo-800 dark:text-indigo-100">
                {step.missing.length ? `[${step.missing.join(", ")}]` : "none"}
              </div>
            </div>
          )}
        </div>
      </div>

      <ComplexityTable
        accentClass="text-indigo-700 dark:text-indigo-300"
        rows={[
          ["Mark", "Visit every value once", "O(n)"],
          ["Scan", "Inspect every position once", "O(n)"],
          ["Time", "Two linear passes", "O(n)"],
          ["Space", "Reuse signs in the input array", "O(1)"],
        ]}
      />
    </section>
  );
}
