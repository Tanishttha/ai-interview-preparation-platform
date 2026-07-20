// Judge0 language IDs (https://ce.judge0.com/languages) for the languages
// this app's editor offers.
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  typescript: 74, // TypeScript
  python: 71, // Python 3
  python3: 71,
  java: 62,
  c: 50,
  cpp: 54,
  'c++': 54,
  csharp: 51,
  'c#': 51,
  go: 60,
  ruby: 72,
  rust: 73,
  kotlin: 78,
  php: 68
};

export function getJudge0LanguageId(language: string): number | null {
  return LANGUAGE_IDS[(language || '').toLowerCase()] ?? null;
}

export interface Judge0Result {
  stdout: string;
  stderr: string;
  compileOutput: string;
  statusDescription: string; // e.g. "Accepted", "Compilation Error", "Runtime Error", "Time Limit Exceeded"
  timeMs: number | null;
  memoryKb: number | null;
}

/**
 * Submits one piece of source code + stdin to a Judge0 instance and waits
 * synchronously for the verdict. Configure via:
 *  - JUDGE0_API_URL (defaults to the free public CE instance)
 *  - JUDGE0_API_KEY + JUDGE0_API_HOST (only needed for RapidAPI-hosted Judge0)
 */
export async function runOnJudge0(params: {
  code: string;
  language: string;
  stdin?: string;
}): Promise<Judge0Result> {
  const languageId = getJudge0LanguageId(params.language);
  if (!languageId) {
    throw new Error(`Unsupported language for execution: "${params.language}".`);
  }

  const baseUrl = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
  }

  const submitRes = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true&fields=*`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: params.code,
      language_id: languageId,
      stdin: params.stdin || ''
    })
  });

  if (!submitRes.ok) {
    const text = await submitRes.text().catch(() => '');
    throw new Error(`Judge0 request failed (${submitRes.status}): ${text || submitRes.statusText}`);
  }

  const result: any = await submitRes.json();

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compileOutput: result.compile_output || '',
    statusDescription: result.status?.description || 'Unknown',
    timeMs: result.time ? Math.round(parseFloat(result.time) * 1000) : null,
    memoryKb: result.memory ?? null
  };
}
