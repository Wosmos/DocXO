'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { deleteDocument } from '@/lib/actions/room.actions';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from './ui/button';

export const DeleteModal = ({ roomId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteDocumentHandler = async () => {
    setLoading(true);

    try {
      await deleteDocument(roomId);
      toast.success('Document deleted');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to delete document');
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className='size-9 text-muted-foreground hover:text-destructive transition-colors'>
          <Trash2 className="size-4" />
          <span className="sr-only">Delete document</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog'>
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="size-5 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete document</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-5 gap-2'>
          <DialogClose asChild>
            <Button variant="outline" className='w-full'>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant='destructive'
            onClick={deleteDocumentHandler}
            className='w-full'
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
