interface RuntimeBadgeProps {
  runtime?: string;
}

export default function RuntimeBadge({ runtime }: RuntimeBadgeProps) {
  return <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{runtime || 'N/A'}</span>;
}
