'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useEffect, useState } from 'react';

export function useSelectionStyle(property: string, defaultValue: string): string {
  const [editor] = useLexicalComposerContext();
  const [value, setValue] = useState(defaultValue);

  const updateValue = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setValue($getSelectionStyleValueForProperty(selection, property, defaultValue));
    }
  }, [property, defaultValue]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateValue();
      });
    });
  }, [editor, updateValue]);

  return value;
}
