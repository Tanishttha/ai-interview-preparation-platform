import { useCallback, useState } from 'react';
import { ExecutionRequest, ExecutionResult, runCode } from '../services/execution';

export function useExecution() {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (request: ExecutionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await runCode(request);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Execution failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, execute };
}
