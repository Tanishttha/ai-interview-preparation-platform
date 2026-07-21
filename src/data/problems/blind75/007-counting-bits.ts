import { ProblemDataset } from "./types";

export const countingBits: ProblemDataset = {
  id: "007-counting-bits",
  title: "Counting Bits",
  difficulty: "Easy",
  topic: "Bit Manipulation / Dynamic Programming",
  problemStatement: "Given an integer n, return an array ans of length n + 1 such that for each i in the range 0 <= i <= n, ans[i] is the number of 1 bits in the binary representation of i.",
  constraints: [
    "0 <= n <= 100000"
  ],
  visibleTestCases: [
    {
      input: JSON.stringify({ n: 2 }),
      expectedOutput: JSON.stringify([0,1,1]),
      explanation: "0 has 0 bits, 1 has 1 bit, 2 (binary 10) has 1 bit."
    },
    {
      input: JSON.stringify({ n: 5 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2]),
      explanation: "Bit counts for 0 through 5: 0,1,10,11,100,101 have 0,1,1,2,1,2 set bits respectively."
    },
    {
      input: JSON.stringify({ n: 0 }),
      expectedOutput: JSON.stringify([0]),
      explanation: "Only the value 0 is included, which has zero set bits."
    },
    {
      input: JSON.stringify({ n: 1 }),
      expectedOutput: JSON.stringify([0,1]),
      explanation: "Minimum non-trivial case: 0 has zero bits, 1 has one bit."
    },
    {
      input: JSON.stringify({ n: 8 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1]),
      explanation: "Bit counts through a power of two boundary; 8 (binary 1000) resets to a single set bit."
    }
  ],
  hiddenTestCases: [
    {
      input: JSON.stringify({ n: 15 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4]),
      explanation: "Bit counts through 15 (binary 1111), the maximum count of 4 occurs at the last index."
    },
    {
      input: JSON.stringify({ n: 16 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1]),
      explanation: "One past the previous boundary; 16 resets to a single set bit, extending the array by one element."
    },
    {
      input: JSON.stringify({ n: 3 }),
      expectedOutput: JSON.stringify([0,1,1,2]),
      explanation: "Small case ending exactly at a value with two set bits (3 is binary 11)."
    },
    {
      input: JSON.stringify({ n: 4 }),
      expectedOutput: JSON.stringify([0,1,1,2,1]),
      explanation: "Corner case where the final index is a power of two with a single set bit."
    },
    {
      input: JSON.stringify({ n: 31 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5]),
      explanation: "Range through 31 (binary 11111), the maximum bit count of 5 appears exactly once at the end."
    },
    {
      input: JSON.stringify({ n: 32 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1]),
      explanation: "One past the prior boundary, 32 resets to a single set bit again."
    },
    {
      input: JSON.stringify({ n: 6 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2]),
      explanation: "Small mid-range case verifying values that are not exact powers of two."
    },
    {
      input: JSON.stringify({ n: 7 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3]),
      explanation: "Ends at 7 (binary 111), three consecutive set bits, one before the next power-of-two reset."
    },
    {
      input: JSON.stringify({ n: 9 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2]),
      explanation: "One past a power-of-two boundary, verifying correct continuation of the pattern after a reset."
    },
    {
      input: JSON.stringify({ n: 10 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2,2]),
      explanation: "Mid-sequence case with a mix of increasing and resetting bit counts."
    },
    {
      input: JSON.stringify({ n: 63 }),
      expectedOutput: JSON.stringify(Array.from({length:64}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "Range through 63 (binary 111111), verifying the pattern holds through a full six-bit boundary, computed programmatically for exactness."
    },
    {
      input: JSON.stringify({ n: 64 }),
      expectedOutput: JSON.stringify(Array.from({length:65}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "One past the six-bit boundary, resetting to a single set bit at index 64."
    },
    {
      input: JSON.stringify({ n: 127 }),
      expectedOutput: JSON.stringify(Array.from({length:128}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "Range through 127 (binary 1111111), the maximum bit count of 7 appears exactly once at the final index."
    },
    {
      input: JSON.stringify({ n: 100 }),
      expectedOutput: JSON.stringify(Array.from({length:101}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "Round-number range used as a general correctness check across a non-power-of-two upper bound."
    },
    {
      input: JSON.stringify({ n: 255 }),
      expectedOutput: JSON.stringify(Array.from({length:256}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "Range through 255 (binary 11111111), an eight-bit boundary with maximum count 8 at the final index."
    },
    {
      input: JSON.stringify({ n: 256 }),
      expectedOutput: JSON.stringify(Array.from({length:257}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "One past the eight-bit boundary, resetting to a single set bit."
    },
    {
      input: JSON.stringify({ n: 20 }),
      expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2]),
      explanation: "Arbitrary mid-range value used as a general correctness spot check."
    },
    {
      input: JSON.stringify({ n: 511 }),
      expectedOutput: JSON.stringify(Array.from({length:512}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "Range through 511 (binary 111111111), a nine-bit boundary with maximum count 9 at the final index."
    },
    {
      input: JSON.stringify({ n: 512 }),
      expectedOutput: JSON.stringify(Array.from({length:513}, (_, i) => i.toString(2).split("").filter(c => c === "1").length)),
      explanation: "One past the nine-bit boundary, resetting to a single set bit, verifying the DP transition across another power of two."
    },
    {
      input: JSON.stringify({ n: 1000 }),
      expectedOutput: '[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 5, 6, 6, 7, 6, 7, 7, 8, 6, 7, 7, 8, 7, 8, 8, 9, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 5, 6, 6, 7, 6, 7, 7, 8, 6, 7, 7, 8, 7, 8, 8, 9, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 5, 6, 6, 7, 6, 7, 7, 8, 6, 7, 7, 8, 7, 8, 8, 9, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 5, 6, 6, 7, 6, 7, 7, 8, 6, 7, 7, 8, 7, 8, 8, 9, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8, 5, 6, 6, 7, 6, 7, 7, 8, 6, 7, 7, 8, 7, 8, 8, 9, 5, 6, 6, 7, 6, 7, 7, 8, 6]',
      explanation: "Large-scale performance test computing bit counts for all integers from 0 through 1000, verifying the O(n) dynamic programming approach avoids the O(n log n) cost of recomputing each count from scratch."
    }
  ],
  starterCode: {
    cpp: "class Solution {\npublic:\n    vector<int> countBits(int n) {\n        \n    }\n};",
    java: "class Solution {\n    public int[] countBits(int n) {\n        \n    }\n}",
    python: "class Solution:\n    def countBits(self, n: int) -> List[int]:\n        pass",
    javascript: "/**\n * @param {number} n\n * @return {number[]}\n */\nvar countBits = function(n) {\n    \n};",
    typescript: "function countBits(n: number): number[] {\n    \n}"
  },
  bruteForceApproach: "For each integer i from 0 to n, independently count its set bits using the n & (n - 1) trick or by converting to a binary string, and store the result in the output array.",
  bruteForceTimeComplexity: "O(n log n)",
  bruteForceSpaceComplexity: "O(n) for the output array",
  optimalApproach: "Use dynamic programming: ans[i] = ans[i >> 1] + (i & 1). The number of set bits in i equals the number of set bits in i shifted right by one (i divided by two, dropping the last bit) plus one if the last bit of i is set. Build the array from ans[0] = 0 upward using previously computed results.",
  optimalTimeComplexity: "O(n)",
  optimalSpaceComplexity: "O(n) for the output array, O(1) extra space beyond it",
  interviewHints: [
    "Look for a recurrence relating ans[i] to a previously computed smaller value rather than recomputing bit counts from scratch.",
    "The relation ans[i] = ans[i >> 1] + (i & 1) is the key insight; explain why shifting right by one bit relates to dividing by two.",
    "An alternative recurrence ans[i] = ans[i & (i - 1)] + 1 also works by removing the lowest set bit.",
    "Mention that the output array itself requires O(n) space regardless of approach, so the optimization target is time complexity."
  ],
  commonMistakes: [
    "Recomputing each value independently with the brute-force bit-counting trick, missing the O(n) DP opportunity.",
    "Off-by-one errors in array sizing, forgetting the output must have n + 1 elements to include index 0.",
    "Incorrect recurrence direction, referencing ans[i + 1] instead of a strictly smaller previously computed index.",
    "Not handling n = 0 correctly, which should return a single-element array containing just 0."
  ]
};