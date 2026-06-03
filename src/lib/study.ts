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
  solutionLanguage?: string;
  solutionCode?: string;
  solutionNotes?: string[];
}

const questionGuides: Record<string, StudyGuide> = {
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
