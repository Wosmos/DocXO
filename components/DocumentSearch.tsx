'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from './ui/input';
import { DeleteModal } from './DeleteModal';
import { dateConverter } from '@/lib/utils';

const DocumentSearch = ({ documents }: { documents: any[] }) => {
  const [search, setSearch] = useState('');

  const filtered = documents.filter((doc: any) =>
    doc.metadata.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative w-full max-w-[730px]">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={18}
          height={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
        />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border-none bg-dark-300 pl-10 pr-4 text-sm text-white placeholder:text-blue-100/50 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
        />
      </div>
      {filtered.length > 0 ? (
        <ul className="document-ul">
          {filtered.map(({ id, metadata, createdAt }: any) => (
            <li key={id} className="document-list-item">
              <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                  <Image
                    src="/assets/icons/doc.svg"
                    alt="file"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="space-y-1">
                  <p className="line-clamp-1 text-lg">{metadata.title}</p>
                  <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                </div>
              </Link>
              <DeleteModal roomId={id} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-center text-sm text-blue-100/50">No documents match your search.</p>
      )}
    </>
  );
};

export default DocumentSearch;
