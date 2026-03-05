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
import { FONT_FAMILIES } from './constants';
import { useSelectionStyle } from './useSelectionStyle';

export default function FontFamilySelector() {
  const [editor] = useLexicalComposerContext();
  const currentFamily = useSelectionStyle('font-family', '');
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

  const applyFontFamily = (family: string) => {
    editor.update(() => {
      if (savedSelection.current) {
        $setSelection(savedSelection.current);
      }
      const selection = $getSelection();
      if (selection) {
        $patchStyleText(selection, { 'font-family': family || '' });
      }
    });
    setOpen(false);
  };

  const displayLabel =
    FONT_FAMILIES.find((f) => f.value === currentFamily)?.label ||
    (currentFamily ? currentFamily.split(',')[0].replace(/['"]/g, '') : 'Default');

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="toolbar-item toolbar-select"
          aria-label="Font family"
          title="Font Family"
        >
          <span className="text-xs max-w-[60px] md:max-w-[90px] truncate">{displayLabel}</span>
          <ChevronDown size={12} className="ml-1 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="max-h-64 overflow-auto">
          {FONT_FAMILIES.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => applyFontFamily(value)}
              style={value ? { fontFamily: value } : undefined}
              className={`flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                currentFamily === value ? 'bg-accent text-accent-foreground' : ''
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
