import type { Question } from "@/types/question";

export interface StudyGuide {
  pattern: string;
  mentalModel: string;
  recognition: string[];
  plan: string[];
  edgeCases: string[];
  complexityTarget: string;
  bugPrompt: string;
  buggyCode: string;
  fixHints: string[];
  bruteForceLanguage?: string;
  bruteForceCode?: string;
  bruteForceNotes?: string[];
  solutionLanguage?: string;
  solutionCode?: string;
  solutionNotes?: string[];
}

const questionGuides: Record<string, StudyGuide> = {
  "valid-anagram": {
    pattern: "Hash Table",
    mentalModel: "An anagram preserves character counts. Count every character in the first string, then spend those counts while scanning the second string.",
    recognition: ["Two strings need the same multiset of characters.", "Order does not matter, but frequency does.", "Sorting works, but counting keeps the check linear."],
    plan: ["Return false immediately when lengths differ.", "Count each character from s.", "Scan t and decrement the matching count.", "If a character is missing or already used up, return false.", "Return true after all counts balance."],
    edgeCases: ["Different lengths", "Same letters with different counts", "Repeated characters", "Empty strings", "Characters that appear only in one string"],
    complexityTarget: "O(n) time because each string is scanned once. O(k) space for the character counts, where k is the alphabet size; for lowercase English letters this is O(1).",
    bugPrompt: "This Java Valid Anagram sketch uses a set, so it remembers only whether a character exists and loses how many times it appears.",
    buggyCode: `import java.util.HashSet;
import java.util.Set;

class Solution {
  public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
      return false;
    }

    Set<Character> chars = new HashSet<>();
    for (char c : s.toCharArray()) {
      chars.add(c);
    }

    for (char c : t.toCharArray()) {
      if (!chars.contains(c)) {
        return false;
      }
    }

    return true;
  }
}`,
    fixHints: ["Use counts, not just membership.", "Length equality is necessary but not enough.", "Test s=\"aacc\", t=\"ccac\"; a set-based solution incorrectly returns true."],
    solutionLanguage: "Java",
    solutionCode: `class Solution {
  public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
      return false;
    }

    int[] counts = new int[26];

    for (int i = 0; i < s.length(); i++) {
      counts[s.charAt(i) - 'a']++;
      counts[t.charAt(i) - 'a']--;
    }

    for (int count : counts) {
      if (count != 0) {
        return false;
      }
    }

    return true;
  }
}`,
    solutionNotes: ["The array index maps each lowercase letter to one counter.", "Increment for s and decrement for t; anagrams end with every counter at zero.", "Time is O(n); space is O(1) for the fixed 26-letter lowercase alphabet."],
  },
  "valid-palindrome": {
    pattern: "Two Pointers",
    mentalModel: "A palindrome mirrors around its center. Skip non-alphanumeric characters, compare the next valid left and right characters, and move inward only after a match.",
    recognition: ["You compare characters from opposite ends.", "The prompt says to ignore case and non-alphanumeric characters.", "A cleaned copy works, but two pointers can avoid extra storage."],
    plan: ["Set left at the start and right at the end.", "Move left forward while it points at a non-alphanumeric character.", "Move right backward while it points at a non-alphanumeric character.", "Compare lowercase versions of both characters.", "Return false on the first mismatch; otherwise move both pointers inward until they cross."],
    edgeCases: ["Empty string after filtering", "Only punctuation or spaces", "Mixed uppercase and lowercase", "Digits mixed with letters", "Mismatch hidden behind punctuation"],
    complexityTarget: "O(n) time because each pointer only moves inward. O(1) extra space when comparing characters in place.",
    bugPrompt: "This Java Valid Palindrome sketch compares raw characters, so spaces, punctuation, and uppercase letters can cause false mismatches.",
    buggyCode: `class Solution {
  public boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) {
        return false;
      }

      left++;
      right--;
    }

    return true;
  }
}`,
    fixHints: ["Skip characters that are not letters or digits before comparing.", "Compare lowercase versions of the two valid characters.", "Test s=\"A man, a plan, a canal: Panama\" and s=\"race a car\"."],
    solutionLanguage: "Java",
    solutionCode: `class Solution {
  public boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
      while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
        left++;
      }

      while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
        right--;
      }

      char a = Character.toLowerCase(s.charAt(left));
      char b = Character.toLowerCase(s.charAt(right));

      if (a != b) {
        return false;
      }

      left++;
      right--;
    }

    return true;
  }
}`,
    solutionNotes: ["The inner loops discard characters the problem says to ignore.", "Lowercasing before comparison makes 'A' and 'a' equivalent.", "Each pointer only moves inward, so the scan stays linear with constant extra space."],
  },
  "contains-duplicate": {
    pattern: "Hash Table",
    mentalModel: "A set is a memory of values you have already seen. While scanning the array, the first value that is already in the set proves a duplicate exists.",
    recognition: ["The question asks whether any value appears at least twice.", "You do not need the duplicate's index or count, only existence.", "A nested comparison is repeatedly asking whether this value was seen before."],
    plan: ["Create a set for previously seen numbers.", "For each number, check whether the set already contains it.", "Return true immediately when a repeat is found.", "Add the number to the set only after the check.", "Return false if the scan finishes without a repeat."],
    edgeCases: ["Empty or one-item arrays", "Duplicate appears at the beginning", "Duplicate appears only at the end", "Negative numbers and zero", "All values unique"],
    complexityTarget: "O(n) time because each number is checked once. O(n) space because the set can hold every number when all values are unique.",
    bugPrompt: "This Java Contains Duplicate sketch resets the set inside the loop, so it forgets everything seen before the current item.",
    buggyCode: `import java.util.HashSet;
import java.util.Set;

class Solution {
  public boolean containsDuplicate(int[] nums) {
    for (int num : nums) {
      Set<Integer> seen = new HashSet<>();

      if (seen.contains(num)) {
        return true;
      }

      seen.add(num);
    }

    return false;
  }
}`,
    fixHints: ["Create the set before the loop so it survives across iterations.", "Check before adding the current value.", "Test nums=[1, 2, 3, 1] and nums=[1, 2, 3, 4]."],
    solutionLanguage: "Java",
    solutionCode: `import java.util.HashSet;
import java.util.Set;

class Solution {
  public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();

    for (int num : nums) {
      if (seen.contains(num)) {
        return true;
      }

      seen.add(num);
    }

    return false;
  }
}`,
    solutionNotes: ["The set must live outside the loop so each iteration remembers earlier values.", "Return as soon as seen.contains(num) is true because one duplicate is enough.", "Time is O(n) for one pass; space is O(n) in the all-unique case."],
  },
  "two-sum": {
    pattern: "Hash Table",
    mentalModel: "As you scan left to right, the hash map remembers values you have already passed. For each number, ask whether its complement is already waiting in the map.",
    recognition: ["You need two different indices whose values combine to a target.", "A brute force loop repeatedly asks whether the needed partner exists.", "The order of the answer does not matter, but the original indices do."],
    plan: ["Create a map from value to index.", "For each index, compute complement = target - nums[i].", "Check the map before inserting the current value.", "Return the stored complement index and the current index when found.", "Insert nums[i] only after the check so an element cannot pair with itself."],
    edgeCases: ["Duplicate values, like [3, 3] with target 6", "Negative numbers", "Complement equals the current value", "No pair in defensive implementations"],
    complexityTarget: "O(n) time because each number is visited once. O(n) space because the map can hold up to n previously seen numbers.",
    bugPrompt: "This Java Two Sum sketch inserts before checking, so one value can pair with itself.",
    buggyCode: `import java.util.HashMap;
import java.util.Map;

class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
      seen.put(nums[i], i);
      int complement = target - nums[i];

      if (seen.containsKey(complement)) {
        return new int[] { seen.get(complement), i };
      }
    }

    return new int[] {};
  }
}`,
    fixHints: ["Check for the complement before inserting the current value.", "Make sure the two returned indices are different.", "Test nums=[3, 2, 4], target=6 and nums=[3, 3], target=6."],
    solutionLanguage: "Java",
    solutionCode: `import java.util.HashMap;
import java.util.Map;

class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
      int complement = target - nums[i];

      if (seen.containsKey(complement)) {
        return new int[] { seen.get(complement), i };
      }

      seen.put(nums[i], i);
    }

    return new int[] {};
  }
}`,
    solutionNotes: ["Check the complement before inserting the current number.", "The map stores value -> index so the answer can return original positions.", "Time is O(n) because the loop visits each element once; space is O(n) because the map can grow with the input."],
  },
  "find-all-numbers-disappeared-in-an-array": {
    pattern: "In-Place Marking",
    mentalModel: "Every value is between 1 and n, so value x owns index x - 1. Mark that index negative to record that x appeared; indices that remain positive identify the missing values.",
    recognition: ["The array length is n and every value lies in the closed range 1 to n.", "You need to report which values from that range never appear.", "The prompt asks for O(n) time without using extra space for a set."],
    plan: ["Scan each value and use Math.abs because earlier visits may already have negated it.", "Convert value x to index x - 1.", "Negate nums[index] only when it is still positive.", "Scan the array again.", "For every positive nums[i], add i + 1 to the answer."],
    edgeCases: ["Every number appears", "Every number is the same", "Duplicate values mark the same index more than once", "The missing value is 1 or n", "Values encountered after their own positions were negated"],
    complexityTarget: "O(n) time for two linear passes. O(1) auxiliary space, excluding the returned list, because presence is encoded in the input array.",
    bugPrompt: "This Java sketch uses nums[i] directly after the array has started changing. A previously negated value can produce a negative index.",
    buggyCode: `import java.util.ArrayList;
import java.util.List;

class Solution {
  public List<Integer> findDisappearedNumbers(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
      int index = nums[i] - 1;
      nums[index] = -nums[index];
    }

    List<Integer> missing = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] > 0) {
        missing.add(i + 1);
      }
    }

    return missing;
  }
}`,
    fixHints: ["Recover the original value with Math.abs(nums[i]).", "Negate a target only when it is positive so duplicate values do not flip it back.", "Test nums=[4, 3, 2, 7, 8, 2, 3, 1] and nums=[1, 1]."],
    solutionLanguage: "Java",
    solutionCode: `import java.util.ArrayList;
import java.util.List;

class Solution {
  public List<Integer> findDisappearedNumbers(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
      int index = Math.abs(nums[i]) - 1;

      if (nums[index] > 0) {
        nums[index] = -nums[index];
      }
    }

    List<Integer> missing = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] > 0) {
        missing.add(i + 1);
      }
    }

    return missing;
  }
}`,
    solutionNotes: ["The value-to-index mapping is x -> x - 1 because array indices are zero-based.", "Math.abs preserves the original value even after its current position has been marked.", "A positive position i after marking means value i + 1 was never encountered."],
  },
  "missing-number": {
    pattern: "Bit Manipulation",
    mentalModel: "Start with the direct question: for every expected number from 0 through n, scan the array to see whether it exists. That two-loop solution makes the problem obvious. XOR then optimizes the repeated searching by cancelling every present value in one pass.",
    recognition: ["The array contains n distinct values chosen from the complete range 0 through n.", "Exactly one expected value has no matching copy in the array.", "You want O(n) time and O(1) extra space; XOR also avoids arithmetic overflow."],
    plan: ["First picture the brute-force search: choose each candidate from 0 through n, then scan nums for that candidate.", "The first candidate not found in the inner loop is the missing number.", "To optimize, remember the XOR rules: x ^ x = 0 and x ^ 0 = x.", "Initialize missing to n, then XOR every index and array value into it.", "Return the one value that could not cancel with a matching copy."],
    edgeCases: ["Missing value is 0", "Missing value is n", "Single-element arrays [0] and [1]", "Input order is arbitrary", "Large n where a sum formula needs wider arithmetic"],
    complexityTarget: "O(n) time because the array is scanned once. O(1) extra space because XOR uses one accumulator.",
    bugPrompt: "This Java XOR sketch starts at 0 and only pairs array indices 0 through n - 1 with the values. It forgets to include the expected value n.",
    buggyCode: `class Solution {
  public int missingNumber(int[] nums) {
    int missing = 0;

    for (int i = 0; i < nums.length; i++) {
      missing ^= i;
      missing ^= nums[i];
    }

    return missing;
  }
}`,
    fixHints: ["The expected range has n + 1 values: 0 through n.", "Initialize the accumulator with nums.length, or XOR n separately.", "Test nums=[3, 0, 1], nums=[0, 1], and nums=[0]."],
    bruteForceLanguage: "Java",
    bruteForceCode: `class Solution {
  public int missingNumber(int[] nums) {
    for (int candidate = 0; candidate <= nums.length; candidate++) {
      boolean found = false;

      for (int num : nums) {
        if (num == candidate) {
          found = true;
          break;
        }
      }

      if (!found) {
        return candidate;
      }
    }

    return -1;
  }
}`,
    bruteForceNotes: ["The outer loop tries every number that should exist: 0 through n.", "The inner loop searches the array for the current candidate.", "If the inner loop finishes without finding the candidate, that candidate is the answer.", "This is easy to reason about, but it can scan n array values for each of n + 1 candidates, so time is O(n²). Space is O(1)."],
    solutionLanguage: "Java",
    solutionCode: `class Solution {
  public int missingNumber(int[] nums) {
    int missing = nums.length;

    for (int i = 0; i < nums.length; i++) {
      missing ^= i;
      missing ^= nums[i];
    }

    return missing;
  }
}`,
    solutionNotes: ["Indices contribute expected values 0 through n - 1, while the initial nums.length contributes n.", "Array entries contribute every value that is actually present.", "Each present value appears once on both sides and cancels because x ^ x = 0; only the missing value appears once.", "A sum formula, hash set, or sorting also works, but XOR gives O(n) time and O(1) space without overflow."],
  },
  "majority-element": {
    pattern: "Boyer-Moore Voting",
    mentalModel: "Cancel different values in pairs. Because the majority appears more than half the time, it cannot be completely cancelled and must be the final candidate.",
    recognition: ["One value is guaranteed to appear more than floor(n / 2) times.", "You only need the majority value, not every frequency.", "A hash map works, but the guarantee allows a constant-space voting algorithm."],
    plan: ["Keep a candidate and a count.", "When count is zero, choose the current number as the new candidate.", "Increment count when the current number equals the candidate.", "Otherwise decrement count to cancel one candidate occurrence.", "Return the final candidate; the problem guarantee makes a verification pass unnecessary."],
    edgeCases: ["Single-element array", "Majority changes the apparent candidate several times", "Majority appears mostly near the end", "Negative values", "Exactly the minimum valid majority count"],
    complexityTarget: "O(n) time for one pass. O(1) extra space because the algorithm stores only a candidate and its vote count.",
    bugPrompt: "This Java voting sketch checks whether count is zero after processing the current number. When count reaches zero, it can skip choosing the current value as the next candidate.",
    buggyCode: `class Solution {
  public int majorityElement(int[] nums) {
    int candidate = nums[0];
    int count = 0;

    for (int num : nums) {
      if (num == candidate) {
        count++;
      } else {
        count--;
      }

      if (count == 0) {
        candidate = num;
      }
    }

    return candidate;
  }
}`,
    fixHints: ["Choose a candidate at the start of an iteration whenever count is zero.", "Then compare the current value with that candidate and update the count.", "Test nums=[1, 2, 3, 3, 3]; the broken version returns 2 instead of 3."],
    solutionLanguage: "Java",
    solutionCode: `class Solution {
  public int majorityElement(int[] nums) {
    int candidate = 0;
    int count = 0;

    for (int num : nums) {
      if (count == 0) {
        candidate = num;
      }

      count += num == candidate ? 1 : -1;
    }

    return candidate;
  }
}`,
    solutionNotes: ["A non-candidate value cancels one vote for the current candidate.", "Resetting only when count is zero starts a fresh unresolved suffix.", "Since a strict majority is guaranteed, pair cancellation cannot eliminate every occurrence of the answer."],
  },
};

