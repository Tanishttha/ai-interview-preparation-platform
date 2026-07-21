interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface ExamplesProps {
  examples: Example[];
}

export default function Examples({ examples }: ExamplesProps) {
  return (
    <div className="space-y-3">
      {examples.map((example, index) => (
        <div key={`${example.input}-${index}`} className="rounded border bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Example {index + 1}</p>
          <p className="mt-2">Input: {example.input}</p>
          <p>Output: {example.output}</p>
          {example.explanation ? <p className="mt-2 text-slate-600">{example.explanation}</p> : null}
        </div>
      ))}
    </div>
  );
}
