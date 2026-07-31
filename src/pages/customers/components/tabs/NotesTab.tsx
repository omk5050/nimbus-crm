import { useState } from 'react';
import { NotebookPen, Send } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { Avatar } from '@/components/common/Avatar';
import { Textarea } from '@/components/inputs/Textarea';
import { Button } from '@/components/buttons/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { useCustomersStore } from '@/store/customers.store';
import type { CustomerNote } from '@/types/customer.types';
import { formatRelativeTime } from '@/utils/format';

interface NotesTabProps {
  customerId: string;
}

const EMPTY_NOTES: CustomerNote[] = [];

export function NotesTab({ customerId }: NotesTabProps) {
  const notes = useCustomersStore((state) => state.notesByCustomerId[customerId] ?? EMPTY_NOTES);
  const addNote = useCustomersStore((state) => state.addNote);
  const [draft, setDraft] = useState('');

  function handleAddNote() {
    if (!draft.trim()) return;
    addNote(customerId, draft);
    setDraft('');
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <Textarea
          label="Add a note"
          placeholder="Log a call, a preference, anything the team should know…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
        />
        <Button className="self-end" onClick={handleAddNote} disabled={!draft.trim()}>
          <Send size={15} />
          Add note
        </Button>
      </Card>

      {notes.length === 0 ? (
        <EmptyState icon={NotebookPen} title="No notes yet" description="Be the first to add one." />
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <Card key={note.id} className="flex gap-3">
              <Avatar name={note.author} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-card-foreground">{note.author}</p>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(note.createdAt)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{note.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
