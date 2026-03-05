/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import { $findMatchingParent } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Baseline,
  Highlighter,
  Type,
  PenLine,
} from 'lucide-react';
import FontSizeSelector from './toolbar/FontSizeSelector';
import FontFamilySelector from './toolbar/FontFamilySelector';
import HeadingSelector from './toolbar/HeadingSelector';
import ColorPicker from './toolbar/ColorPicker';
import ExportMenu from './toolbar/ExportMenu';
import { PRESET_COLORS, HIGHLIGHT_COLORS } from './toolbar/constants';

const LowPriority = 1;
const ICON_SIZE = 18;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin({ documentTitle = 'Untitled Document' }: { documentTitle?: string }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const activeBlock = useActiveBlock();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);

  const insertLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      setLinkUrl('');
      setLinkOpen(true);
    }
  };

  const confirmLink = () => {
    const url = linkUrl.trim();
    if (url && /^https?:\/\/.+/.test(url)) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      setLinkOpen(false);
      setLinkUrl('');
    }
  };

  const insertLinkMobile = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      const url = window.prompt('Enter URL (https://...)');
      if (url && /^https?:\/\/.+/.test(url.trim())) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
      }
    }
  };

  return (
    <>
      {/* ===== Desktop Toolbar ===== */}
      <div className="hidden md:block">
        <div className="toolbar" ref={toolbarRef} role="toolbar" aria-label="Formatting options">
          <button
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            className="toolbar-item spaced"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={ICON_SIZE} />
          </button>
          <button
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            className="toolbar-item"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={ICON_SIZE} />
          </button>
          <Divider />
          <FontFamilySelector />
          <FontSizeSelector />
          <Divider />
          <HeadingSelector activeBlock={activeBlock} />
          <Divider />
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
            aria-label="Bold"
            aria-pressed={isBold}
            title="Bold (Ctrl+B)"
          >
            <Bold size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
            aria-label="Italic"
            aria-pressed={isItalic}
            title="Italic (Ctrl+I)"
          >
            <Italic size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
            className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
            aria-label="Underline"
            aria-pressed={isUnderline}
            title="Underline (Ctrl+U)"
          >
            <Underline size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
            className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
            aria-label="Strikethrough"
            aria-pressed={isStrikethrough}
            title="Strikethrough"
          >
            <Strikethrough size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
            className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
            aria-label="Inline Code"
            title="Inline Code"
          >
            <Code size={ICON_SIZE} />
          </button>
          <Divider />
          <ColorPicker
            property="color"
            presetColors={PRESET_COLORS}
            defaultValue=""
            icon={<Baseline size={ICON_SIZE} />}
            title="Font Color"
          />
          <ColorPicker
            property="background-color"
            presetColors={HIGHLIGHT_COLORS}
            defaultValue="transparent"
            icon={<Highlighter size={ICON_SIZE} />}
            title="Highlight Color"
          />
          <Divider />
          <button
            onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
            className={'toolbar-item spaced ' + (activeBlock === 'bullet' ? 'active' : '')}
            aria-label="Bullet List"
            title="Bullet List"
          >
            <List size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
            className={'toolbar-item spaced ' + (activeBlock === 'number' ? 'active' : '')}
            aria-label="Numbered List"
            title="Numbered List"
          >
            <ListOrdered size={ICON_SIZE} />
          </button>
          <Popover open={linkOpen} onOpenChange={setLinkOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={insertLink}
                className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
                aria-label="Insert Link"
                title="Insert Link"
              >
                <Link size={ICON_SIZE} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') confirmLink(); }}
                  placeholder="https://example.com"
                  className="h-8 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                {linkUrl && !/^https?:\/\/.+/.test(linkUrl.trim()) && (
                  <p className="text-xs text-destructive">URL must start with http:// or https://</p>
                )}
                <button
                  onClick={confirmLink}
                  disabled={!linkUrl.trim() || !/^https?:\/\/.+/.test(linkUrl.trim())}
                  className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert Link
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <Divider />
          <button
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
            className="toolbar-item spaced"
            aria-label="Left Align"
            title="Left Align"
          >
            <AlignLeft size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
            className="toolbar-item spaced"
            aria-label="Center Align"
            title="Center Align"
          >
            <AlignCenter size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
            className="toolbar-item spaced"
            aria-label="Right Align"
            title="Right Align"
          >
            <AlignRight size={ICON_SIZE} />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
            className="toolbar-item"
            aria-label="Justify Align"
            title="Justify Align"
          >
            <AlignJustify size={ICON_SIZE} />
          </button>
          <Divider />
          <ExportMenu documentTitle={documentTitle} />
        </div>
      </div>

      {/* ===== Mobile Toolbar (grouped bottom bar) ===== */}
      <div className="block md:hidden">
        <div className="toolbar" role="toolbar" aria-label="Formatting options">
          <button
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            className="toolbar-item"
            aria-label="Undo"
          >
            <Undo2 size={20} />
          </button>
          <button
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            className="toolbar-item"
            aria-label="Redo"
          >
            <Redo2 size={20} />
          </button>

          {/* Text Style: font, size, heading, colors */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="toolbar-item" aria-label="Text styles" title="Styles">
                <Type size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-auto p-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <FontFamilySelector />
                  <FontSizeSelector />
                </div>
                <HeadingSelector activeBlock={activeBlock} />
                <div className="flex items-center gap-1">
                  <ColorPicker property="color" presetColors={PRESET_COLORS} defaultValue="" icon={<Baseline size={16} />} title="Font Color" />
                  <ColorPicker property="background-color" presetColors={HIGHLIGHT_COLORS} defaultValue="transparent" icon={<Highlighter size={16} />} title="Highlight" />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Format: bold, italic, underline, strikethrough, code */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={'toolbar-item ' + ((isBold || isItalic || isUnderline || isStrikethrough || isCode) ? 'active' : '')}
                aria-label="Text format"
                title="Format"
              >
                <PenLine size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-auto p-1">
              <div className="flex items-center gap-0.5">
                <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className={'toolbar-item ' + (isBold ? 'active' : '')} aria-label="Bold"><Bold size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className={'toolbar-item ' + (isItalic ? 'active' : '')} aria-label="Italic"><Italic size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className={'toolbar-item ' + (isUnderline ? 'active' : '')} aria-label="Underline"><Underline size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} className={'toolbar-item ' + (isStrikethrough ? 'active' : '')} aria-label="Strikethrough"><Strikethrough size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')} className={'toolbar-item ' + (isCode ? 'active' : '')} aria-label="Code"><Code size={18} /></button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Layout: align, lists, link */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="toolbar-item" aria-label="Layout" title="Align & Lists">
                <AlignLeft size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-auto p-1">
              <div className="flex items-center gap-0.5">
                <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} className="toolbar-item" aria-label="Left"><AlignLeft size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} className="toolbar-item" aria-label="Center"><AlignCenter size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} className="toolbar-item" aria-label="Right"><AlignRight size={18} /></button>
                <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} className="toolbar-item" aria-label="Justify"><AlignJustify size={18} /></button>
                <div className="w-px h-5 bg-border mx-0.5" />
                <button onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} className={'toolbar-item ' + (activeBlock === 'bullet' ? 'active' : '')} aria-label="Bullet List"><List size={18} /></button>
                <button onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} className={'toolbar-item ' + (activeBlock === 'number' ? 'active' : '')} aria-label="Numbered List"><ListOrdered size={18} /></button>
                <button onClick={insertLinkMobile} className={'toolbar-item ' + (isLink ? 'active' : '')} aria-label="Link"><Link size={18} /></button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Export */}
          <ExportMenu documentTitle={documentTitle} />
        </div>
      </div>
    </>
  );
}

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return editor.registerUpdateListener(onStoreChange);
    },
    [editor],
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === 'root'
          ? anchor
          : $findMatchingParent(anchor, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      if ($isListNode(element)) {
        const listType = element.getListType();
        return listType === 'bullet' ? 'bullet' : 'number';
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
