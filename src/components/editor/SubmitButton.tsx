interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

export default function SubmitButton({ loading, onClick }: SubmitButtonProps) {
  return (
    <button onClick={onClick} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={loading}>
      {loading ? 'Submitting…' : 'Submit'}
    </button>
  );
}
