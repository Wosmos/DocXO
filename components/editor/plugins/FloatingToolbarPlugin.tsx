import {
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, $createTextNode } from 'lexical';
import { OPEN_FLOATING_COMPOSER_COMMAND } from '@liveblocks/react-lexical';
import type { LexicalEditor, LexicalNode, BaseSelection } from 'lexical';
import { $getSelection, $isRangeSelection, $isTextNode, $setSelection } from 'lexical';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  RefreshCw,
  FileText,
  SpellCheck,
  Expand,
  Shrink,
  GraduationCap,
  SmilePlus,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const AI_ACTIONS = [
  { key: 'rewrite', label: 'Rewrite', icon: RefreshCw, desc: 'Clearer & professional' },
  { key: 'grammar', label: 'Fix Grammar', icon: SpellCheck, desc: 'Fix errors' },
  { key: 'summarize', label: 'Summarize', icon: FileText, desc: 'Condense text' },
  { key: 'expand', label: 'Expand', icon: Expand, desc: 'Add more detail' },
  { key: 'shorten', label: 'Shorten', icon: Shrink, desc: 'Make concise' },
  { key: 'formal', label: 'Formal', icon: GraduationCap, desc: 'Professional tone' },
  { key: 'casual', label: 'Casual', icon: SmilePlus, desc: 'Friendly tone' },
] as const;

export default function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    editor.registerUpdateListener(({ tags }) => {
      return editor.getEditorState().read(() => {
        if (tags.has('collaboration')) return;

        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setRange(null);
          return;
        }

        const { anchor, focus } = selection;

        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset,
        );

        setRange(range);
      });
    });
  }, [editor]);

  if (range === null) return null;

  return (
    <Toolbar range={range} onRangeChange={setRange} container={document.body} />
  );
}

