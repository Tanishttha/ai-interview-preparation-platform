import { useCallback, useState } from 'react';
import { listSubmissions, saveSubmission, SubmissionRecord } from '../services/submissions';

export function useSubmission() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSubmissions(await listSubmissions());
    } finally {
      setLoading(false);
    }
  }, []);

  const submit = useCallback(async (record: SubmissionRecord) => {
    const saved = await saveSubmission(record);
    setSubmissions((prev) => [saved, ...prev]);
    return saved;
  }, []);

  return { submissions, loading, load, submit };
}
