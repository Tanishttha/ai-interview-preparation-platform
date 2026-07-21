import { climbingStairs, houseRobber } from '../data/problems/blind75';
import { CodingProblem } from '../types';

const DATASET_PROBLEMS = [climbingStairs, houseRobber].map((problem) => ({
  id: problem.id,
  slug: problem.slug,
  title: problem.title,
  difficulty: problem.difficulty as CodingProblem['difficulty'],
  acceptanceRate: `${problem.acceptanceRate}%`,
  tags: problem.tags,
  companies: problem.companies,
  description: problem.problemStatement,
  constraints: problem.constraints,
  examples: problem.visibleTestCases.map((testCase) => ({
    input: testCase.input,
    output: testCase.expectedOutput,
    explanation: testCase.explanation
  })),
  hints: problem.interviewHints,
  optimalSolution: problem.solutions.typescript,
  complexity: {
    time: problem.optimalTimeComplexity,
    space: problem.optimalSpaceComplexity
  },
  editorial: problem.optimalApproach
}));

export async function fetchProblems(): Promise<CodingProblem[]> {
  console.log('[Problems] dataset length', DATASET_PROBLEMS.length);
  return DATASET_PROBLEMS;
}

export async function fetchProblemBySlug(slug: string): Promise<CodingProblem | null> {
  console.log('[Problems] selected slug', slug);
  const foundProblem = DATASET_PROBLEMS.find((problem) => problem.slug === slug || problem.id === slug) ?? null;
  console.log('[Problems] found problem', foundProblem?.slug ?? null);
  return foundProblem;
}
