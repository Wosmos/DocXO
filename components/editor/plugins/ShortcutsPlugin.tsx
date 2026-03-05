'use client';

import { useEffect, useRef, useState } from 'react';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
const mod = isMac ? '⌘' : 'Ctrl';

const shortcuts = [
  { keys: `${mod}+B`, action: 'Bold' },
  { keys: `${mod}+I`, action: 'Italic' },
  { keys: `${mod}+U`, action: 'Underline' },
  { keys: `${mod}+Z`, action: 'Undo' },
  { keys: isMac ? '⌘+Shift+Z' : 'Ctrl+Y', action: 'Redo' },
  { keys: `${mod}+/`, action: 'Shortcuts' },
];

export default function ShortcutsPlugin() {
  const [show, setShow] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShow((prev) => !prev);
      }
      if (e.key === 'Escape') setShow(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (show && closeRef.current) {
      closeRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setShow(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h3>
          <button
            ref={closeRef}
            onClick={() => setShow(false)}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(({ keys, action }) => (
            <div key={keys} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{action}</span>
              <kbd className="rounded-md bg-muted px-2 py-1 text-xs font-mono text-foreground border border-border">{keys}</kbd>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground/60">Press Esc or {mod}+/ to close</p>
      </div>
    </div>
  );
}
