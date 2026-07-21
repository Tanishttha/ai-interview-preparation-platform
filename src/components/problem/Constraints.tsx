interface ConstraintsProps {
  constraints: string[];
}

export default function Constraints({ constraints }: ConstraintsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Constraints</h3>
      <ul className="list-disc pl-5 text-sm text-slate-600">
        {constraints.map((constraint) => (
          <li key={constraint}>{constraint}</li>
        ))}
      </ul>
    </div>
  );
}
