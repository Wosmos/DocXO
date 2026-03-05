'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import { $createParagraphNode, $getSelection, $setSelection, type BaseSelection } from 'lexical';
import { useRef, useState } from 'react';
import { ChevronDown, Pilcrow } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type BlockType = HeadingTagType | 'paragraph' | 'quote';

const BLOCK_OPTIONS: { value: BlockType; label: string; style?: string }[] = [
  { value: 'paragraph', label: 'Normal Text', style: 'text-sm' },
  { value: 'h1', label: 'Heading 1', style: 'text-xl font-bold' },
  { value: 'h2', label: 'Heading 2', style: 'text-lg font-semibold' },
  { value: 'h3', label: 'Heading 3', style: 'text-base font-semibold' },
  { value: 'h4', label: 'Heading 4', style: 'text-sm font-semibold' },
  { value: 'h5', label: 'Heading 5', style: 'text-xs font-semibold' },
  { value: 'h6', label: 'Heading 6', style: 'text-xs font-semibold text-muted-foreground' },
  { value: 'quote', label: 'Block Quote', style: 'text-sm italic text-muted-foreground' },
];

interface HeadingSelectorProps {
  activeBlock: string | null;
}

export default function HeadingSelector({ activeBlock }: HeadingSelectorProps) {
  const [editor] = useLexicalComposerContext();
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

  const applyBlock = (type: BlockType) => {
    editor.update(() => {
      if (savedSelection.current) {
        $setSelection(savedSelection.current);
      }
      const selection = $getSelection();
      if (!selection) return;

      if (activeBlock === type) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (type === 'paragraph') {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (type === 'quote') {
        $setBlocksType(selection, () => $createQuoteNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(type));
      }
    });
    setOpen(false);
  };

  const currentLabel =
    BLOCK_OPTIONS.find((o) => o.value === activeBlock)?.label ?? 'Normal Text';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="toolbar-item toolbar-select"
          aria-label="Block type"
          title="Block Type"
        >
          <Pilcrow size={14} className="mr-1 shrink-0 opacity-60" />
          <span className="text-xs max-w-[90px] truncate">{currentLabel}</span>
          <ChevronDown size={12} className="ml-1 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <div className="max-h-72 overflow-auto">
          {BLOCK_OPTIONS.map(({ value, label, style }) => (
            <button
              key={value}
              onClick={() => applyBlock(value)}
              className={`flex w-full items-center rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground ${
                activeBlock === value ? 'bg-accent text-accent-foreground' : ''
              } ${style ?? ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
