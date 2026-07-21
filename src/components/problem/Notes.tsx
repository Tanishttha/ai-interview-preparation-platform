interface NotesProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Notes({ value, onChange }: NotesProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-48 w-full rounded border border-slate-200 bg-white p-3 text-sm"
      placeholder="Write your notes for this problem..."
    />
  );
}
