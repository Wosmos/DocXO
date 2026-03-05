'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
      className='border border-blue-400 hover:bg-blue-400 flex gap-1 shadow-md hover:scale-105 transition-all duration-300 ease-in-out rounded-xl'
    >
      <Image
        src='/assets/icons/add.svg'
        alt='add'
        width={24}
        height={24}
      />
      <p className='hidden sm:block'>{creating ? 'Creating...' : 'New document'}</p>
    </Button>
  );
}

export default AddDocumentBtn