const guides: Record<string, Omit<StudyGuide, "pattern">> = {
  "Array": {
    mentalModel: "Track positions and values deliberately. Most array mistakes come from mutating too early, skipping an index, or losing the original value.",
    recognition: ["The input is already indexed.", "You need one or more passes over contiguous values.", "The answer depends on comparing positions, counts, or ranges."],
    plan: ["Write down what each index represents.", "Decide whether mutation is allowed.", "Keep loop bounds boring and explicit.", "Test with empty, one-item, and duplicate-heavy inputs."],
    edgeCases: ["Empty or one-item arrays", "All values identical", "Negative numbers", "Already sorted or reverse sorted input"],
    complexityTarget: "Usually O(n) time. Aim for O(1) extra space when mutation is allowed, otherwise O(n) is often fine.",
    bugPrompt: "This loop skips the first element and silently misses answers at index 0.",
    buggyCode: `function containsTarget(nums, target) {
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === target) return true;
  }
  return false;
}`,
    fixHints: ["Start at index 0 unless you have a proven reason not to.", "Say the loop invariant out loud before coding.", "Test target at the first and last position."],
  },
  "Hash Table": {
    mentalModel: "Trade memory for instant lookup. Store exactly the fact you will need later, not the entire story.",
    recognition: ["You need to find complements, duplicates, or frequencies.", "A nested loop is checking whether something was seen before.", "Order matters less than lookup speed."],
    plan: ["Define the key before coding.", "Decide whether to check before insert or insert before check.", "Store indices when the result needs positions.", "Handle duplicates intentionally."],
    edgeCases: ["Duplicate values", "Complement equals current value", "Missing key", "Case sensitivity in strings"],
    complexityTarget: "Usually O(n) time and O(n) space.",
    bugPrompt: "This Two Sum sketch inserts before checking, so one value can pair with itself.",
    buggyCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    seen.set(nums[i], i);
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
  }
}`,
    fixHints: ["Check for the complement before inserting the current value.", "Make sure the two returned indices are different.", "Test nums=[3, 2, 4], target=6 and nums=[3, 3], target=6."],
  },
  "Two Pointers": {
    mentalModel: "Move pointers because you can prove one side is no longer useful. The proof matters more than the code.",
    recognition: ["The input is sorted or can be sorted.", "You compare two ends or keep slow/fast positions.", "A brute force pair search can be collapsed."],
    plan: ["Name what left and right mean.", "Write the condition that moves each pointer.", "Move only the pointer whose candidates are proven worse.", "Watch for crossing pointers."],
    edgeCases: ["Pointers meet", "Repeated values", "All small or all large values", "Even versus odd length"],
    complexityTarget: "Usually O(n) after any required sort. Sorting makes it O(n log n).",
    bugPrompt: "This loop can get stuck because neither pointer moves when the sum equals target.",
    buggyCode: `function hasPair(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) continue;
    if (sum < target) left++;
    else right--;
  }
  return false;
}`,
    fixHints: ["Return immediately when the target is found.", "Every loop path should make progress or exit.", "Use while (left < right), not <=, for distinct pair positions."],
  },
  "Sliding Window": {
    mentalModel: "Maintain facts about a moving interval. Expand to include new data, then shrink until the window is valid again.",
    recognition: ["The problem asks for a substring or subarray.", "You need longest, shortest, or count under a constraint.", "Brute force repeats work for overlapping ranges."],
    plan: ["Define what makes a window valid.", "Add the right value first.", "Shrink from the left while invalid.", "Update the answer at the correct moment."],
    edgeCases: ["Empty string", "Window never becomes valid", "All characters same", "Constraint k equals 0"],
    complexityTarget: "Usually O(n) time because each pointer moves forward at most n times.",
    bugPrompt: "This window shrinks only once, but invalid windows may need several left moves.",
    buggyCode: `function longestAtMostK(nums, k) {
  let left = 0;
  let sum = 0;
  let best = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    if (sum > k) sum -= nums[left++];
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    fixHints: ["Use while, not if, when a window can remain invalid.", "Update best only after the window is valid.", "Test with one very large value."],
  },
  "Binary Search": {
    mentalModel: "Cut the search space using a monotonic truth: false false false true true, or the reverse.",
    recognition: ["Sorted input.", "Find first/last valid value.", "The answer can be guessed and checked monotonically."],
    plan: ["Define the exact predicate.", "Choose inclusive or half-open bounds and stick to it.", "Use mid without overflow habits.", "Return the boundary you proved correct."],
    edgeCases: ["No valid answer", "First or last item is answer", "Two-element range", "Repeated values"],
    complexityTarget: "O(log n) time for direct search. O(log answer_range * check_cost) for answer search.",
    bugPrompt: "This search can loop forever when left and right are adjacent.",
    buggyCode: `function firstGreater(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] <= target) left = mid;
    else right = mid;
  }
  return left;
}`,
    fixHints: ["When discarding mid, move to mid + 1.", "Track whether you are returning an index or insertion point.", "Test two elements: [1, 3], target=1."],
  },
  "Dynamic Programming": {
    mentalModel: "Cache answers to smaller decisions. A DP state should answer one clear question.",
    recognition: ["Overlapping subproblems.", "Choose/take/skip decisions.", "Count ways, optimize value, or decide possible/impossible."],
    plan: ["Write the recursive relation in words.", "Define state variables.", "Choose base cases before loops.", "Fill states in dependency order."],
    edgeCases: ["Zero target", "Empty input", "Impossible state", "Repeated choices"],
    complexityTarget: "Depends on state count. First estimate number of states times transition cost.",
    bugPrompt: "This coin-change loop counts ordered sequences when you may have meant combinations.",
    buggyCode: `function countWays(coins, amount) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (total >= coin) dp[total] += dp[total - coin];
    }
  }
  return dp[amount];
}`,
    fixHints: ["Loop order changes the meaning.", "Coins outermost counts combinations.", "Amounts outermost counts ordered sequences."],
  },
  "Tree": {
    mentalModel: "Every node asks the same small question, then combines answers from children.",
    recognition: ["Recursive structure.", "Need depth, path, ancestor, subtree, or traversal.", "Each node's answer depends on left and right child answers."],
    plan: ["Pick traversal order.", "Define what the helper returns.", "Handle null first.", "Keep global answer separate from returned value if needed."],
    edgeCases: ["Empty tree", "Single node", "Skewed tree", "Negative values in path problems"],
    complexityTarget: "Usually O(n) time and O(h) recursion stack.",
    bugPrompt: "This depth function ignores the deeper side of the tree.",
    buggyCode: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.min(maxDepth(root.left), maxDepth(root.right));
}`,
    fixHints: ["Maximum depth needs the larger child depth.", "Minimum depth has its own special null-child trap.", "Test a skewed tree."],
  },
  "Graph": {
    mentalModel: "Model states as nodes and allowed moves as edges. Most bugs come from visiting too late or revisiting forever.",
    recognition: ["Connections, dependencies, islands, courses, shortest paths, components.", "You can move from one state to neighboring states.", "Cycles may exist."],
    plan: ["Build or infer adjacency.", "Choose BFS for shortest unweighted paths, DFS for exploration.", "Mark visited when enqueuing/pushing.", "Handle disconnected components."],
    edgeCases: ["Cycle", "Disconnected graph", "Self-loop", "Duplicate edges"],
    complexityTarget: "Usually O(V + E) time and O(V) space.",
    bugPrompt: "This BFS marks visited too late, so duplicate edges can enqueue the same node many times.",
    buggyCode: `function bfs(start, graph) {
  const queue = [start];
  const seen = new Set();
  while (queue.length) {
    const node = queue.shift();
    seen.add(node);
    for (const next of graph[node] ?? []) {
      if (!seen.has(next)) queue.push(next);
    }
  }
  return seen;
}`,
    fixHints: ["Mark as seen before enqueueing.", "A queue implemented with shift is also costly for large inputs.", "Test a diamond-shaped graph with two paths to the same node."],
  },
};

const aliases: Record<string, string> = {
  "Depth-First Search": "Graph",
  "Breadth-First Search": "Graph",
  "Matrix": "Graph",
  "Backtracking": "Dynamic Programming",
  "Recursion": "Tree",
  "String": "Sliding Window",
  "Linked List": "Two Pointers",
  "Stack": "Array",
  "Heap": "Array",
  "Trie": "Tree",
};

const fallback: Omit<StudyGuide, "pattern"> = {
  mentalModel: "Convert the prompt into state, transitions, and invariants before writing code.",
  recognition: ["A direct brute force exists but repeats work.", "The key trick is choosing what information to preserve.", "Small examples reveal the invariant."],
  plan: ["Restate input and output.", "Solve one tiny example by hand.", "Write brute force first in plain English.", "Identify the repeated work or decisive invariant.", "Code the optimized version after the invariant is clear."],
  edgeCases: ["Empty input", "Minimum size input", "Duplicates", "Extremely large values", "No valid answer"],
  complexityTarget: "Beat brute force if the pattern gives you a clear invariant; otherwise keep the first version correct and simple.",
  bugPrompt: "This generic loop has an off-by-one bug and reads past the end.",
  buggyCode: `function scan(values) {
  for (let i = 0; i <= values.length; i++) {
    console.log(values[i]);
  }
}`,
  fixHints: ["Use i < values.length.", "Add a test for empty input.", "Name the last valid index before coding."],
};

export function getStudyGuide(question: Question): StudyGuide {
  const questionGuide = questionGuides[question.slug];
  if (questionGuide) return questionGuide;

  const pattern = question.pattern[0] ?? "General";
  const key = guides[pattern] ? pattern : aliases[pattern] ?? pattern;
  return {
    pattern,
    ...(guides[key] ?? fallback),
  };
}
