interface RunButtonProps {
  loading: boolean;
  onClick: () => void;
}

export default function RunButton({ loading, onClick }: RunButtonProps) {
  return (
    <button onClick={onClick} className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={loading}>
      {loading ? 'Running…' : 'Run'}
    </button>
  );
}
