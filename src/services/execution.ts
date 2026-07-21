import { apiFetch } from '../lib/apiClient';

export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'timeout';

export interface ExecutionResult {
  status: ExecutionStatus;
  output: string;
  error?: string;
  runtime?: string;
  memory?: string;
  stdout?: string;
  stderr?: string;
}

export interface ExecutionRequest {
  language: string;
  code: string;
  input?: string;
  questionId?: string;
  mode?: 'run' | 'submit';
}

export async function runCode(request: ExecutionRequest): Promise<ExecutionResult> {
  const response = await apiFetch('/api/coding/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: request.questionId,
      code: request.code,
      language: request.language,
      mode: request.mode || 'run'
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error || 'Execution request failed.';
    throw new Error(message);
  }

  return {
    status: 'completed',
    output: payload.rawOutput || payload.feedback || payload.error || 'No output was produced.',
    stdout: payload.rawOutput || '',
    stderr: payload.stderr || payload.compileOutput || '',
    runtime: payload.runtime || '0ms',
    memory: payload.memory || '0KB',
    error: payload.error
  };
}
