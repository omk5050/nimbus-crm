import type { DragEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { LeadKanbanCard } from '@/pages/leads/components/kanban/LeadKanbanCard';
import type { Lead, LeadStage } from '@/types/lead.types';
import { LEAD_STAGE_LABEL } from '@/constants/lead.constants';
import { formatCompactCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface LeadKanbanColumnProps {
  stage: LeadStage;
  leads: Lead[];
  draggingId: string | null;
  isDropTarget: boolean;
  onDragStartCard: (event: DragEvent<HTMLDivElement>, leadId: string) => void;
  onDragEndCard: () => void;
  onDragOverColumn: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeaveColumn: () => void;
  onDropColumn: (event: DragEvent<HTMLDivElement>) => void;
  onCardClick: (leadId: string) => void;
}

export function LeadKanbanColumn({
  stage,
  leads,
  draggingId,
  isDropTarget,
  onDragStartCard,
  onDragEndCard,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropColumn,
  onCardClick,
}: LeadKanbanColumnProps) {
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div
      onDragOver={onDragOverColumn}
      onDragLeave={onDragLeaveColumn}
      onDrop={onDropColumn}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg border border-transparent bg-muted/40 p-2.5 transition-colors',
        isDropTarget && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex items-baseline justify-between px-1.5 pb-2.5">
        <h3 className="text-sm font-semibold text-foreground">
          {LEAD_STAGE_LABEL[stage]} <span className="text-muted-foreground">({leads.length})</span>
        </h3>
        <span className="text-xs text-muted-foreground">{formatCompactCurrency(totalValue)}</span>
      </div>

      <div className="flex min-h-[120px] flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {leads.map((lead) => (
            <LeadKanbanCard
              key={lead.id}
              lead={lead}
              isDragging={draggingId === lead.id}
              onDragStart={(event) => onDragStartCard(event, lead.id)}
              onDragEnd={onDragEndCard}
              onClick={() => onCardClick(lead.id)}
            />
          ))}
        </AnimatePresence>

        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border py-6 text-xs text-muted-foreground">
            No leads
          </div>
        )}
      </div>
    </div>
  );
}
