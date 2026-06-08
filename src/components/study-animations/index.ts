import type { ComponentType } from "react";
import ContainsDuplicateAnimation from "./ContainsDuplicateAnimation";
import TwoSumAnimation from "./TwoSumAnimation";
import ValidAnagramAnimation from "./ValidAnagramAnimation";
import ValidPalindromeAnimation from "./ValidPalindromeAnimation";

export const studyAnimations: Record<string, ComponentType> = {
  "contains-duplicate": ContainsDuplicateAnimation,
  "two-sum": TwoSumAnimation,
  "valid-anagram": ValidAnagramAnimation,
  "valid-palindrome": ValidPalindromeAnimation,
};
