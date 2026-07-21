import { CodingProblem } from '../../types';

interface ProblemDescriptionProps {
  problem: CodingProblem;
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{problem.title}</h2>
      <p className="whitespace-pre-wrap text-sm text-slate-600">{problem.description}</p>
    </div>
  );
}
