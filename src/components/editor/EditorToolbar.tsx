import { Copy, RotateCcw, Maximize2, WrapText, Type } from 'lucide-react';

interface EditorToolbarProps {
  fontSize: number;
  onFontSizeChange: (delta: number) => void;
  wordWrap: boolean;
  onWordWrapToggle: () => void;
  onReset: () => void;
  onCopy: () => void;
}

export default function EditorToolbar({ fontSize, onFontSizeChange, wordWrap, onWordWrapToggle, onReset, onCopy }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 text-xs">
      <button onClick={() => onFontSizeChange(-1)} className="rounded border px-2 py-1">A-</button>
      <button onClick={() => onFontSizeChange(1)} className="rounded border px-2 py-1">A+</button>
      <button onClick={onWordWrapToggle} className="flex items-center gap-1 rounded border px-2 py-1">
        <WrapText size={14} /> {wordWrap ? 'Wrap On' : 'Wrap Off'}
      </button>
      <button onClick={onReset} className="flex items-center gap-1 rounded border px-2 py-1">
        <RotateCcw size={14} /> Reset
      </button>
      <button onClick={onCopy} className="flex items-center gap-1 rounded border px-2 py-1">
        <Copy size={14} /> Copy
      </button>
      <span className="ml-auto flex items-center gap-1 text-slate-500">
        <Type size={14} /> {fontSize}px
      </span>
      <button className="rounded border px-2 py-1">
        <Maximize2 size={14} />
      </button>
    </div>
  );
}
