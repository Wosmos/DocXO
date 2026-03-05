'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input } from './ui/input';
import { DeleteModal } from './DeleteModal';
import { dateConverter } from '@/lib/utils';
import { FileText, Search } from 'lucide-react';

const DocumentSearch = ({ documents }: { documents: any[] }) => {
  const [search, setSearch] = useState('');

  const filtered = documents.filter((doc: any) =>
    doc.metadata.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative w-full max-w-[730px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
        />
      </div>
      {filtered.length > 0 ? (
        <ul className="document-ul">
          {filtered.map(({ id, metadata, createdAt }: any) => (
            <li key={id} className="document-list-item">
              <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                <div className="hidden rounded-lg bg-muted p-2.5 sm:block">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="line-clamp-1 text-base font-medium text-foreground">{metadata.title}</p>
                  <p className="text-sm text-muted-foreground">Created {dateConverter(createdAt)}</p>
                </div>
              </Link>
              <DeleteModal roomId={id} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-center text-sm text-muted-foreground">No documents match your search.</p>
      )}
    </>
  );
};

export default DocumentSearch;
