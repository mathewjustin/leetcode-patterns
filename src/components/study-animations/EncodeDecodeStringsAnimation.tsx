"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const values = ["lint", "code", "love#you", ""];

type Step = {
  mode: "encode" | "decode";
  index: number;
  token: string;
  encoded: string;
  decoded: string[];
  note: string;
};

const encoded = values.map((value) => `${value.length}#${value}`).join("");
const encodeSteps: Step[] = values.map((value, index) => ({
  mode: "encode",
  index,
  token: `${value.length}#${value}`,
  encoded: values
    .slice(0, index + 1)
    .map((current) => `${current.length}#${current}`)
    .join(""),
  decoded: [],
  note: `Prefix "${value}" with its length, so the decoder knows exactly how many characters to read.`,
}));

function buildDecodeSteps(): Step[] {
  const result: Step[] = [];
  const decoded: string[] = [];

  values.forEach((value, index) => {
    const token = `${value.length}#${value}`;
    decoded.push(value);
    result.push({
      mode: "decode",
      index,
      token,
      encoded,
      decoded: [...decoded],
      note: `Read the number before '#', then take exactly ${value.length} characters. Delimiters inside the string do not matter.`,
    });
  });

  return result;
}

const steps = [...encodeSteps, ...buildDecodeSteps()];

export default function EncodeDecodeStringsAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1700);
  const step = steps[walkthrough.stepIndex];
  const isDecode = step.mode === "decode";

  return (
    <section className="overflow-hidden rounded-lg border border-sky-200 bg-sky-50 p-3 dark:border-sky-900 dark:bg-sky-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-sky-950 dark:text-sky-100">
            Encode and Decode Strings: Length First
          </h3>
          <p className="mt-1 text-sm leading-6 text-sky-950/70 dark:text-sky-100/70">
            Values can contain &quot;#&quot; or be empty, so raw delimiters are not enough.
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-sky-200 bg-white p-3 dark:border-sky-900 dark:bg-zinc-950">
          <div className="flex flex-wrap gap-2">
            {values.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`min-h-16 min-w-24 rounded-md border px-3 py-2 text-center ${
                  index === step.index
                    ? "border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-500 dark:bg-sky-950 dark:text-sky-100"
                    : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                }`}
              >
                <div className="text-xs font-medium">string {index}</div>
                <div className="mt-1 font-mono text-sm font-bold">
                  &quot;{value}&quot;
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-md border border-sky-200 bg-sky-50 p-3 dark:border-sky-900 dark:bg-sky-950/30">
            <div className="text-xs font-bold uppercase text-sky-700 dark:text-sky-300">
              {isDecode ? "decode cursor" : "encode token"}
            </div>
            <div className="mt-1 break-all font-mono text-lg font-black text-sky-950 dark:text-sky-100">
              {step.token}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {step.note}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-sky-200 bg-white p-3 dark:border-sky-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {isDecode ? "Decoded List" : "Encoded Stream"}
          </h4>
          <div className="mt-2 rounded-md bg-zinc-950 p-3 font-mono text-sm leading-6 text-zinc-100">
            {isDecode ? step.decoded.map((value) => `"${value}"`).join(", ") : step.encoded}
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <Rule label="length" value="read digits until #" active />
            <Rule label="payload" value="take exactly length chars" active={isDecode} />
            <Rule label="next" value="move cursor after payload" active={isDecode} />
          </div>
        </div>
      </div>

      <ComplexityTable
        accentClass="text-sky-700 dark:text-sky-300"
        rows={[
          ["Encode", "Visit every character once", "O(total)"],
          ["Decode", "Cursor only moves forward", "O(total)"],
          ["Time", "No nested rescans", "O(total)"],
          ["Space", "Output holds the same strings", "O(total)"],
        ]}
      />
    </section>
  );
}

function Rule({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`grid gap-1 rounded-md px-3 py-2 sm:grid-cols-[5rem_minmax(0,1fr)] ${
        active
          ? "bg-sky-50 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100"
          : "bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span>{value}</span>
    </div>
  );
}
