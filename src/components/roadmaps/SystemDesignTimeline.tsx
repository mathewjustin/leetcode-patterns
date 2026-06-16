"use client";

import {
  Blocks,
  BrainCircuit,
  Database,
  GitBranch,
  Infinity,
  Network,
  Radar,
  ServerCog,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const milestones = [
  {
    title: "Foundations",
    focus: "Scale, latency, throughput, availability, consistency",
    icon: Blocks,
    tone: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  {
    title: "Networking",
    focus: "DNS, HTTP, load balancers, CDNs, API gateways",
    icon: Network,
    tone: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-300",
  },
  {
    title: "Storage",
    focus: "SQL, NoSQL, indexes, replication, partitioning",
    icon: Database,
    tone: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300",
  },
  {
    title: "Distributed Systems",
    focus: "Queues, caches, consensus, idempotency, backpressure",
    icon: Workflow,
    tone: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
  },
  {
    title: "Reliability",
    focus: "SLOs, observability, rate limits, graceful degradation",
    icon: ShieldCheck,
    tone: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300",
  },
  {
    title: "Architecture Practice",
    focus: "Tradeoffs, diagrams, capacity estimates, design reviews",
    icon: ServerCog,
    tone: "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300",
  },
];

const loop = [
  { label: "Read papers", icon: BrainCircuit },
  { label: "Design", icon: GitBranch },
  { label: "Build", icon: ServerCog },
  { label: "Measure", icon: Radar },
];

export default function SystemDesignTimeline() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">System Design Roadmap</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              A timeline for growing from fundamentals into architecture judgment, with a deliberate open end because learning systems never really stops.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-zinc-950 dark:text-blue-300">
            <Infinity className="h-4 w-4" />
            Never finished
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative px-4 py-6 sm:px-6">
          <div className="absolute left-12 right-12 top-11 hidden h-0.5 bg-zinc-200 dark:bg-zinc-800 md:block" />
          <div className="grid gap-4 md:grid-cols-6">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;

              return (
                <div key={milestone.title} className="relative flex gap-3 md:block">
                  <div className="flex flex-col items-center md:mb-4">
                    <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${milestone.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="h-full w-0.5 bg-zinc-200 dark:bg-zinc-800 md:hidden" />
                    )}
                  </div>
                  <div className="min-w-0 pb-4 md:pb-0">
                    <p className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500">
                      Stage {index + 1}
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
                      {milestone.focus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-5 dark:border-zinc-800 dark:bg-zinc-900/70 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
              {loop.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex min-h-12 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-blue-500" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex min-w-0 items-center gap-3 text-blue-700 dark:text-blue-300">
              <div className="system-design-endless-line h-0.5 flex-1 lg:w-40 lg:flex-none" />
              <Infinity className="h-8 w-8 shrink-0" />
              <span className="text-sm font-bold">Repeat forever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
