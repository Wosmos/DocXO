'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const addDocumentHandler = async () => {
    setCreating(true);
    try {
      const room = await createDocument({ userId, email });

      if(room) {
        toast.success('Document created');
        router.push(`/documents/${room.id}`);
      }
    } catch (error) {
      toast.error('Failed to create document');
    } finally {
      setCreating(false);
    }
  }

  return (
    <Button
      type='submit'
      onClick={addDocumentHandler}
      disabled={creating}
      className='flex gap-1.5 rounded-lg transition-all duration-200'
    >
      <Plus className="size-4" />
      <span className='hidden sm:block'>{creating ? 'Creating...' : 'New document'}</span>
    </Button>
  );
}

export default AddDocumentBtn
