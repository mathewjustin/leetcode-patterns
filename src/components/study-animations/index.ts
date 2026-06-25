import type { ComponentType } from "react";
import ContainsDuplicateAnimation from "./ContainsDuplicateAnimation";
import EncodeDecodeStringsAnimation from "./EncodeDecodeStringsAnimation";
import FindDisappearedNumbersAnimation from "./FindDisappearedNumbersAnimation";
import GroupAnagramsAnimation from "./GroupAnagramsAnimation";
import LongestConsecutiveSequenceAnimation from "./LongestConsecutiveSequenceAnimation";
import MajorityElementAnimation from "./MajorityElementAnimation";
import MissingNumberAnimation from "./MissingNumberAnimation";
import ProductExceptSelfAnimation from "./ProductExceptSelfAnimation";
import TwoSumAnimation from "./TwoSumAnimation";
import ValidAnagramAnimation from "./ValidAnagramAnimation";
import ValidPalindromeAnimation from "./ValidPalindromeAnimation";

export const studyAnimations: Record<string, ComponentType> = {
  "contains-duplicate": ContainsDuplicateAnimation,
  "encode-and-decode-strings": EncodeDecodeStringsAnimation,
  "find-all-numbers-disappeared-in-an-array": FindDisappearedNumbersAnimation,
  "group-anagrams": GroupAnagramsAnimation,
  "longest-consecutive-sequence": LongestConsecutiveSequenceAnimation,
  "majority-element": MajorityElementAnimation,
  "missing-number": MissingNumberAnimation,
  "product-of-array-except-self": ProductExceptSelfAnimation,
  "two-sum": TwoSumAnimation,
  "valid-anagram": ValidAnagramAnimation,
  "valid-palindrome": ValidPalindromeAnimation,
};
