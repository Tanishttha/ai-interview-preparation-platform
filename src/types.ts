export interface Company {
  id: string;
  name: string;
  logo: string;
  role: string;
  package: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  location: string;
  batch: string;
  interviewRounds: string[];
  prepTime: string;
  successRate: number;
  overview: string;
  hiringProcess: string;
  eligibility: string;
  ctcBreakdown: string;
  skillsRequired: string[];
  importantTopics: string[];
  recentTrends: string;
  difficultyScore: number; // 0-100
  resources: { name: string; type: string; url: string }[];
}

export interface CodingProblem {
  id: string;
  slug?: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptanceRate: string;
  tags: string[];
  companies: string[];
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  hints: string[];
  optimalSolution: string;
  complexity: { time: string; space: string };
  editorial: string;
}

export interface InterviewExperience {
  id: string;
  companyName: string;
  role: string;
  author: string;
  date: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  verdict: 'Selected' | 'Rejected' | 'No Offer';
  rounds: { name: string; feedback: string; questions: string[] }[];
  tips: string[];
  likes: number;
  isBookmarked?: boolean;
}

export interface RoadmapItem {
  week: number;
  title: string;
  progress: number;
  tasks: { id: string; text: string; completed: boolean; category: string }[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  college: string;
  xp: number;
  problemsSolved: number;
  mockScore: number;
  type: 'global' | 'college' | 'friends';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: { current: number; total: number };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  matchScore: number;
  skillsNeeded: string[];
  applyUrl: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  updatedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
