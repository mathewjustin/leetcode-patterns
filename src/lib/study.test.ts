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
    [
      "product-of-array-except-self",
      "Product of Array Except Self",
      "Prefix and Suffix Products",
      "output[i] *= suffix",
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

  it("teaches Missing Number with a two-loop solution before XOR", () => {
    const guide = getStudyGuide(question("missing-number", "Missing Number"));

    expect(guide.bruteForceCode).toContain(
      "for (int candidate = 0; candidate <= nums.length; candidate++)",
    );
    expect(guide.bruteForceCode).toContain("for (int num : nums)");
    expect(guide.bruteForceNotes?.join(" ")).toContain("O(n²)");
    expect(guide.solutionCode).toContain("missing ^= i");
  });
});
