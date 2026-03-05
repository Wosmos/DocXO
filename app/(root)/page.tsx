import AddDocumentBtn from '@/components/AddDocumentBtn';
import DocumentSearch from '@/components/DocumentSearch';
import Header from '@/components/Header'
import Notifications from '@/components/Notifications';
import TemplateModal from '@/components/TemplateModal';
import { getDocuments } from '@/lib/actions/room.actions';
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Home = async () => {
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <UserButton />
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
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

          <DocumentSearch documents={roomDocuments.data} />
        </div>
      ): (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />
          <p className="text-sm text-blue-100/50">No documents yet. Create one to get started.</p>
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