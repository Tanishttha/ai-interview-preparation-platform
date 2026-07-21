export interface ProgressSummary {
  solved: number;
  attempted: number;
  successRate: number;
  totalSubmissions: number;
  latestSubmission: string | null;
  lastSolvedDate: string | null;
  bookmarks: number;
  recentlyViewed: string[];
  recentlySolved: string[];
  dailyStreak: number;
  languageUsage: Record<string, number>;
}

export async function loadProgress(): Promise<ProgressSummary> {
  return {
    solved: 0,
    attempted: 0,
    successRate: 0,
    totalSubmissions: 0,
    latestSubmission: null,
    lastSolvedDate: null,
    bookmarks: 0,
    recentlyViewed: [],
    recentlySolved: [],
    dailyStreak: 0,
    languageUsage: {}
  };
}
