'use client';

import { useEffect, useState } from 'react';

const shortcuts = [
  { keys: 'Ctrl+B', action: 'Bold' },
  { keys: 'Ctrl+I', action: 'Italic' },
  { keys: 'Ctrl+U', action: 'Underline' },
  { keys: 'Ctrl+Z', action: 'Undo' },
  { keys: 'Ctrl+Y', action: 'Redo' },
  { keys: 'Ctrl+/', action: 'Shortcuts' },
];

export default function ShortcutsPlugin() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShow((prev) => !prev);
      }
      if (e.key === 'Escape') setShow(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShow(false)}>
      <div className="w-full max-w-sm rounded-xl border border-dark-300 bg-dark-200 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-semibold text-white">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {shortcuts.map(({ keys, action }) => (
            <div key={keys} className="flex items-center justify-between">
              <span className="text-sm text-blue-100/70">{action}</span>
              <kbd className="rounded bg-dark-400 px-2 py-1 text-xs font-mono text-blue-100">{keys}</kbd>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-blue-100/40">Press Esc or Ctrl+/ to close</p>
      </div>
    </div>
  );
}
