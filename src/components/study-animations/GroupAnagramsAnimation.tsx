"use client";

import {
  AnimationControls,
  ComplexityTable,
  useWalkthrough,
} from "./AnimationControls";

const words = ["eat", "tea", "tan", "ate", "nat", "bat"];

const steps = words.map((word, index) => {
  const key = word.split("").sort().join("");
  const groups = new Map<string, string[]>();

  for (let i = 0; i <= index; i++) {
    const current = words[i];
    const currentKey = current.split("").sort().join("");
    groups.set(currentKey, [...(groups.get(currentKey) ?? []), current]);
  }

  return {
    word,
    index,
    key,
    groups: Array.from(groups.entries()),
    note:
      index === 0
        ? "Sort the letters to create a stable key. Every anagram of eat will become aet."
        : `${word} becomes ${key}, so it joins the bucket with the same canonical key.`,
  };
});

export default function GroupAnagramsAnimation() {
  const walkthrough = useWalkthrough(steps.length, 1600);
  const step = steps[walkthrough.stepIndex];

  return (
    <section className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
            Group Anagrams: Build a Canonical Key
          </h3>
          <p className="mt-1 text-sm leading-6 text-emerald-950/70 dark:text-emerald-100/70">
            strs = [&quot;eat&quot;, &quot;tea&quot;, &quot;tan&quot;, &quot;ate&quot;, &quot;nat&quot;, &quot;bat&quot;]
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-emerald-200 bg-white p-3 dark:border-emerald-900 dark:bg-zinc-950">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {words.map((word, index) => {
              const active = index === step.index;
              const processed = index <= step.index;

              return (
                <div
                  key={word}
                  className={`min-h-20 rounded-md border p-2 text-center transition-colors ${
                    active
                      ? "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-sm dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100"
                      : processed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
                        : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  <div className="text-xs font-medium">index {index}</div>
                  <div className="mt-2 font-mono text-xl font-bold">{word}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
              current key
            </div>
            <div className="mt-1 font-mono text-lg font-black text-emerald-950 dark:text-emerald-100">
              sort(&quot;{step.word}&quot;) = &quot;{step.key}&quot;
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {step.note}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-emerald-200 bg-white p-3 dark:border-emerald-900 dark:bg-zinc-950">
          <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Hash Map Buckets
          </h4>
          <div className="mt-2 space-y-2">
            {step.groups.map(([key, bucket]) => (
              <div
                key={key}
                className={`rounded-md border px-3 py-2 ${
                  key === step.key
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {key}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {bucket.map((word) => (
                    <span
                      key={word}
                      className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ComplexityTable
        accentClass="text-emerald-700 dark:text-emerald-300"
        rows={[
          ["Key", "Sort each word of length k", "O(k log k)"],
          ["Loop", "Build one bucket per word", "O(n)"],
          ["Time", "n sorted keys", "O(n k log k)"],
          ["Space", "Map stores all grouped strings", "O(nk)"],
        ]}
      />
    </section>
  );
}
