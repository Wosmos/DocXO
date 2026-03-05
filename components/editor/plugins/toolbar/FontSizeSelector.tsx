'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, $setSelection, type BaseSelection } from 'lexical';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FONT_SIZES } from './constants';
import { useSelectionStyle } from './useSelectionStyle';

export default function FontSizeSelector() {
  const [editor] = useLexicalComposerContext();
  const currentSize = useSelectionStyle('font-size', '16px');
  const [open, setOpen] = useState(false);
  const savedSelection = useRef<BaseSelection | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      editor.getEditorState().read(() => {
        savedSelection.current = $getSelection()?.clone() ?? null;
      });
    }
    setOpen(isOpen);
  };

  const applyFontSize = (size: string) => {
    editor.update(() => {
      if (savedSelection.current) {
        $setSelection(savedSelection.current);
      }
      const selection = $getSelection();
      if (selection) {
        $patchStyleText(selection, { 'font-size': size });
      }
    });
    setOpen(false);
  };

  const displayValue = currentSize.replace('px', '') || '16';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="toolbar-item toolbar-select"
          aria-label="Font size"
          title="Font Size"
        >
          <span className="text-xs min-w-[20px] text-center">{displayValue}</span>
          <ChevronDown size={12} className="ml-1 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-24 p-1" align="start">
        <div className="max-h-64 overflow-auto">
          {FONT_SIZES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => applyFontSize(value)}
              className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                currentSize === value ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
