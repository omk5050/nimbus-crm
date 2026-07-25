import { useState } from 'react';
import type { DragEvent } from 'react';
import { DealKanbanColumn } from '@/pages/sales/components/kanban/DealKanbanColumn';
import { useSalesStore } from '@/store/sales.store';
import { DEAL_STAGE_COLUMNS } from '@/constants/sales.constants';
import type { Deal, DealStage } from '@/types/sales.types';

interface DealKanbanBoardProps {
  deals: Deal[];
  onCardClick: (dealId: string) => void;
}

/** Native HTML5 drag-and-drop, mirroring LeadKanbanBoard — see that file for the rationale. */
export function DealKanbanBoard({ deals, onCardClick }: DealKanbanBoardProps) {
  const moveDealStage = useSalesStore((state) => state.moveDealStage);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetStage, setDropTargetStage] = useState<DealStage | null>(null);

  function handleDragStartCard(event: DragEvent<HTMLDivElement>, dealId: string) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', dealId);
    setDraggingId(dealId);
  }

  function handleDragEndCard() {
    setDraggingId(null);
    setDropTargetStage(null);
  }

  function handleDropColumn(event: DragEvent<HTMLDivElement>, stage: DealStage) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain') || draggingId;
    if (id) moveDealStage(id, stage);
    setDraggingId(null);
    setDropTargetStage(null);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {DEAL_STAGE_COLUMNS.map((stage) => (
        <DealKanbanColumn
          key={stage}
          stage={stage}
          deals={deals.filter((deal) => deal.stage === stage)}
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
