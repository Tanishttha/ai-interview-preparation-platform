import { useEffect, useState } from 'react';

export function useEditor(problemId: string) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`editor:${problemId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.code) setCode(parsed.code);
      if (parsed.language) setLanguage(parsed.language);
      if (parsed.fontSize) setFontSize(parsed.fontSize);
      if (parsed.wordWrap !== undefined) setWordWrap(parsed.wordWrap);
    }
  }, [problemId]);

  useEffect(() => {
    localStorage.setItem(`editor:${problemId}`, JSON.stringify({ code, language, fontSize, wordWrap, cursorPosition, scrollPosition }));
  }, [code, cursorPosition, fontSize, language, problemId, scrollPosition, wordWrap]);

  return {
    code,
    setCode,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    wordWrap,
    setWordWrap,
    cursorPosition,
    setCursorPosition,
    scrollPosition,
    setScrollPosition
  };
}
