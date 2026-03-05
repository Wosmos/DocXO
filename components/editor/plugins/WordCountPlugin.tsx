'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useCallback, useEffect, useState } from 'react';

export default function WordCountPlugin() {
  const [editor] = useLexicalComposerContext();
  const [stats, setStats] = useState({ words: 0, chars: 0, readTime: '0 min' });

  const calculateStats = useCallback(() => {
    editor.getEditorState().read(() => {
      const text = $getRoot().getTextContent();
      const chars = text.length;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      setStats({
        words,
        chars,
        readTime: `${minutes} min read`,
      });
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      calculateStats();
    });
  }, [editor, calculateStats]);

  return (
    <div className="flex items-center gap-4 px-4 py-2 text-xs text-muted-foreground" role="status" aria-label="Document statistics">
      <span>{stats.words} words</span>
      <span className="hidden sm:inline">{stats.chars} characters</span>
      <span>{stats.readTime}</span>
    </div>
  );
}
