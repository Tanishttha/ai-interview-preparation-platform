import { SubmissionRecord, UserCodingSettings, ProblemStatus } from '../data/problems/types';

const SETTINGS_KEY = 'coding_practice_settings';
const NOTES_KEY_PREFIX = 'coding_practice_notes_';
const SUBMISSIONS_KEY = 'coding_practice_submissions';
const USER_STATE_KEY = 'coding_practice_user_states';

export const DEFAULT_SETTINGS: UserCodingSettings = {
  editorTheme: 'vs-dark',
  fontSize: 13,
  tabSize: 2,
  wordWrap: 'on',
  autoSave: true,
  preferredLanguage: 'typescript',
  minimap: false
};

export const loadUserSettings = (): UserCodingSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveUserSettings = (settings: UserCodingSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

export const loadProblemNotes = (problemId: string): string => {
  try {
    return localStorage.getItem(NOTES_KEY_PREFIX + problemId) || '';
  } catch {
    return '';
  }
};

export const saveProblemNotes = (problemId: string, notes: string) => {
  try {
    localStorage.setItem(NOTES_KEY_PREFIX + problemId, notes);
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
};

export const loadSubmissions = (problemId?: string): SubmissionRecord[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    const list: SubmissionRecord[] = raw ? JSON.parse(raw) : [];
    if (problemId) {
      return list.filter((s) => s.problemId === problemId);
    }
    return list;
  } catch {
    return [];
  }
};

export const saveSubmission = (submission: SubmissionRecord) => {
  try {
    const list = loadSubmissions();
    list.unshift(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save submission:', err);
  }
};

interface UserProblemState {
  status: ProblemStatus;
  isFavorite: boolean;
  needsRevision: boolean;
  lastAttemptedAt?: number;
}

export const loadUserProblemStates = (): Record<string, UserProblemState> => {
  try {
    const raw = localStorage.getItem(USER_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const updateUserProblemState = (
  problemId: string,
  update: Partial<UserProblemState>
) => {
  try {
    const states = loadUserProblemStates();
    states[problemId] = {
      status: 'Not Started',
      isFavorite: false,
      needsRevision: false,
      ...states[problemId],
      ...update
    };
    localStorage.setItem(USER_STATE_KEY, JSON.stringify(states));
  } catch (err) {
    console.error('Failed to update problem state:', err);
  }
};