function Toolbar({
  range,
  onRangeChange,
  container,
}: {
  range: Range;
  onRangeChange: (range: Range | null) => void;
  container: HTMLElement;
}) {
  const [editor] = useLexicalComposerContext();
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const savedSelection = useRef<BaseSelection | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const padding = 20;

  const {
    refs: { setReference, setFloating },
    strategy,
    x,
    y,
  } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [
      flip({ padding, crossAxis: false }),
      offset(10),
      hide({ padding }),
      shift({ padding, limiter: limitShift() }),
      size({ padding }),
    ],
    whileElementsMounted: (...args) => {
      return autoUpdate(...args, {
        animationFrame: true,
      });
    },
  });

  useLayoutEffect(() => {
    setReference({
      getBoundingClientRect: () => range.getBoundingClientRect(),
    });
  }, [setReference, range]);

  const getSelectedText = useCallback((): string => {
    let text = '';
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        text = selection.getTextContent();
      }
    });
    return text;
  }, [editor]);

  const handleAiAction = useCallback(async (action: string) => {
    const text = getSelectedText();
    if (!text.trim()) {
      toast.error('No text selected');
      return;
    }

    // Save the current selection before async work
    editor.getEditorState().read(() => {
      savedSelection.current = $getSelection()?.clone() ?? null;
    });

    setLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'AI request failed');
      }

      const data = await res.json();
      setAiResult(data.result);
      setShowAiMenu(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'AI request failed';
      toast.error(message);
      setLoading(false);
    }
  }, [editor, getSelectedText]);

  const acceptResult = useCallback(() => {
    if (!aiResult) return;

    editor.update(() => {
      if (savedSelection.current) {
        $setSelection(savedSelection.current);
      }
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.removeText();
        $insertNodes([$createTextNode(aiResult)]);
      }
    });

    setAiResult(null);
    setLoading(false);
    onRangeChange(null);
    toast.success('Text replaced');
  }, [editor, aiResult, onRangeChange]);

  const rejectResult = useCallback(() => {
    setAiResult(null);
    setLoading(false);
  }, []);

  // Close AI menu on outside click
  useEffect(() => {
    if (!showAiMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAiMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAiMenu]);

  return createPortal(
    <div
      ref={setFloating}
      style={{
        position: strategy,
        top: 0,
        left: 0,
        transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
        minWidth: 'max-content',
      }}
    >
      {/* AI Result Preview */}
      {aiResult && (
        <div className="ai-result-card">
          <div className="ai-result-text">{aiResult}</div>
          <div className="ai-result-actions">
            <button onClick={acceptResult} className="ai-result-btn ai-result-accept" title="Accept">
              <Check size={14} /> Accept
            </button>
            <button onClick={rejectResult} className="ai-result-btn ai-result-reject" title="Discard">
              <X size={14} /> Discard
            </button>
          </div>
        </div>
      )}

      <div className="floating-toolbar" role="toolbar" aria-label="Text actions" ref={menuRef}>
        {/* Comment button */}
        <button
          onClick={() => {
            const isOpen = editor.dispatchCommand(
              OPEN_FLOATING_COMPOSER_COMMAND,
              undefined,
            );
            if (isOpen) {
              onRangeChange(null);
            }
          }}
          className="floating-toolbar-btn"
          aria-label="Add comment"
          title="Add comment"
        >
          <Image
            src="/assets/icons/comment.svg"
            alt="comment"
            width={24}
            height={24}
          />
        </button>

        {/* Divider */}
        <div className="floating-toolbar-divider" />

        {/* AI button */}
        <button
          onClick={() => setShowAiMenu(!showAiMenu)}
          className={`floating-toolbar-btn ${showAiMenu ? 'active' : ''}`}
          aria-label="AI actions"
          title="AI Actions"
          disabled={loading}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        </button>

        {/* AI dropdown menu */}
        {showAiMenu && !loading && (
          <div className="ai-menu">
            {AI_ACTIONS.map(({ key, label, icon: Icon, desc }) => (
              <button
                key={key}
                onClick={() => handleAiAction(key)}
                className="ai-menu-item"
              >
                <Icon size={14} className="ai-menu-icon" />
                <div>
                  <div className="ai-menu-label">{label}</div>
                  <div className="ai-menu-desc">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    container,
  );
}

/**
 * MIT License
 * Copyright (c) Meta Platforms, Inc. and affiliates.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function getDOMTextNode(element: Node | null): Text | null {
  let node = element;

  while (node !== null) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node as Text;
    }

    node = node.firstChild;
  }

  return null;
}

function getDOMIndexWithinParent(node: ChildNode): [ParentNode, number] {
  const parent = node.parentNode;

  if (parent === null) {
    throw new Error('Should never happen');
  }

  return [parent, Array.from(parent.childNodes).indexOf(node)];
}

/**
 * Creates a selection range for the DOM.
 * @param editor - The lexical editor.
 * @param anchorNode - The anchor node of a selection.
 * @param _anchorOffset - The amount of space offset from the anchor to the focus.
 * @param focusNode - The current focus.
 * @param _focusOffset - The amount of space offset from the focus to the anchor.
 * @returns The range of selection for the DOM that was created.
 */
export function createDOMRange(
  editor: LexicalEditor,
  anchorNode: LexicalNode,
  _anchorOffset: number,
  focusNode: LexicalNode,
  _focusOffset: number,
): Range | null {
  const anchorKey = anchorNode.getKey();
  const focusKey = focusNode.getKey();
  const range = document.createRange();
  let anchorDOM: Node | Text | null = editor.getElementByKey(anchorKey);
  let focusDOM: Node | Text | null = editor.getElementByKey(focusKey);
  let anchorOffset = _anchorOffset;
  let focusOffset = _focusOffset;

  if ($isTextNode(anchorNode)) {
    anchorDOM = getDOMTextNode(anchorDOM);
  }

  if ($isTextNode(focusNode)) {
    focusDOM = getDOMTextNode(focusDOM);
  }

  if (
    anchorNode === undefined ||
    focusNode === undefined ||
    anchorDOM === null ||
    focusDOM === null
  ) {
    return null;
  }

  if (anchorDOM.nodeName === 'BR') {
    [anchorDOM, anchorOffset] = getDOMIndexWithinParent(anchorDOM as ChildNode);
  }

  if (focusDOM.nodeName === 'BR') {
    [focusDOM, focusOffset] = getDOMIndexWithinParent(focusDOM as ChildNode);
  }

  const firstChild = anchorDOM.firstChild;

  if (
    anchorDOM === focusDOM &&
    firstChild !== null &&
    firstChild.nodeName === 'BR' &&
    anchorOffset === 0 &&
    focusOffset === 0
  ) {
    focusOffset = 1;
  }

  try {
    range.setStart(anchorDOM, anchorOffset);
    range.setEnd(focusDOM, focusOffset);
  } catch (e) {
    return null;
  }

  if (
    range.collapsed &&
    (anchorOffset !== focusOffset || anchorKey !== focusKey)
  ) {
    // Range is backwards, we need to reverse it
    range.setStart(focusDOM, focusOffset);
    range.setEnd(anchorDOM, anchorOffset);
  }

  return range;
}