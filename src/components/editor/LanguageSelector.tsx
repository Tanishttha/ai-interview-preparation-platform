interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' }
];

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded border px-3 py-2 text-sm">
      {languages.map((language) => (
        <option key={language.value} value={language.value}>{language.label}</option>
      ))}
    </select>
  );
}
