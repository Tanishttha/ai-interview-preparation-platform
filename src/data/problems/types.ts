export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Needs Revision';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface LanguageSolution {
  language: string;
  starterCode: string;
  optimalCode?: string;
  bruteForceCode?: string;
}

export interface RelatedProblemRef {
  id: string;
  title: string;
  difficulty: Difficulty;
}

export interface Blind75Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  companies: string[];
  tags: string[];
  acceptanceRate: string;
  likes: number;
  dislikes: number;
  estimatedTimeMinutes: number;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  hints: string[];
  editorial: string;
  explanation: string;
  timeComplexity: {
    bruteForce?: string;
    optimal: string;
  };
  spaceComplexity: {
    bruteForce?: string;
    optimal: string;
  };
  solutions: Record<string, LanguageSolution>;
  testCases: TestCase[];
  relatedProblems?: RelatedProblemRef[];
  isBlind75?: boolean;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  timestamp: number;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  runtime: string;
  memory: string;
  passedTests: number;
  totalTests: number;
  code: string;
}

export interface UserCodingSettings {
  editorTheme: 'vs-dark' | 'light';
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  autoSave: boolean;
  preferredLanguage: string;
  minimap: boolean;
}