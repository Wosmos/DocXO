'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
import { LayoutTemplate } from 'lucide-react';

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
          className="flex gap-1.5 rounded-lg transition-all duration-200"
        >
          <LayoutTemplate className="size-4" />
          <span className="hidden sm:block">Templates</span>
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
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:bg-accent disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-2xl">{template.icon}</span>
              <span className="text-sm font-medium text-foreground">{template.name}</span>
              <span className="text-xs text-muted-foreground">{template.description}</span>
              {creating === template.id && (
                <span className="text-xs text-primary">Creating...</span>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
