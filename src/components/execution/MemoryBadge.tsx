interface MemoryBadgeProps {
  memory?: string;
}

export default function MemoryBadge({ memory }: MemoryBadgeProps) {
  return <span className="rounded bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">{memory || 'N/A'}</span>;
}
