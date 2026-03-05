import Image from 'next/image';
import React, { useState } from 'react'
import UserTypeSelector from './UserTypeSelector';
import { Button } from './ui/button';
import { removeCollaborator, updateDocumentAccess } from '@/lib/actions/room.actions';
import { toast } from 'sonner';

const Collaborator = ({ roomId, creatorId, collaborator, email, user }: CollaboratorProps) => {
  const [userType, setUserType] = useState(collaborator.userType || 'viewer');
  const [loading, setLoading] = useState(false);

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);
    try {
      await updateDocumentAccess({
        roomId,
        email,
        userType: type as UserType,
        updatedBy: user
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update access');
    } finally {
      setLoading(false);
    }
  }

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);
    try {
      await removeCollaborator({ roomId, email });
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove collaborator');
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="flex items-center justify-between gap-2 py-3 border-b border-border last:border-0">
      <div className="flex gap-3 items-center">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-medium leading-5 text-foreground">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-muted-foreground">
              {loading && 'updating...'}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm font-medium text-muted-foreground">Owner</p>
      ): (
        <div className="flex items-center gap-1">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
            className="remove-btn text-sm"
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  )
}

export default Collaborator
