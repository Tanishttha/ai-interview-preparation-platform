interface EditorialProps {
  editorial: string;
}

export default function Editorial({ editorial }: EditorialProps) {
  return <div className="whitespace-pre-wrap text-sm text-slate-600">{editorial}</div>;
}
