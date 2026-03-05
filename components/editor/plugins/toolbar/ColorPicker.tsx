'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, $setSelection, type BaseSelection } from 'lexical';
import { useRef, useState, type ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSelectionStyle } from './useSelectionStyle';

interface ColorPickerProps {
  property: string;
  presetColors: string[];
  defaultValue: string;
  icon: ReactNode;
  title: string;
}

export default function ColorPicker({
  property,
  presetColors,
  defaultValue,
  icon,
  title,
}: ColorPickerProps) {
  const [editor] = useLexicalComposerContext();
  const currentColor = useSelectionStyle(property, defaultValue);
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState('');
  const savedSelection = useRef<BaseSelection | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      editor.getEditorState().read(() => {
        savedSelection.current = $getSelection()?.clone() ?? null;
      });
    }
    setOpen(isOpen);
  };

  const applyColor = (color: string) => {
    editor.update(() => {
      if (savedSelection.current) {
        $setSelection(savedSelection.current);
      }
      const selection = $getSelection();
      if (selection) {
        $patchStyleText(selection, { [property]: color === 'transparent' ? '' : color });
      }
    });
    setOpen(false);
    setHexInput('');
  };

  const handleHexSubmit = () => {
    const hex = hexInput.trim();
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
      applyColor(hex);
    }
  };

  const indicatorColor =
    currentColor && currentColor !== defaultValue && currentColor !== 'transparent'
      ? currentColor
      : property === 'color'
        ? 'hsl(var(--foreground))'
        : 'transparent';

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="toolbar-item spaced"
          aria-label={title}
          title={title}
        >
          <div className="flex flex-col items-center">
            {icon}
            <div
              className="color-indicator"
              style={{ backgroundColor: indicatorColor }}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3" align="start">
        <div className="color-picker-grid">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => applyColor(color)}
              className={`color-swatch ${currentColor === color ? 'active' : ''}`}
              style={{
                backgroundColor: color === 'transparent' ? 'transparent' : color,
                backgroundImage:
                  color === 'transparent'
                    ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                    : undefined,
                backgroundSize: color === 'transparent' ? '8px 8px' : undefined,
                backgroundPosition: color === 'transparent' ? '0 0, 4px 4px' : undefined,
              }}
              title={color === 'transparent' ? 'Remove' : color}
              aria-label={color === 'transparent' ? 'Remove color' : color}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-1.5 items-center">
          <input
            type="color"
            value={/^#[0-9A-Fa-f]{6}$/.test(hexInput) ? hexInput : /^#[0-9A-Fa-f]{6}$/.test(currentColor) ? currentColor : '#000000'}
            onChange={(e) => {
              setHexInput(e.target.value);
              applyColor(e.target.value);
            }}
            style={{ WebkitAppearance: 'none', appearance: 'none', padding: 0, border: 'none' }}
            className="h-7 w-7 shrink-0 cursor-pointer rounded border border-border bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0"
            title="Pick custom color"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleHexSubmit(); }}
            placeholder="#000000"
            className="h-7 flex-1 min-w-0 rounded-md border border-border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={handleHexSubmit}
            disabled={!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hexInput.trim())}
            className="h-7 shrink-0 rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
