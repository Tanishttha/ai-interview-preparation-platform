import fs from 'fs';
import path from 'path';
import { COMPANIES } from '../../data';

const DB_PATH = path.join(process.cwd(), 'db.json');

// Ensure database file exists
const initDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        {
          id: "candidate-default-id",
          email: "candidate@prepai.com",
          passwordHash: "$2b$10$xyz123abc456def789ghiO", // Mock bcrypt hash
          name: "Mehak",
          role: "CANDIDATE",
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      profiles: [
        {
          id: "p1",
          userId: "candidate-default-id",
          college: "NSUT Delhi",
          graduationYear: 2026,
          bio: "Passionate software engineer focused on system architectures and algorithms.",
          githubUrl: "https://github.com",
          linkedinUrl: "https://linkedin.com",
          yearsOfExp: 0.5,
          targetRole: "Software Engineer",
          targetSalary: "18-24 LPA",
          cgpa: 8.2,
          branch: "Computer Science",
          problemsSolved: 142,
          resumeScore: 89,
          targetCompany: "Google",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      companies: COMPANIES,
      codingQuestions: [
        {
          id: "two-sum",
          title: "Two Sum",
          difficulty: "Easy",
          category: "Arrays & Hashing",
          acceptance: "49.8%",
          content: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
          constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
            { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] }
          ],
          // Wraps the candidate's `twoSum` function with real driver code and
          // diffs actual vs. expected stdout via Judge0 — this is a genuine
          // graded verdict, not a simulated one. See judge0_service.ts /
          // coding_controller.ts. Extend this pattern to other questions by
          // adding a harness + testCases in the same shape.
          harness: {
            typescript: "__CANDIDATE_CODE__\n\nconst __testInput = __TEST_INPUT__;\nconst __result = twoSum(__testInput.nums, __testInput.target);\nconsole.log(JSON.stringify(__result));",
            javascript: "__CANDIDATE_CODE__\n\nconst __testInput = __TEST_INPUT__;\nconst __result = twoSum(__testInput.nums, __testInput.target);\nconsole.log(JSON.stringify(__result));"
          }
        },
        { id: "q1", title: "Two Sum", difficulty: "Easy", category: "Arrays & Hashing", acceptance: "49.5%", content: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.", constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9" },
        { id: "q2", title: "LRU Cache", difficulty: "Hard", category: "System Design / Core", acceptance: "41.2%", content: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.", constraints: "1 <= capacity <= 3000\n0 <= key <= 10^4\n0 <= value <= 10^5" },
        { id: "q3", title: "Merge k Sorted Lists", difficulty: "Hard", category: "Heaps / LinkedLists", acceptance: "48.8%", content: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.", constraints: "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500" },
        { id: "q4", title: "Valid Parentheses", difficulty: "Easy", category: "Stacks", acceptance: "41.0%", content: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", constraints: "1 <= s.length <= 10^4\ns consists of parentheses only" },
        { id: "q5", title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", acceptance: "32.4%", content: "Given a string s, return the longest palindromic substring in s.", constraints: "1 <= s.length <= 1000\ns consists of English letters and digits" }
      ],
      submissions: [],
      mockInterviews: [],
      calendarEvents: [],
      notes: [
        { id: "n1", title: "System Design - Rate Limiter", content: "Topics discussed: Token Bucket vs Leaky Bucket vs Sliding Window Log algorithms.\nToken bucket is best for bursty traffic because it permits instant execution of accumulated tokens. Leaky bucket smooths out requests at a constant flow rate. Redis sorted sets are perfect for implementing sliding window rate limiters.", folder: "System Design", updatedAt: new Date().toISOString().split('T')[0] },
        { id: "n2", title: "Dynamic Programming Patterns", content: "Main patterns:\n1. 0/1 Knapsack\n2. Unbounded Knapsack\n3. Fibonacci sequence\n4. Longest Common Subsequence (LCS)\n5. Shortest Path grid traversal\n\nOptimizing space complexity from O(N*M) to O(Min(N,M)) is highly appreciated during interviews.", folder: "DSA", updatedAt: new Date().toISOString().split('T')[0] }
      ],
      bookmarks: [],
      notifications: [
        { id: "notif_1", title: "Google Hiring Drive", content: "Applications for SDE-1 positions at Google India close this weekend. Make sure to finalize your resume analysis!", isRead: false, type: "Reminder" },
        { id: "notif_2", title: "Mock Interview Review", content: "Your Meta mock interview scorecard has been analyzed by Gemini. Average score: 92%!", isRead: true, type: "System" }
      ],
      xp: 2150,
      problemsSolved: 142
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

// Safely read DB
export const readDb = (): any => {
  try {
    initDb();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    if (parsed && parsed.companies && parsed.companies.length > 0 && !parsed.companies[0].package) {
      console.log("Auto-migrating fallback DB to include rich company structures.");
      parsed.companies = COMPANIES;
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    if (parsed && parsed.codingQuestions && !parsed.codingQuestions.find((q: any) => q.id === 'two-sum')) {
      console.log("Auto-migrating fallback DB to include the graded 'two-sum' coding question.");
      parsed.codingQuestions.unshift({
        id: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        category: "Arrays & Hashing",
        acceptance: "49.8%",
        content: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] }
        ],
        harness: {
          typescript: "__CANDIDATE_CODE__\n\nconst __testInput = __TEST_INPUT__;\nconst __result = twoSum(__testInput.nums, __testInput.target);\nconsole.log(JSON.stringify(__result));",
          javascript: "__CANDIDATE_CODE__\n\nconst __testInput = __TEST_INPUT__;\nconst __result = twoSum(__testInput.nums, __testInput.target);\nconsole.log(JSON.stringify(__result));"
        }
      });
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database fallback:", error);
    return {};
  }
};

// Safely write DB
export const writeDb = (data: any): void => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database fallback:", error);
  }
};
