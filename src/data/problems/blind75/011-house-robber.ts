import { ProblemDataset } from "./types";

export const houseRobber: ProblemDataset = {
  id: "011-house-robber",
  slug: "house-robber",
  title: "House Robber",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  tags: ["Dynamic Programming", "Array"],
  companies: ["Amazon", "Google", "Microsoft", "Uber"],
  estimatedTime: 20,
  acceptanceRate: 64.2,
  likes: 47000,
  dislikes: 1400,
  functionName: "rob",
  outputType: "number",
  validatorType: "exact",
  problemStatement: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. If you rob two adjacent houses, the alarm will go off. Return the maximum amount of money you can rob without alerting the police.",
  constraints: ["0 <= nums.length <= 100", "0 <= nums[i] <= 400"],
  visibleTestCases: [
    {
      input: JSON.stringify({ nums: [1, 2, 3, 1] }),
      expectedOutput: "4",
      explanation: "Rob house 1 and 3 for a total of 4."
    },
    {
      input: JSON.stringify({ nums: [2, 7, 9, 3, 1] }),
      expectedOutput: "12",
      explanation: "Rob houses 2 and 4 for a total of 12."
    },
    {
      input: JSON.stringify({ nums: [1] }),
      expectedOutput: "1",
      explanation: "Only one house is available, so rob it."
    },
    {
      input: JSON.stringify({ nums: [2, 1, 1, 2] }),
      expectedOutput: "4",
      explanation: "Rob the first and last houses for a total of 4."
    },
    {
      input: JSON.stringify({ nums: [0] }),
      expectedOutput: "0",
      explanation: "A zero-value house contributes nothing to the maximum."
    }
  ],
  hiddenTestCases: [
    {
      input: JSON.stringify({ nums: [] }),
      expectedOutput: "0",
      explanation: "An empty street has no houses to rob."
    },
    {
      input: JSON.stringify({ nums: [7] }),
      expectedOutput: "7",
      explanation: "Single-house base case."
    },
    {
      input: JSON.stringify({ nums: [2, 1, 1, 2] }),
      expectedOutput: "4",
      explanation: "Classic small example with two separated best choices."
    },
    {
      input: JSON.stringify({ nums: [5, 3, 4, 11, 2] }),
      expectedOutput: "16",
      explanation: "The best plan is to rob house 4 and skip the rest."
    },
    {
      input: JSON.stringify({ nums: [1, 3, 1, 3, 100] }),
      expectedOutput: "103",
      explanation: "Rob the last house and one of the earlier houses for the best total."
    },
    {
      input: JSON.stringify({ nums: [4, 1, 2, 7, 5, 3, 1] }),
      expectedOutput: "14",
      explanation: "A slightly longer case that requires careful skipping."
    },
    {
      input: JSON.stringify({ nums: [8, 1, 2, 3, 4, 5, 6, 7] }),
      expectedOutput: "23",
      explanation: "The optimal strategy uses non-adjacent houses spread across the street."
    },
    {
      input: JSON.stringify({ nums: [2, 2, 2, 2] }),
      expectedOutput: "4",
      explanation: "Rob alternating houses to maximize the total."
    },
    {
      input: JSON.stringify({ nums: [1, 0, 1, 0, 1] }),
      expectedOutput: "3",
      explanation: "A sparse pattern should still yield the correct maximum."
    },
    {
      input: JSON.stringify({ nums: [0, 0, 0, 0, 0] }),
      expectedOutput: "0",
      explanation: "All values are zero, so the maximum remains zero."
    },
    {
      input: JSON.stringify({ nums: [10, 20, 30, 40, 50, 60] }),
      expectedOutput: "120",
      explanation: "The optimal plan skips several houses and still earns the best total."
    },
    {
      input: JSON.stringify({ nums: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }),
      expectedOutput: "5",
      explanation: "With every house worth one, the best strategy is to take every other house."
    },
    {
      input: JSON.stringify({ nums: [100, 1, 100, 1, 100, 1, 100] }),
      expectedOutput: "400",
      explanation: "The optimal solution is to take all even-indexed houses."
    },
    {
      input: JSON.stringify({ nums: [2, 7, 9, 3, 1, 8, 3] }),
      expectedOutput: "18",
      explanation: "The recurrence should choose the right non-adjacent combination."
    },
    {
      input: JSON.stringify({ nums: [10, 9, 1, 3, 2] }),
      expectedOutput: "13",
      explanation: "The last two houses are worth less than the earlier house combination."
    },
    {
      input: JSON.stringify({ nums: [100, 2, 100, 2, 100, 2, 100] }),
      expectedOutput: "400",
      explanation: "A repeated pattern of large values should still produce the correct optimum."
    },
    {
      input: JSON.stringify({ nums: [5, 5, 5, 5, 5, 5] }),
      expectedOutput: "15",
      explanation: "With repeated equal values, the best plan is to take every other house."
    },
    {
      input: JSON.stringify({ nums: [4, 4, 4, 4, 4, 4, 4] }),
      expectedOutput: "16",
      explanation: "The optimal result is obtained by alternating across a longer array."
    },
    {
      input: JSON.stringify({ nums: [1, 5, 1, 5, 1, 5] }),
      expectedOutput: "15",
      explanation: "The high-value houses can be robbbed without violating the adjacency rule."
    },
    {
      input: JSON.stringify({ nums: [3, 6, 1, 3, 10, 4] }),
      expectedOutput: "16",
      explanation: "The best plan takes the large middle-value house and another distant house."
    },
    {
      input: JSON.stringify({ nums: [2, 1, 2, 1, 2, 1] }),
      expectedOutput: "6",
      explanation: "Repeated two-value patterns should still be solved correctly."
    },
    {
      input: JSON.stringify({ nums: Array(100).fill(400) }),
      expectedOutput: "20000",
      explanation: "A large test case with repeated values checks efficiency and correctness at scale."
    }
  ],
  starterCode: {
    cpp: "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        return 0;\n    }\n};",
    java: "class Solution {\n    public int rob(int[] nums) {\n        return 0;\n    }\n}",
    python: "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        pass",
    javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar rob = function(nums) {\n    return 0;\n};",
    typescript: "function rob(nums: number[]): number {\n    return 0;\n}",
    c: "int rob(int* nums, int numsSize) {\n    return 0;\n}"
  },
  solutions: {
    cpp: "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        int prev2 = 0;\n        int prev1 = 0;\n        for (int value : nums) {\n            int current = max(prev1, prev2 + value);\n            prev2 = prev1;\n            prev1 = current;\n        }\n        return prev1;\n    }\n};",
    java: "class Solution {\n    public int rob(int[] nums) {\n        int prev2 = 0;\n        int prev1 = 0;\n        for (int value : nums) {\n            int current = Math.max(prev1, prev2 + value);\n            prev2 = prev1;\n            prev1 = current;\n        }\n        return prev1;\n    }\n}",
    python: "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        prev2 = 0\n        prev1 = 0\n        for value in nums:\n            prev2, prev1 = prev1, max(prev1, prev2 + value)\n        return prev1",
    javascript: "var rob = function(nums) {\n    let prev2 = 0;\n    let prev1 = 0;\n    for (const value of nums) {\n        const current = Math.max(prev1, prev2 + value);\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n};",
    typescript: "function rob(nums: number[]): number {\n    let prev2 = 0;\n    let prev1 = 0;\n    for (const value of nums) {\n        const current = Math.max(prev1, prev2 + value);\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n}",
    c: "int rob(int* nums, int numsSize) {\n    int prev2 = 0;\n    int prev1 = 0;\n    for (int i = 0; i < numsSize; ++i) {\n        int current = prev1 > prev2 + nums[i] ? prev1 : prev2 + nums[i];\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n}"
  },
  bruteForceApproach: "Try every subset of houses that avoids adjacent pairs, and take the maximum sum. This requires checking exponentially many combinations.",
  bruteForceTimeComplexity: "O(2^n)",
  bruteForceSpaceComplexity: "O(n)",
  optimalApproach: "Use dynamic programming with two rolling values: the best answer for the previous house and the best answer for the house before that, then update the recurrence dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]).",
  optimalTimeComplexity: "O(n)",
  optimalSpaceComplexity: "O(1)",
  interviewHints: [
    "Ask whether the recurrence should consider the current house or skip it.",
    "Point out that each house decision depends only on the previous two results.",
    "Mention that this is a classic example of optimizing a recursive solution with state compression."
  ],
  commonMistakes: [
    "Forgetting to carry forward the value from two steps ago when updating the DP state.",
    "Using an O(n^2) solution when an O(n) rolling-state approach is enough.",
    "Failing to handle the empty array or single-house base cases."
  ]
};
