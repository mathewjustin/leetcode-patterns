import { describe, expect, it } from "vitest";
import type { Question } from "@/types/question";
import { getStudyGuide } from "@/lib/study";

function question(slug: string, title: string): Question {
  return {
    id: 1,
    slug,
    title,
    pattern: ["Array"],
    difficulty: "Easy",
    premium: false,
    companies: [],
  };
}

describe("problem-specific study guides", () => {
  it.each([
    [
      "find-all-numbers-disappeared-in-an-array",
      "Find All Numbers Disappeared in an Array",
      "In-Place Marking",
      "Math.abs",
    ],
    ["missing-number", "Missing Number", "Bit Manipulation", "missing ^= i"],
    [
      "majority-element",
      "Majority Element",
      "Boyer-Moore Voting",
      "count += num == candidate ? 1 : -1",
    ],
  ])("provides a complete guide for %s", (slug, title, pattern, solutionText) => {
    const guide = getStudyGuide(question(slug, title));

    expect(guide.pattern).toBe(pattern);
    expect(guide.recognition.length).toBeGreaterThan(0);
    expect(guide.plan.length).toBeGreaterThan(0);
    expect(guide.edgeCases.length).toBeGreaterThan(0);
    expect(guide.fixHints.length).toBeGreaterThan(0);
    expect(guide.solutionLanguage).toBe("Java");
    expect(guide.solutionCode).toContain(solutionText);
    expect(guide.solutionNotes?.length).toBeGreaterThan(0);
  });
});
