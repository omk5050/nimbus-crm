import { useState } from 'react';
import type { DragEvent } from 'react';
import { LeadKanbanColumn } from '@/pages/leads/components/kanban/LeadKanbanColumn';
import { useLeadsStore } from '@/store/leads.store';
import { LEAD_STAGE_COLUMNS } from '@/constants/lead.constants';
import type { Lead, LeadStage } from '@/types/lead.types';

interface LeadKanbanBoardProps {
  leads: Lead[];
  onCardClick: (leadId: string) => void;
}

/**
 * Uses native HTML5 drag-and-drop (draggable + onDrag*) rather than a
 * library — it's the one interaction in the whole app that needs it, so a
 * dependency wasn't worth adding for it.
 */
export function LeadKanbanBoard({ leads, onCardClick }: LeadKanbanBoardProps) {
  const moveStage = useLeadsStore((state) => state.moveStage);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetStage, setDropTargetStage] = useState<LeadStage | null>(null);

  function handleDragStartCard(event: DragEvent<HTMLDivElement>, leadId: string) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', leadId);
    setDraggingId(leadId);
  }

  function handleDragEndCard() {
    setDraggingId(null);
    setDropTargetStage(null);
  }

  function handleDropColumn(event: DragEvent<HTMLDivElement>, stage: LeadStage) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain') || draggingId;
    if (id) moveStage(id, stage);
    setDraggingId(null);
    setDropTargetStage(null);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {LEAD_STAGE_COLUMNS.map((stage) => (
        <LeadKanbanColumn
          key={stage}
          stage={stage}
          leads={leads.filter((lead) => lead.stage === stage)}
          draggingId={draggingId}
          isDropTarget={dropTargetStage === stage}
          onDragStartCard={handleDragStartCard}
          onDragEndCard={handleDragEndCard}
          onDragOverColumn={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            if (draggingId) setDropTargetStage(stage);
          }}
          onDragLeaveColumn={(event) => {
            if (event.currentTarget.contains(event.relatedTarget as Node)) return;
            setDropTargetStage((current) => (current === stage ? null : current));
          }}
          onDropColumn={(event) => handleDropColumn(event, stage)}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}
