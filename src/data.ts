import { reauthenticateWithRedirect } from 'firebase/auth';
import { Company, CodingProblem, InterviewExperience, LeaderboardEntry, Achievement, Job, Note, FAQItem } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    role: 'Software Engineer (L3/L4)',
    package: '32 - 45 LPA',
    difficulty: 'Hard',
    location: 'Bangalore, Hyderabad, Pune',
    batch: '2025 / 2026',
    interviewRounds: ['Online Assessment', 'Technical Round 1 (DS/Algo)', 'Technical Round 2 (System Design)', 'Technical Round 3 (Googliness)'],
    prepTime: '3 - 4 Months',
    successRate: 12,
    overview: 'Google LLC is an American multinational technology company focusing on artificial intelligence, search engine technology, online advertising, cloud computing, computer software, and quantum computing.',
    hiringProcess: 'Consists of a rigorous DSA-focused online assessment, followed by 3-4 rounds of algorithmic and architectural design problem-solving with a final behavioral fitment round.',
    eligibility: 'B.Tech/M.Tech/MCA with 70%+ or 7.0 CGPA, no active backlogs.',
    ctcBreakdown: 'Base: 22L, RSUs: 15L (vested over 4 years), Sign-on: 3L, Performance Bonus: 15%',
    skillsRequired: ['Advanced Data Structures', 'Graph Algorithms', 'Dynamic Programming', 'Scalability', 'Concurrency'],
    importantTopics: ['Segment Trees', 'Dijkstra & MST', 'DP on Trees', 'System Design Core Concepts'],
    recentTrends: 'Focusing heavily on search quality systems, real-time data ingestion pipelines, and ML/AI model integrations.',
    difficultyScore: 92,
    resources: [
      { name: 'Google Engineering Blog', type: 'Tech Articles', url: 'https://engineering.google' },
      { name: 'LeetCode Google Interview Card', type: 'Practice Prep', url: '#' },
      { name: 'System Design Primer', type: 'Architecture', url: '#' }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '💻',
    role: 'Software Engineer Intern / FTE',
    package: '28 - 40 LPA',
    difficulty: 'Medium',
    location: 'Hyderabad, Bangalore, Noida',
    batch: '2025 / 2026',
    interviewRounds: ['Coding Challenge', 'Technical Round 1 (Trees & Graphs)', 'Technical Round 2 (System Design)', 'AA (As Appropriate) Round'],
    prepTime: '2 - 3 Months',
    successRate: 18,
    overview: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and cloud services.',
    hiringProcess: 'Begins with an online technical test, followed by virtual on-sites emphasizing operating systems concepts, data structures, and structural system design.',
    eligibility: 'Open to all engineering streams with CGPA > 7.5.',
    ctcBreakdown: 'Base: 18L, Stock: 10L (over 4 years), Joining Bonus: 2.5L, Performance: 10-15%',
    skillsRequired: ['Binary Trees', 'System Design', 'Operating Systems', 'Object Oriented Programming'],
    importantTopics: ['Tree Traversals', 'Low Level Design (LLD)', 'Concurrency & Threading', 'Trie Datastructure'],
    recentTrends: 'Deepening integrations with OpenAI services, cloud containerizations, and multi-tenant SaaS services.',
    difficultyScore: 78,
    resources: [
      { name: 'Microsoft Technical Docs', type: 'Documentation', url: '#' },
      { name: 'OOPs Design Patterns', type: 'Architecture', url: '#' }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    role: 'Software Development Engineer I',
    package: '25 - 34 LPA',
    difficulty: 'Hard',
    location: 'Bangalore, Chennai, Delhi-NCR',
    batch: '2025 / 2026',
    interviewRounds: ['Online Assessment', 'Technical SDE-1 Round', 'Technical SDE-2 Round', 'Bar Raiser (Leadership Principles)'],
    prepTime: '2 - 3 Months',
    successRate: 15,
    overview: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
    hiringProcess: 'Very structured hiring process focused heavily on the 16 Leadership Principles combined with classic DSA and architectural problems.',
    eligibility: 'B.Tech/B.E/M.S in Computer Science or related fields.',
    ctcBreakdown: 'Base: 16.5L, Stocks: 10L, First year sign-on: 3.5L, Second year sign-on: 4L',
    skillsRequired: ['Trees & Graphs', 'System Design (HLD/LLD)', 'Object-Oriented Design', 'SQL'],
    importantTopics: ['LRU Cache', 'Topological Sort', 'Sliding Window', 'Design Patterns'],
    recentTrends: 'Focusing on distributed caching, high throughput logistics queues, and robust microservices.',
    difficultyScore: 85,
    resources: [
      { name: 'Amazon Leadership Principles Guide', type: 'Behavioral', url: '#' },
      { name: 'System Design Basics', type: 'Architecture', url: '#' }
    ]
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    logo: '🌌',
    role: 'Graduate Software Engineer',
    package: '30 - 42 LPA',
    difficulty: 'Hard',
    location: 'Bangalore (Remote-Friendly)',
    batch: '2025 / 2026',
    interviewRounds: ['Online Assessment', 'Technical Coding', 'System Design & Code Craft', 'Values Fitment'],
    prepTime: '3 Months',
    successRate: 10,
    overview: 'Atlassian Corporation is an Australian software company that develops products for software development, project management, and collaborative team processes.',
    hiringProcess: 'Starts with standard OA, followed by highly interactive live coding where code cleanliness, test cases, and OOP structure are scrutinized alongside algorithmic optimality.',
    eligibility: 'CS/IT streams with CGPA > 8.0 preferred.',
    ctcBreakdown: 'Base: 20L, Stocks: 15L, Cash Allowances: 5L',
    skillsRequired: ['Clean Code Principles', 'Object Oriented Design', 'Concurrency', 'Queue Systems'],
    importantTopics: ['Refactoring', 'Rate Limiters', 'Hash Tables', 'Design Patterns'],
    recentTrends: 'Collaboration platform scalability, real-time text sync, and AI-enabled JIRA integrations.',
    difficultyScore: 88,
    resources: [
      { name: 'Atlassian Values Blueprint', type: 'Core Values', url: '#' },
      { name: 'Refactoring Guru', type: 'Clean Code', url: '#' }
    ]
  },
  {
    id: 'uber',
    name: 'Uber',
    logo: '🚗',
    role: 'Software Engineer I',
    package: '35 - 50 LPA',
    difficulty: 'Hard',
    location: 'Bangalore, Hyderabad',
    batch: '2025 / 2026',
    interviewRounds: ['Coding Test', 'Algorithmic DSA Round', 'Concurrency/Machine Coding', 'System Design', 'HR fitment'],
    prepTime: '3 - 4 Months',
    successRate: 8,
    overview: 'Uber Technologies, Inc. is an American technology provider of ride-hailing, food delivery, and freight transportation systems.',
    hiringProcess: 'Among the hardest technical interviews. Incorporates standard algorithmic rounds along with a dedicated machine coding or multi-threaded logic round.',
    eligibility: 'Exceptional problem-solving skills, open branch, but solid CS foundations.',
    ctcBreakdown: 'Base: 26L, Stock: 18L, Sign-on: 4L, Bonus: 15%',
    skillsRequired: ['Advanced Graphs', 'Multi-threading', 'Distributed Systems', 'Low Latency Designs'],
    importantTopics: ['QuadTrees & Geohashing', 'Producer-Consumer Queues', 'Dijkstra / A*', 'Consistent Hashing'],
    recentTrends: 'High scale geofencing, dynamic surge pricing systems, and real-time navigation algorithms.',
    difficultyScore: 95,
    resources: [
      { name: 'Uber Engineering Blog', type: 'Tech Articles', url: '#' },
      { name: 'Designing Data-Intensive Applications', type: 'Systems', url: '#' }
    ]
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '🎬',
    role: 'Senior Software Engineer',
    package: '50 - 75 LPA',
    difficulty: 'Hard',
    location: 'Bangalore (Remote)',
    batch: '2025 / 2026',
    interviewRounds: ['Recruiter Call', 'Technical Screening', 'Panel Round 1 (System Design)', 'Panel Round 2 (Coding & Architecture)', 'Culture Memo Fitment'],
    prepTime: '4 Months',
    successRate: 5,
    overview: 'Netflix, Inc. is an American subscription video-on-demand over-the-top streaming service and production company.',
    hiringProcess: 'Very focused on independent execution capability, deep architectural insights, and high compliance with the Netflix Freedom & Responsibility culture deck.',
    eligibility: 'Extensive software experience or highly outstanding project history.',
    ctcBreakdown: 'Base: 45L, Stocks: 20L, Benefits: 5L',
    skillsRequired: ['High Scalability', 'Video Streaming Protocols', 'Microservice Fault Tolerance', 'Caching Strategies'],
    importantTopics: ['CDN Architecture', 'Chaos Engineering', 'Dynamic Bitrate Adaptation', 'Sharding'],
    recentTrends: 'Edge computing nodes, adaptive video encoding, and advanced AI recommendation layers.',
    difficultyScore: 98,
    resources: [
      { name: 'Netflix Tech Blog', type: 'Tech Articles', url: '#' },
      { name: 'Netflix Culture Deck', type: 'Culture', url: '#' }
    ]
  }
];

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptanceRate: '49.8%',
    tags: ['Arrays', 'Hash Table'],
    companies: ['Google', 'Microsoft', 'Amazon', 'TCS'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs, but that would be O(N^2). Can we do better?',
      'Is there a way we can remember the elements we have visited so far and search for the complement in O(1) time?'
    ],
    optimalSolution: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    complexity: {
      time: 'O(N) - We traverse the list containing N elements only once. Each lookup in the table costs only O(1) time.',
      space: 'O(N) - The extra space required depends on the number of items stored in the hash table, which stores at most N elements.'
    },
    editorial: '### Editorial\nThe problem can be solved in a single pass of the array. We maintain a Hash Map storing elements and their corresponding indices. While iterating, we compute `complement = target - nums[i]`. If the complement already exists in our map, we have found our pair and return their indices immediately. Otherwise, we add the current element to the map and proceed. This reduces the time complexity from O(N^2) of the nested loops to O(N).'
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    acceptanceRate: '72.3%',
    tags: ['Linked List'],
    companies: ['Amazon', 'Adobe', 'Atlassian', 'Microsoft'],
    description: 'Given the head of a singly linked list, reverse the list, and return its reversed list.',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ],
    hints: [
      'Keep track of three pointers: prev, curr, and next.',
      'Reverse the link of the current node to point to prev, then advance the pointers.'
    ],
    optimalSolution: `class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
    complexity: {
      time: 'O(N) - Where N is the list\'s length, we visit each node exactly once.',
      space: 'O(1) - We only reassign a constant number of pointers, so no extra memory is consumed.'
    },
    editorial: '### Editorial\nTo reverse a linked list, we can iterate through the list while modifying each node\'s `next` pointer to point to its predecessor instead of its successor. Since a node does not have a reference to its predecessor, we must store its predecessor in a pointer `prev` before changing the link. We also need to store the next node (`nextTemp = curr.next`) beforehand, otherwise we will lose access to the remaining list after changing `curr.next`.'
  },
  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    acceptanceRate: '32.1%',
    tags: ['Trees', 'Binary Search', 'DFS'],
    companies: ['Google', 'Microsoft', 'Uber', 'Amazon'],
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node\'s key.\n- The right subtree of a node contains only nodes with keys greater than the node\'s key.\n- Both the left and right subtrees must also be binary search trees.',
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1'
    ],
    examples: [
      {
        input: 'root = [2,1,3]',
        output: 'true'
      }
    ],
    hints: [
      'Can we define a helper function that takes a range [min, max] that the current node\'s value must fall within?',
      'Initially, the root node can take any value, so the range is [-Infinity, Infinity]. When going left, update the max boundary. When going right, update the min boundary.'
    ],
    optimalSolution: `class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.left = (left===undefined ? null : left)
        this.right = (right===undefined ? null : right)
    }
}

