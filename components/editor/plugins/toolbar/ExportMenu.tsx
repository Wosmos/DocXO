'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot } from 'lexical';
import { useState } from 'react';
import { Download, FileText, FileType, FileCode, FileDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface ExportMenuProps {
  documentTitle: string;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'document';
}

export default function ExportMenu({ documentTitle }: ExportMenuProps) {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const filename = sanitizeFilename(documentTitle);

  const getHtml = (): string => {
    let html = '';
    editor.getEditorState().read(() => {
      html = $generateHtmlFromNodes(editor);
    });
    return html;
  };

  const getPlainText = (): string => {
    let text = '';
    editor.getEditorState().read(() => {
      text = $getRoot().getTextContent();
    });
    return text;
  };

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html = getHtml();
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.cssText = 'width:515px;font-family:Arial,sans-serif;font-size:12pt;line-height:1.6;color:#000;';
      container.querySelectorAll('a').forEach((a) => {
        a.style.color = '#2563eb';
        a.style.textDecoration = 'underline';
      });
      document.body.appendChild(container);

      await doc.html(container, {
        callback: (d) => {
          d.save(`${filename}.pdf`);
          document.body.removeChild(container);
        },
        x: 40,
        y: 40,
        width: 515,
        windowWidth: 800,
      });
      toast.success('PDF exported');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('PDF export failed');
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  const exportDocx = async () => {
    setExporting(true);
    try {
      const htmlDocx = (await import('html-docx-js/dist/html-docx')).default;
      const { saveAs } = await import('file-saver');
      const html = getHtml();
      const wrapped = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:12pt;line-height:1.6;}a{color:#2563eb;text-decoration:underline;}</style></head><body>${html}</body></html>`;
      const blob = htmlDocx.asBlob(wrapped);
      saveAs(blob, `${filename}.docx`);
      toast.success('DOCX exported');
    } catch (error) {
      console.error('DOCX export failed:', error);
      toast.error('DOCX export failed');
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  const exportMarkdown = async () => {
    setExporting(true);
    try {
      const TurndownService = (await import('turndown')).default;
      const { saveAs } = await import('file-saver');
      const html = getHtml();
      const turndown = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });
      const markdown = turndown.turndown(html);
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, `${filename}.md`);
      toast.success('Markdown exported');
    } catch (error) {
      console.error('Markdown export failed:', error);
      toast.error('Markdown export failed');
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  const exportText = async () => {
    setExporting(true);
    try {
      const { saveAs } = await import('file-saver');
      const text = getPlainText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${filename}.txt`);
      toast.success('Text exported');
    } catch (error) {
      console.error('Text export failed:', error);
      toast.error('Text export failed');
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  const items = [
    { label: 'PDF', icon: FileText, action: exportPdf, desc: 'Export as PDF document' },
    { label: 'DOCX', icon: FileType, action: exportDocx, desc: 'Export as Word document' },
    { label: 'Markdown', icon: FileCode, action: exportMarkdown, desc: 'Export as Markdown' },
    { label: 'Plain Text', icon: FileDown, action: exportText, desc: 'Export as plain text' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="toolbar-item spaced"
          aria-label="Export document"
          title="Export Document"
          disabled={exporting}
        >
          <Download size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="end">
        {items.map(({ label, icon: Icon, action, desc }) => (
          <button
            key={label}
            onClick={action}
            disabled={exporting}
            className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <Icon size={16} className="shrink-0 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
