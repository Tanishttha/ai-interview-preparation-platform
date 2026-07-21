export interface LanguageOption {
  id: string;
  label: string;
  monacoLanguage: string;
  extension: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'typescript', label: 'TypeScript', monacoLanguage: 'typescript', extension: 'ts' },
  { id: 'javascript', label: 'JavaScript', monacoLanguage: 'javascript', extension: 'js' },
  { id: 'python', label: 'Python 3', monacoLanguage: 'python', extension: 'py' },
  { id: 'cpp', label: 'C++', monacoLanguage: 'cpp', extension: 'cpp' },
  { id: 'java', label: 'Java', monacoLanguage: 'java', extension: 'java' }
];