import { useState } from 'react';
import { Send } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { Textarea } from '@/components/inputs/Textarea';
import { Button } from '@/components/buttons/Button';
import { useLeadsStore } from '@/store/leads.store';

interface LeadNoteComposerProps {
  leadId: string;
}

export function LeadNoteComposer({ leadId }: LeadNoteComposerProps) {
  const logNote = useLeadsStore((state) => state.logNote);
  const [draft, setDraft] = useState('');

  function handleAddNote() {
    if (!draft.trim()) return;
    logNote(leadId, draft);
    setDraft('');
  }

  return (
    <Card className="flex flex-col gap-3">
      <Textarea
        label="Log an update"
        placeholder="Add a call summary, note, or next step…"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={3}
      />
      <Button className="self-end" onClick={handleAddNote} disabled={!draft.trim()}>
        <Send size={15} />
        Log update
      </Button>
    </Card>
  );
}
