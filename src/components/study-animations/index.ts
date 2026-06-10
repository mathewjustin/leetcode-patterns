import type { ComponentType } from "react";
import ContainsDuplicateAnimation from "./ContainsDuplicateAnimation";
import FindDisappearedNumbersAnimation from "./FindDisappearedNumbersAnimation";
import MajorityElementAnimation from "./MajorityElementAnimation";
import MissingNumberAnimation from "./MissingNumberAnimation";
import TwoSumAnimation from "./TwoSumAnimation";
import ValidAnagramAnimation from "./ValidAnagramAnimation";
import ValidPalindromeAnimation from "./ValidPalindromeAnimation";

export const studyAnimations: Record<string, ComponentType> = {
  "contains-duplicate": ContainsDuplicateAnimation,
  "find-all-numbers-disappeared-in-an-array": FindDisappearedNumbersAnimation,
  "majority-element": MajorityElementAnimation,
  "missing-number": MissingNumberAnimation,
  "two-sum": TwoSumAnimation,
  "valid-anagram": ValidAnagramAnimation,
  "valid-palindrome": ValidPalindromeAnimation,
};