function isValidBST(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
        if (node === null) return true;
        if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
            return false;
        }
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
    return validate(root, null, null);
}`,
    complexity: {
      time: 'O(N) - Where N is the number of nodes. We traverse each node exactly once.',
      space: 'O(H) - Where H is the height of the tree, representing the recursion stack depth.'
    },
    editorial: '### Editorial\nSimply checking if a left child is smaller than parent and right child is larger than parent is INSUFFICIENT, because elements deeper in the left subtree might still exceed the root. Hence, we must propagate a valid value interval `(low, high)` down the recursion tree. For the left child, the upper bound becomes the parent\'s value. For the right child, the lower bound becomes the parent\'s value. If any node breaches these boundaries, the tree is invalid.'
  },
  {
    id: 'edit-distance',
    title: 'Edit Distance (Levenshtein)',
    difficulty: 'Hard',
    acceptanceRate: '52.4%',
    tags: ['DP', 'Strings'],
    companies: ['Google', 'Adobe', 'Flipkart', 'Goldman Sachs'],
    description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character',
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (replace \'h\' with \'r\')\nrorse -> rose (remove \'r\')\nrose -> ros (remove \'e\')'
      }
    ],
    hints: [
      'This can be framed as a recursion where at each step, if characters match we move forward, else we branch into three operations: insert, delete, replace.',
      'Since there are overlapping subproblems, use a 2D Dynamic Programming table to cache values.'
    ],
    optimalSolution: `function minDistance(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,    // Deletion
                    dp[i][j - 1] + 1,    // Insertion
                    dp[i - 1][j - 1] + 1 // Replacement
                );
            }
        }
    }
    return dp[m][n];
}`,
    complexity: {
      time: 'O(M * N) - Where M and N are lengths of word1 and word2 respectively, filling the DP grid of size (M+1) * (N+1).',
      space: 'O(M * N) - To store the DP matrix. This can be optimized further to O(Min(M, N)) space.'
    },
    editorial: '### Editorial\nLet `dp[i][j]` represent the min edit distance to convert the prefix `word1[0...i-1]` to `word2[0...j-1]`. If the last characters match, `dp[i][j] = dp[i-1][j-1]` with no extra operation. If they differ, we take the minimum of: deleting the character from `word1` (`dp[i-1][j] + 1`), inserting the character into `word1` (`dp[i][j-1] + 1`), or replacing the character (`dp[i-1][j-1] + 1`). Fill the base cases for converting any prefix to/from an empty string, and propagate.'
  }
];

export const INTERVIEW_EXPERIENCES: InterviewExperience[] = [
  {
    id: 'exp1',
    companyName: 'Google',
    role: 'SDE-1',
    author: 'Aman Sharma',
    date: 'June 2026',
    difficulty: 'Hard',
    verdict: 'Selected',
    rounds: [
      {
        name: 'Round 1: Online Assessment',
        feedback: 'Very tough. 2 questions on segment trees and advanced DP.',
        questions: ['Find max range sum with updates', 'Count paths in weighted grid with dynamic node blocks']
      },
      {
        name: 'Round 2: Technical interview (DS/Algo)',
        feedback: 'Focus was strictly on topological sort and cycle detection in complex graph networks.',
        questions: ['Alien Dictionary variation with duplicate letters and multi-priority outputs']
      }
    ],
    tips: ['Keep speaking your thoughts during the coding rounds.', 'Practice writing clean dry run state on a scratchpad.'],
    likes: 124,
    isBookmarked: false
  },
  {
    id: 'exp2',
    companyName: 'Microsoft',
    role: 'SWE FTE',
    author: 'Sneha Rao',
    date: 'May 2026',
    difficulty: 'Medium',
    verdict: 'Selected',
    rounds: [
      {
        name: 'Round 1: Coding Challenge',
        feedback: 'Relatively standard. Solved both in 45 minutes.',
        questions: ['Reverse nodes in k-groups', 'Group anagrams efficiently']
      },
      {
        name: 'Round 2: System Design',
        feedback: 'Designed a real-time collaborative doc. Emphasized Operational Transformation vs CRDTs.',
        questions: ['Design Microsoft Word real-time sync mechanism']
      }
    ],
    tips: ['Study Low Level Design (LLD) patterns thoroughly.', 'Revise index structures in database management systems.'],
    likes: 89,
    isBookmarked: true
  }
];

export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: 'Tanishttha Sehgal', avatar: '🥇', college: 'J.C. Bose University YMCA', xp: 9999999999999, problemsSolved: 542, mockScore: 94, type: 'global' },
  { rank: 2, name: 'Tanisha Roy', avatar: '🥈', college: 'IIT Bombay', xp: 4620, problemsSolved: 489, mockScore: 92, type: 'global' },
  { rank: 3, name: 'Hardik Gupta', avatar: '🥉', college: 'IIT Bombay', xp: 4410, problemsSolved: 470, mockScore: 89, type: 'global' },
  { rank: 4, name: 'Sarah Connor', avatar: '👩', college: 'IIT Bombay', xp: 4100, problemsSolved: 420, mockScore: 88, type: 'global' },
  { rank: 5, name: 'Pranav Shah', avatar: '👨', college: 'IIT Bombay', xp: 3950, problemsSolved: 405, mockScore: 86, type: 'global' },
  { rank: 12, name: 'You', avatar: '🚀', college: 'NSUT Delhi', xp: 2150, problemsSolved: 142, mockScore: 84, type: 'college' },
  { rank: 1, name: 'Mehak Singhal', avatar: '👩', college: 'NSUT Delhi', xp: 3200, problemsSolved: 280, mockScore: 88, type: 'college' },
  { rank: 2, name: 'Rohan Mehra', avatar: '👨', college: 'NSUT Delhi', xp: 2800, problemsSolved: 210, mockScore: 85, type: 'college' },
  { rank: 1, name: 'Rishabh Shah', avatar: '👨', college: 'My Circle', xp: 2400, problemsSolved: 180, mockScore: 86, type: 'friends' },
  { rank: 2, name: 'You', avatar: '🚀', college: 'My Circle', xp: 2150, problemsSolved: 142, mockScore: 84, type: 'friends' },
  { rank: 3, name: 'Aditi Jain', avatar: '👩', college: 'My Circle', xp: 1980, problemsSolved: 130, mockScore: 80, type: 'friends' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'streak', title: 'Daily Streak', description: 'Log in and solve a challenge 7 days in a row', icon: '🔥', progress: { current: 5, total: 7 } },
  { id: 'problems', title: 'Coding Ninja', description: 'Solve 100 coding problems on the editor', icon: '🥷', progress: { current: 142, total: 100 }, unlockedAt: '2026-07-15' },
  { id: 'hr', title: 'HR Master', description: 'Score above 85% in 5 simulated HR interviews', icon: '💬', progress: { current: 3, total: 5 } },
  { id: 'mock', title: 'Mock Champion', description: 'Complete a full company simulation with an overall score above 90%', icon: '🏆', unlockedAt: '2026-07-18' }
];

export const JOBS: Job[] = [
  { id: 'job1', title: 'Associate Software SDE-1', company: 'Google', logo: '🔍', location: 'Bangalore, India', salary: '32 - 38 LPA', matchScore: 94, skillsNeeded: ['Data Structures', 'C++', 'System Design'], applyUrl: '#' },
  { id: 'job2', title: 'Software Engineer FTE', company: 'Microsoft', logo: '💻', location: 'Hyderabad, India', salary: '26 - 32 LPA', matchScore: 88, skillsNeeded: ['C#', 'Algorithms', 'Azure'], applyUrl: '#' },
  { id: 'job3', title: 'SDE-1 Development', company: 'Amazon', logo: '📦', location: 'Chennai, India', salary: '22 - 28 LPA', matchScore: 81, skillsNeeded: ['Java', 'Spring Boot', 'SQL'], applyUrl: '#' }
];

export const FAQS = [
  {
    question: "Is PrepAI free to use?",
    answer:
      "Yes. You can start practicing for free, with premium features available for advanced interview preparation and AI-powered tools."
  },
  {
    question: "Which companies are supported?",
    answer:
      "Prepare for interviews at Google, Amazon, Microsoft, Apple, Meta, Adobe, Atlassian, Flipkart, Walmart Global Tech, TCS, Infosys, Accenture, and 30+ leading companies."
  },
  {
    question: "Does the AI provide real interview feedback?",
    answer:
      "Yes. PrepAI analyzes your answers, communication skills, confidence, filler words, speaking pace, and technical accuracy to deliver personalized feedback after every interview."
  },
  {
    question: "Can I practice coding interviews?",
    answer:
      "Absolutely. Practice DSA, SQL, JavaScript, Python, Java, C++, aptitude, and system design questions in a realistic interview environment."
  },
  {
    question: "Is my interview data secure?",
    answer:
      "Yes. Your interview recordings, resumes, and practice history remain private and are securely stored. We never share your personal interview data."
  },
  {
    question: "Can I upload my resume?",
    answer:
      "Yes. Upload your resume to receive an ATS score, detailed improvement suggestions, keyword optimization, and personalized interview questions based on your profile."
  },
  {
    question: "Does PrepAI help with HR and behavioral interviews?",
    answer:
      "Yes. Practice HR, behavioral, and leadership interviews with AI-powered coaching based on the STAR framework, along with communication and confidence analysis."
  },
  {
    question: "Can beginners use PrepAI?",
    answer:
      "Definitely. Whether you're a first-year student, a final-year placement aspirant, or an experienced professional, PrepAI creates a personalized roadmap based on your current skill level."
  }
];

export const INITIAL_NOTES: Note[] = [
  { id: 'note1', title: 'Dijkstra and MST tricks', content: 'Always use a Min Heap to store edges or nodes. In TypeScript, we can mock a priority queue using a simple array sorted on insert, or a binary tree search.', folder: 'Graphs', updatedAt: '2026-07-18' },
  { id: 'note2', title: 'System Design: Consistency Models', content: 'Strong vs Eventual consistency. Highly important to mention PACELC theorem during the Uber or Netflix system design rounds.', folder: 'System Design', updatedAt: '2026-07-19' }
];
