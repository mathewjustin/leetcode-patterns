"use client";

import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const sources = [
  {
    title: "Blind Curated 75 Question List",
    url: "https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-100-LeetCode-Questions-to-Save-Your-Time-OaM1orEU",
    image: "/images/Blind.png",
  },
  {
    title: "Grokking the Coding Interview: Patterns for Coding Questions",
    url: "https://www.designgurus.io/course/grokking-the-coding-interview",
    image: "/images/DesignGurus.png",
  },
  {
    title: "14 Patterns to Ace Any Coding Interview Question",
    url: "https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed",
    image: "/images/Hackernoon.png",
  },
];

export default function AcknowledgementsPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); trackEvent("panel_close", { panel: "acknowledgements" }); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      {/* Tab button – rendered inline inside the fixed flex wrapper in page.tsx */}
      <button
        onClick={() => { setOpen(true); trackEvent("panel_open", { panel: "acknowledgements" }); }}
        className="rounded-r-xl bg-amber-600 px-2.5 py-4 text-white shadow-lg transition-colors hover:bg-amber-700"
        aria-label="Open acknowledgements"
      >
        <span className="flex items-center gap-2 text-sm font-semibold [writing-mode:vertical-lr]">
          <Heart className="h-4 w-4 rotate-90" />
          Acknowledgements
        </span>
      </button>

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 transform border-r border-zinc-200 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-900 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-amber-600 px-4 py-3 text-white">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Heart className="h-4 w-4" />
            Acknowledgements
          </h2>
          <button
            onClick={() => { setOpen(false); trackEvent("panel_close", { panel: "acknowledgements" }); }}
            className="rounded p-1 transition-colors hover:bg-amber-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-49px)] overflow-y-auto px-4 py-4">
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-semibold">Fork attribution</p>
            <p className="mt-1">
              This modified fork is maintained by{" "}
              <a
                href="https://github.com/mathewjustin/leetcode-patterns"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2"
              >
                Justin Mathew
              </a>
              {" "}and is adapted from{" "}
              <a
                href="https://github.com/SeanPrashad/leetcode-patterns"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2"
              >
                Sean Prashad&apos;s Leetcode Patterns
              </a>
              . Licensed under{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2"
              >
                CC BY-NC 4.0
              </a>
              .
            </p>
          </div>
          <p className="mb-4 text-xs text-zinc-500">
            Leetcode Patterns wouldn&apos;t exist without the following resources:
          </p>
          <div className="space-y-4">
            {sources.map((source) => (
              <a
                key={source.title}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-zinc-200 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${source.image}`}
                  alt={source.title}
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {source.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
