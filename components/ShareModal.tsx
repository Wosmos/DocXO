'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import { useSelf } from '@liveblocks/react/suspense';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import UserTypeSelector from './UserTypeSelector';
import Collaborator from './Collaborator';
import { updateDocumentAccess } from '@/lib/actions/room.actions';
import { toast } from 'sonner';
import { Share2 } from 'lucide-react';

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('viewer');

  const shareDocumentHandler = async () => {
    setLoading(true);

    try {
      await updateDocumentAccess({
        roomId,
        email,
        userType: userType as UserType,
        updatedBy: user.info,
      });
      toast.success(`Invited ${email} as ${userType}`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to share document');
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='flex h-9 gap-1.5 px-3'
          disabled={currentUserType !== 'editor'}
        >
          <Share2 className="size-4" />
          <span className='hidden sm:block'>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog'>
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
          <DialogDescription className='font-medium text-destructive'>
            Only add registered members
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor='email' className='mt-6 text-foreground'>
          Email address
        </Label>
        <div className='flex items-center gap-3'>
          <div className='flex flex-1 rounded-md bg-muted'>
            <Input
              id='email'
              placeholder='Enter email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='share-input'
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type='button'
            onClick={shareDocumentHandler}
            className='flex h-full gap-1 px-5'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Invite'}
          </Button>
        </div>

        <div className='my-2 space-y-2'>
          <ul className='flex flex-col'>
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
