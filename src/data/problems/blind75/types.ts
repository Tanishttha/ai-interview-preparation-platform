export type Difficulty = "Easy" | "Medium" | "Hard";

export type OutputType = "number" | "string" | "boolean" | "array" | "matrix";

export type ValidatorType = "exact" | "unordered-array" | "multiple-answer" | "matrix" | "custom";

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation: string;
}

export interface ProblemDataset {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  tags: string[];
  companies: string[];
  estimatedTime: number;
  acceptanceRate: number;
  likes: number;
  dislikes: number;
  functionName: string;
  outputType: OutputType;
  validatorType: ValidatorType;
  problemStatement: string;
  constraints: string[];
  visibleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  starterCode: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
    typescript: string;
    c: string;
  };
  solutions: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
    typescript: string;
    c: string;
  };
  bruteForceApproach: string;
  bruteForceTimeComplexity: string;
  bruteForceSpaceComplexity: string;
  optimalApproach: string;
  optimalTimeComplexity: string;
  optimalSpaceComplexity: string;
  interviewHints: string[];
  commonMistakes: string[];
}
