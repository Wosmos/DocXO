import AddDocumentBtn from '@/components/AddDocumentBtn';
import DocumentSearch from '@/components/DocumentSearch';
import Header from '@/components/Header'
import Notifications from '@/components/Notifications';
import TemplateModal from '@/components/TemplateModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getDocuments } from '@/lib/actions/room.actions';
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import { FileText } from 'lucide-react';
import { redirect } from 'next/navigation';

const Home = async () => {
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/');

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

  return (
    <main className="home-container" id="main-content">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-3">
          <Notifications />
          <ThemeToggle />
          <UserButton />
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold text-foreground">All documents</h3>
            <div className="flex items-center gap-2">
              <TemplateModal
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
              <AddDocumentBtn
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>
          </div>

          <DocumentSearch
              documents={roomDocuments.data}
              currentUserEmail={clerkUser.emailAddresses[0].emailAddress}
            />
        </div>
      ): (
        <div className="document-list-empty">
          <FileText className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No documents yet. Create one to get started.</p>
          <div className="flex items-center gap-2">
            <TemplateModal
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default Home
