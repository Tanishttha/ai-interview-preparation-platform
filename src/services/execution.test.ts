import test from 'node:test';
import assert from 'node:assert/strict';
import { runCode } from './execution';

test('runCode forwards execution requests to the coding API and surfaces backend output', async () => {
  const originalFetch = global.fetch;
  const requests: Array<{ input: string; init?: RequestInit }> = [];

  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ input: String(input), init });
    return new Response(JSON.stringify({
      status: 'Accepted',
      runtime: '8 ms',
      memory: '1.20 MB',
      feedback: 'Program executed.',
      rawOutput: '42\n',
      stderr: '',
      compileOutput: ''
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }) as typeof fetch;

  try {
    const result = await runCode({
      language: 'python',
      code: 'print(42)',
      questionId: 'two-sum',
      mode: 'run'
    });

    assert.equal(result.status, 'completed');
    assert.equal(result.runtime, '8 ms');
    assert.match(result.output, /42/);
    assert.equal(requests[0].input, '/api/coding/submit');
  } finally {
    global.fetch = originalFetch;
  }
});
