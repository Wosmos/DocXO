'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DeleteModal } from './DeleteModal';
import { dateConverter } from '@/lib/utils';
import {
  FileText,
  Search,
  LayoutGrid,
  LayoutList,
  GripVertical,
  Users,
  Clock,
  User,
  Share2,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ViewMode = 'list' | 'grid';

interface DocumentSearchProps {
  documents: any[];
  currentUserEmail?: string;
}

function getCollaborators(usersAccesses: Record<string, any> | undefined) {
  if (!usersAccesses) return [];
  return Object.keys(usersAccesses);
}

function getAccessLabel(access: any): string {
  if (!access) return 'viewer';
  if (Array.isArray(access) && access.includes('room:write')) return 'editor';
  return 'viewer';
}

// ─── Sortable List Item ───
function SortableListItem({
  doc,
  currentUserEmail,
}: {
  doc: any;
  currentUserEmail?: string;
}) {
  const { id, metadata, createdAt, lastConnectionAt, usersAccesses } = doc;
  const collaborators = getCollaborators(usersAccesses);
  const collaboratorCount = collaborators.length;
  const isCreator = currentUserEmail === metadata.email;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="document-list-item group"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="hidden sm:flex cursor-grab active:cursor-grabbing p-1 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4 min-w-0">
        <div className="hidden rounded-lg bg-muted p-2.5 sm:block shrink-0">
          <FileText className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="line-clamp-1 text-base font-medium text-foreground">
            {metadata.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="size-3" />
              {isCreator ? 'You' : metadata.email?.split('@')[0]}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" />
              Created {dateConverter(createdAt)}
            </span>
            {lastConnectionAt && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3" />
                Active {dateConverter(lastConnectionAt)}
              </span>
            )}
            {collaboratorCount > 1 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3" />
                {collaboratorCount} collaborator{collaboratorCount !== 1 ? 's' : ''}
              </span>
            )}
            {collaboratorCount > 1 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Share2 className="size-3" />
                Shared
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Collaborator avatars */}
      {collaboratorCount > 1 && (
        <div className="hidden md:flex -space-x-1.5 shrink-0">
          {collaborators.slice(0, 3).map((email, i) => (
            <div
              key={email}
              className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary ring-2 ring-card"
              title={email}
            >
              {email[0]?.toUpperCase()}
            </div>
          ))}
          {collaboratorCount > 3 && (
            <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
              +{collaboratorCount - 3}
            </div>
          )}
        </div>
      )}

      <DeleteModal roomId={id} />
    </li>
  );
}

// ─── Sortable Grid Card ───
function SortableGridCard({
  doc,
  currentUserEmail,
}: {
  doc: any;
  currentUserEmail?: string;
}) {
  const { id, metadata, createdAt, lastConnectionAt, usersAccesses } = doc;
  const collaborators = getCollaborators(usersAccesses);
  const collaboratorCount = collaborators.length;
  const isCreator = currentUserEmail === metadata.email;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 overflow-hidden"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:text-muted-foreground transition-all z-10"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Delete button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <DeleteModal roomId={id} />
      </div>

      <Link href={`/documents/${id}`} className="flex flex-col flex-1 p-5">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-lg bg-muted p-2.5 shrink-0">
            <FileText className="size-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="line-clamp-2 text-sm font-semibold text-foreground leading-tight">
              {metadata.title}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-auto space-y-2 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="size-3" />
              {isCreator ? 'You' : metadata.email?.split('@')[0]}
            </span>
            {collaboratorCount > 1 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Share2 className="size-3" />
                Shared
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            Created {dateConverter(createdAt)}
          </div>

          {lastConnectionAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" />
              Active {dateConverter(lastConnectionAt)}
            </div>
          )}

          {/* Collaborator avatars */}
          {collaboratorCount > 1 && (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex -space-x-1.5">
                {collaborators.slice(0, 4).map((email) => (
                  <div
                    key={email}
                    className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary ring-2 ring-card"
                    title={email}
                  >
                    {email[0]?.toUpperCase()}
                  </div>
                ))}
                {collaboratorCount > 4 && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-muted-foreground ring-2 ring-card">
                    +{collaboratorCount - 4}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {collaboratorCount} collaborator{collaboratorCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

// ─── Main Component ───
const DocumentSearch = ({ documents, currentUserEmail }: DocumentSearchProps) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [orderedIds, setOrderedIds] = useState<string[]>(() =>
    documents.map((d) => d.id)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    const docs = documents.filter((doc: any) =>
      doc.metadata.title.toLowerCase().includes(searchLower)
    );

    if (!search) {
      // Respect custom order when not searching
      const docMap = new Map(docs.map((d) => [d.id, d]));
      const ordered = orderedIds
        .map((id) => docMap.get(id))
        .filter(Boolean);
      // Add any new docs not yet in order
      const orderedSet = new Set(orderedIds);
      const newDocs = docs.filter((d) => !orderedSet.has(d.id));
      return [...ordered, ...newDocs];
    }

    return docs;
  }, [documents, search, orderedIds]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedIds((ids) => {
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      return arrayMove(ids, oldIndex, newIndex);
    });
  }

  return (
    <>
      {/* Search + View Toggle */}
      <div className="flex items-center gap-3 w-full max-w-[730px]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
            className={`size-8 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="List view"
          >
            <LayoutList className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`size-8 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {/* Document list/grid */}
      {filtered.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {viewMode === 'list' ? (
            <SortableContext
              items={filtered.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="document-ul">
                {filtered.map((doc: any) => (
                  <SortableListItem
                    key={doc.id}
                    doc={doc}
                    currentUserEmail={currentUserEmail}
                  />
                ))}
              </ul>
            </SortableContext>
          ) : (
            <SortableContext
              items={filtered.map((d) => d.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid w-full max-w-[730px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((doc: any) => (
                  <SortableGridCard
                    key={doc.id}
                    doc={doc}
                    currentUserEmail={currentUserEmail}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </DndContext>
      ) : (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          No documents match your search.
        </p>
      )}
    </>
  );
};

export default DocumentSearch;
