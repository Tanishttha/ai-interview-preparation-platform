import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  language: string;
  theme?: string;
  onChange?: (value: string | undefined) => void;
  onMount?: (editor: unknown) => void;
  options?: Record<string, unknown>;
}

export default function MonacoEditor({ value, language, theme = 'vs-dark', onChange, onMount, options }: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      onMount={onMount as never}
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        ...options
      }}
    />
  );
}
