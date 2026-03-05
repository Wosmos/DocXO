'use client';

import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { updateDocument } from '@/lib/actions/room.actions';
import { toast } from 'sonner';
import Loader from './Loader';
import ShareModal from './ShareModal';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import { Pencil } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
  const { isSignedIn } = useAuth();
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const savingRef = useRef(false);

  const saveTitle = useCallback(async () => {
    if (savingRef.current || documentTitle === roomMetadata.title) return;
    savingRef.current = true;
    setLoading(true);
    try {
      await updateDocument(roomId, documentTitle);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save title');
    } finally {
      setLoading(false);
      savingRef.current = false;
    }
  }, [roomId, documentTitle, roomMetadata.title]);

  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
      await saveTitle();
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        saveTitle();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [saveTitle])

  useEffect(() => {
    if(editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing])


  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        {() => (<div className="collaborative-room">
          <Header>
            <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
              {editing && !loading ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {currentUserType === 'editor' && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Edit title"
                >
                  <Pencil className="size-4" />
                </button>
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-muted-foreground">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />

              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />

              <ThemeToggle />

              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton />
              )}
            </div>
          </Header>
        <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>)}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom
