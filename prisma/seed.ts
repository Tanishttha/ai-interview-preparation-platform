import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const questions = [
    {
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays & Hashing',
      acceptance: '49.8%',
      content:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
        { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] }
      ],
      harness: {
        typescript:
          '__CANDIDATE_CODE__\n\nconst __testInput = __TEST_INPUT__;\nconst __result = twoSum(__testInput.nums, __testInput.target);\nconsole.log(JSON.stringify(__result));',
        javascript:
          '__CANDIDATE_CODE__\n\nconst __testInput = __TEST_INPUT__;\nconst __result = twoSum(__testInput.nums, __testInput.target);\nconsole.log(JSON.stringify(__result));'
      }
    },
    {
      id: 'q2',
      title: 'LRU Cache',
      difficulty: 'Hard',
      category: 'System Design / Core',
      acceptance: '41.2%',
      content:
        'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
      constraints: '1 <= capacity <= 3000\n0 <= key <= 10^4\n0 <= value <= 10^5'
    },
    {
      id: 'q3',
      title: 'Merge k Sorted Lists',
      difficulty: 'Hard',
      category: 'Heaps / LinkedLists',
      acceptance: '48.8%',
      content: 'Merge all the given sorted linked-lists into one sorted linked-list.',
      constraints: 'k == lists.length\n0 <= k <= 10^4'
    },
    {
      id: 'q4',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stacks',
      acceptance: '41.0%',
      content: "Given a string s of '(){}[]', determine if the input string is valid.",
      constraints: '1 <= s.length <= 10^4'
    },
    {
      id: 'q5',
      title: 'Longest Palindromic Substring',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      acceptance: '32.4%',
      content: 'Given a string s, return the longest palindromic substring in s.',
      constraints: '1 <= s.length <= 1000'
    }
  ];

  for (const q of questions) {
    await prisma.codingQuestion.upsert({
      where: { id: q.id },
      update: q as any,
      create: q as any
    });
  }

  console.log(`Seeded ${questions.length} coding questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
