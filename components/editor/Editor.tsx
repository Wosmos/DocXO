'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';

import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from '@liveblocks/react-lexical'
import Loader from '../Loader';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin'
import WordCountPlugin from './plugins/WordCountPlugin'
import ShortcutsPlugin from './plugins/ShortcutsPlugin'
import { useThreads } from '@liveblocks/react/suspense';
import Comments from '../Comments';
import { DeleteModal } from '../DeleteModal';

function Placeholder() {
  return <div className="editor-placeholder">Start writing...</div>;
}

class EditorErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Editor error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <p className="text-sm text-muted-foreground">Something went wrong with the editor.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Editor({ roomId, currentUserType, documentTitle = 'Untitled Document' }: { roomId: string, currentUserType: UserType, documentTitle?: string }) {
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin documentTitle={documentTitle} />
          {currentUserType === 'editor' && <DeleteModal roomId={roomId} />}
        </div>

        <EditorErrorBoundary>
          <div className="editor-wrapper flex flex-col items-center justify-start pb-24 md:pb-0">
            {status === 'not-loaded' || status === 'loading' ? <Loader /> : (
              <div className="flex flex-col min-h-[calc(100vh-200px)] mb-5 w-full max-w-[800px] shadow-sm border border-border rounded-b-lg lg:mb-10">
                <div className="editor-inner flex-1 relative">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="editor-input h-full" />
                    }
                    placeholder={<Placeholder />}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  {currentUserType === 'editor' && <FloatingToolbarPlugin />}
                  <ListPlugin />
                  <LinkPlugin />
                  <ClickableLinkPlugin />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                </div>
                <div className="border-t border-border bg-card/80 backdrop-blur-sm rounded-b-lg">
                  <WordCountPlugin />
                </div>
              </div>
            )}

            <LiveblocksPlugin>
              <FloatingComposer className="w-[350px]" />
              <FloatingThreads threads={threads} />
              <Comments />
            </LiveblocksPlugin>
            <ShortcutsPlugin />
          </div>
        </EditorErrorBoundary>
      </div>
    </LexicalComposer>
  );
}
