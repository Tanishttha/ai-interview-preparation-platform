interface ExecutionResultProps {
  output: string;
}

export default function ExecutionResult({ output }: ExecutionResultProps) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
      {output || 'No output available.'}
    </div>
  );
}
