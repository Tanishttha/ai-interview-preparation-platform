import { useCallback, useState } from 'react';
import { CodingProblem } from '../types';
import { fetchProblemBySlug, fetchProblems } from '../services/problems';

export function useProblem(slug?: string) {
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProblems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProblems();
      setProblems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProblem = useCallback(async (selectedSlug: string) => {
    setLoading(true);
    try {
      const data = await fetchProblemBySlug(selectedSlug);
      setProblem(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { problem, problems, loading, loadProblems, loadProblem };
}
