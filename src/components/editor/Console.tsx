interface ConsoleProps {
  output: string;
}

export default function Console({ output }: ConsoleProps) {
  return (
    <pre className="h-40 overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-3 text-sm text-slate-100">
      {output || 'Run your code to see output here.'}
    </pre>
  );
}
