export interface ProblemNote {
  id: string;
  problemId: string;
  content: string;
  updatedAt: string;
}

export async function loadNotes(problemId: string): Promise<ProblemNote | null> {
  return null;
}

export async function saveNote(problemId: string, content: string): Promise<ProblemNote> {
  return { id: `${problemId}-note`, problemId, content, updatedAt: new Date().toISOString() };
}
