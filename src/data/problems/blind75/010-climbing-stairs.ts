import { ProblemDataset } from "./types";

export const climbingStairs: ProblemDataset = {
  id: "010-climbing-stairs",
  slug: "climbing-stairs",
  title: "Climbing Stairs",
  difficulty: "Easy",
  topic: "Dynamic Programming",
  tags: ["Dynamic Programming", "Math", "Recursion"],
  companies: ["Google", "Amazon", "Microsoft", "Meta"],
  estimatedTime: 15,
  acceptanceRate: 68.8,
  likes: 61000,
  dislikes: 1800,
  functionName: "climbStairs",
  outputType: "number",
  validatorType: "exact",
  problemStatement: "You are climbing a staircase that takes n steps to reach the top. Each time you can either climb 1 or 2 steps. Return the number of distinct ways you can climb to the top.",
  constraints: ["1 <= n <= 45"],
  visibleTestCases: [
    {
      input: JSON.stringify({ n: 2 }),
      expectedOutput: "2",
      explanation: "There are two ways: (1 step + 1 step) or (2 steps)."
    },
    {
      input: JSON.stringify({ n: 3 }),
      expectedOutput: "3",
      explanation: "There are three ways: (1+1+1), (1+2), or (2+1)."
    },
    {
      input: JSON.stringify({ n: 1 }),
      expectedOutput: "1",
      explanation: "There is only one way to climb a single step: one step at a time."
    },
    {
      input: JSON.stringify({ n: 4 }),
      expectedOutput: "5",
      explanation: "The count follows a Fibonacci-like pattern: ways(4) = ways(3) + ways(2) = 3 + 2 = 5."
    },
    {
      input: JSON.stringify({ n: 5 }),
      expectedOutput: "8",
      explanation: "ways(5) = ways(4) + ways(3) = 5 + 3 = 8."
    }
  ],
  hiddenTestCases: [
    {
      input: JSON.stringify({ n: 6 }),
      expectedOutput: "13",
      explanation: "ways(6) = ways(5) + ways(4) = 8 + 5 = 13."
    },
    {
      input: JSON.stringify({ n: 7 }),
      expectedOutput: "21",
      explanation: "ways(7) = ways(6) + ways(5) = 13 + 8 = 21."
    },
    {
      input: JSON.stringify({ n: 8 }),
      expectedOutput: "34",
      explanation: "ways(8) = ways(7) + ways(6) = 21 + 13 = 34."
    },
    {
      input: JSON.stringify({ n: 9 }),
      expectedOutput: "55",
      explanation: "ways(9) = ways(8) + ways(7) = 34 + 21 = 55."
    },
    {
      input: JSON.stringify({ n: 10 }),
      expectedOutput: "89",
      explanation: "ways(10) = ways(9) + ways(8) = 55 + 34 = 89."
    },
    {
      input: JSON.stringify({ n: 11 }),
      expectedOutput: "144",
      explanation: "ways(11) = ways(10) + ways(9) = 89 + 55 = 144."
    },
    {
      input: JSON.stringify({ n: 12 }),
      expectedOutput: "233",
      explanation: "ways(12) = ways(11) + ways(10) = 144 + 89 = 233."
    },
    {
      input: JSON.stringify({ n: 13 }),
      expectedOutput: "377",
      explanation: "ways(13) = ways(12) + ways(11) = 233 + 144 = 377."
    },
    {
      input: JSON.stringify({ n: 14 }),
      expectedOutput: "610",
      explanation: "ways(14) = ways(13) + ways(12) = 377 + 233 = 610."
    },
    {
      input: JSON.stringify({ n: 15 }),
      expectedOutput: "987",
      explanation: "ways(15) continues the Fibonacci-style recurrence."
    },
    {
      input: JSON.stringify({ n: 16 }),
      expectedOutput: "1597",
      explanation: "ways(16) provides another intermediate checkpoint."
    },
    {
      input: JSON.stringify({ n: 20 }),
      expectedOutput: "10946",
      explanation: "Mid-range value verifying the recurrence holds correctly over many iterations."
    },
    {
      input: JSON.stringify({ n: 25 }),
      expectedOutput: "121393",
      explanation: "Larger mid-range value used as a general correctness spot check."
    },
    {
      input: JSON.stringify({ n: 30 }),
      expectedOutput: "1346269",
      explanation: "Larger value approaching the point where naive exponential recursion becomes impractically slow."
    },
    {
      input: JSON.stringify({ n: 35 }),
      expectedOutput: "14930352",
      explanation: "Large value where the result exceeds 10 million, testing correctness with larger accumulation."
    },
    {
      input: JSON.stringify({ n: 40 }),
      expectedOutput: "165580141",
      explanation: "Large value with a result over 165 million, still within safe integer range."
    },
    {
      input: JSON.stringify({ n: 44 }),
      expectedOutput: "1134903170",
      explanation: "Near-maximum boundary value close to the 32-bit signed integer limit."
    },
    {
      input: JSON.stringify({ n: 45 }),
      expectedOutput: "1836311903",
      explanation: "Maximum boundary value per constraints."
    },
    {
      input: JSON.stringify({ n: 2 }),
      expectedOutput: "2",
      explanation: "Repeated base case confirming the two-step foundation of the recurrence."
    },
    {
      input: JSON.stringify({ n: 1 }),
      expectedOutput: "1",
      explanation: "Repeated minimum boundary value confirming the base case is stable."
    }
  ],
  starterCode: {
    cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};",
    java: "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}",
    python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
    javascript: "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    return 0;\n};",
    typescript: "function climbStairs(n: number): number {\n    return 0;\n}",
    c: "int climbStairs(int n) {\n    return 0;\n}"
  },
  solutions: {
    cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1;\n        int prev1 = 2;\n        for (int i = 3; i <= n; ++i) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n};",
    java: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1;\n        int prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}",
    python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2:\n            return n\n        prev2, prev1 = 1, 2\n        for _ in range(3, n + 1):\n            prev2, prev1 = prev1, prev1 + prev2\n        return prev1",
    javascript: "var climbStairs = function(n) {\n    if (n <= 2) return n;\n    let prev2 = 1;\n    let prev1 = 2;\n    for (let i = 3; i <= n; i++) {\n        const curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n};",
    typescript: "function climbStairs(n: number): number {\n    if (n <= 2) return n;\n    let prev2 = 1;\n    let prev1 = 2;\n    for (let i = 3; i <= n; i++) {\n        const curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}",
    c: "int climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev2 = 1;\n    int prev1 = 2;\n    for (int i = 3; i <= n; ++i) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}"
  },
  bruteForceApproach: "Use naive recursion: climbStairs(n) = climbStairs(n - 1) + climbStairs(n - 2), with base cases climbStairs(1) = 1 and climbStairs(2) = 2, recomputing overlapping subproblems repeatedly.",
  bruteForceTimeComplexity: "O(2^n)",
  bruteForceSpaceComplexity: "O(n)",
  optimalApproach: "Recognize this as a Fibonacci-style recurrence and compute it iteratively using two rolling variables representing the number of ways to reach the previous two steps, updating them in a single pass from step 3 up to n.",
  optimalTimeComplexity: "O(n)",
  optimalSpaceComplexity: "O(1)",
  interviewHints: [
    "Point out immediately that this is structurally identical to computing Fibonacci numbers.",
    "Start with the naive recursive solution to show the exponential blowup, then optimize with memoization, then further optimize to O(1) space with rolling variables.",
    "Clarify the base cases carefully: climbStairs(1) = 1 and climbStairs(2) = 2, not 1 and 1."
  ],
  commonMistakes: [
    "Using naive recursion without memoization, causing exponential time complexity that times out on moderately large n.",
    "Incorrect base cases, such as treating climbStairs(2) as 1 instead of 2.",
    "Off-by-one errors in the loop bounds when iterating from step 3 to n.",
    "Using unnecessary O(n) space for a full dynamic programming array when O(1) rolling variables suffice."
  ]
};
