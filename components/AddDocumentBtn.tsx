'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });

      if(room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      type='submit'
      onClick={addDocumentHandler}
      className='border border-blue-400 hover:bg-blue-400 flex gap-1 shadow-md hover:scale-105 transition-all duration-300 ease-in-out rounded-xl'
    >
      <Image
        src='/assets/icons/add.svg'
        alt='add'
        width={24}
        height={24}
        className=''
      />
      <p className='hidden sm:block'>New document</p>
    </Button>
  );
}

export default AddDocumentBtn