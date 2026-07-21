import { useEffect } from 'react';
import { useSubmission } from '../hooks/useSubmission';

export default function SubmissionHistory() {
  const { submissions, load } = useSubmission();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Submission History</h1>
      <div className="mt-4 space-y-2">
        {submissions.map((submission) => (
          <div key={submission.id} className="rounded border p-3 text-sm">
            <div className="flex justify-between">
              <span>{submission.problemId}</span>
              <span>{submission.status}</span>
            </div>
            <div className="mt-2 text-slate-500">{submission.language} • {submission.runtime} • {submission.memory}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
