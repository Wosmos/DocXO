'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { createDocument, updateDocument } from '@/lib/actions/room.actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

const templates = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start from scratch',
    icon: '📄',
    title: 'Untitled',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Agenda, attendees, action items',
    icon: '📋',
    title: 'Meeting Notes',
  },
  {
    id: 'project',
    name: 'Project Brief',
    description: 'Goals, scope, timeline, deliverables',
    icon: '🎯',
    title: 'Project Brief',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Ideas, pros/cons, next steps',
    icon: '💡',
    title: 'Brainstorm Session',
  },
  {
    id: 'weekly',
    name: 'Weekly Update',
    description: 'Progress, blockers, plans',
    icon: '📊',
    title: 'Weekly Update',
  },
  {
    id: 'todo',
    name: 'To-Do List',
    description: 'Tasks with priorities and deadlines',
    icon: '✅',
    title: 'To-Do List',
  },
];

const TemplateModal = ({ userId, email }: { userId: string; email: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);

  const createFromTemplate = async (template: typeof templates[0]) => {
    setCreating(template.id);
    try {
      const room = await createDocument({ userId, email });

      if (room) {
        if (template.id !== 'blank') {
          await updateDocument(room.id, template.title);
        }
        toast.success(`Created "${template.title}"`);
        setOpen(false);
        router.push(`/documents/${room.id}`);
      }
    } catch (error) {
      toast.error('Failed to create document');
    } finally {
      setCreating(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border border-dark-400 bg-dark-200 hover:bg-dark-300 flex gap-1 shadow-md hover:scale-105 transition-all duration-300 ease-in-out rounded-xl text-blue-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <p className="hidden sm:block">Templates</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog !max-w-[600px] sm:!min-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Start with a pre-built structure or a blank document
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => createFromTemplate(template)}
              disabled={creating !== null}
              className="flex flex-col items-center gap-2 rounded-lg border border-dark-400 bg-dark-300/50 p-4 text-center transition-all hover:border-blue-400 hover:bg-dark-300 disabled:opacity-50"
            >
              <span className="text-2xl">{template.icon}</span>
              <span className="text-sm font-medium text-white">{template.name}</span>
              <span className="text-xs text-blue-100/50">{template.description}</span>
              {creating === template.id && (
                <span className="text-xs text-blue-400">Creating...</span>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
