export interface SubmissionRecord {
  id: string;
  problemId: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Internal Error';
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  feedback?: string;
}

const STORAGE_KEY = 'prepai:submissions';

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SubmissionRecord[];
  } catch {
    return [];
  }
}

export async function saveSubmission(record: SubmissionRecord): Promise<SubmissionRecord> {
  const existing = await listSubmissions();
  const next = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, 12);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return record;
}
