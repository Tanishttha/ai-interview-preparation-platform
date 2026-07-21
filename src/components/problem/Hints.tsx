interface HintsProps {
  hints: string[];
}

export default function Hints({ hints }: HintsProps) {
  return (
    <div className="space-y-2">
      {hints.map((hint, index) => (
        <div key={`${hint}-${index}`} className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {hint}
        </div>
      ))}
    </div>
  );
}
