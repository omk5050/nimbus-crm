import type { DragEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { DealKanbanCard } from '@/pages/sales/components/kanban/DealKanbanCard';
import type { Deal, DealStage } from '@/types/sales.types';
import { DEAL_STAGE_LABEL } from '@/constants/sales.constants';
import { formatCompactCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface DealKanbanColumnProps {
  stage: DealStage;
  deals: Deal[];
  draggingId: string | null;
  isDropTarget: boolean;
  onDragStartCard: (event: DragEvent<HTMLDivElement>, dealId: string) => void;
  onDragEndCard: () => void;
  onDragOverColumn: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeaveColumn: () => void;
  onDropColumn: (event: DragEvent<HTMLDivElement>) => void;
  onCardClick: (dealId: string) => void;
}

export function DealKanbanColumn({
  stage,
  deals,
  draggingId,
  isDropTarget,
  onDragStartCard,
  onDragEndCard,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropColumn,
  onCardClick,
}: DealKanbanColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

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
          {DEAL_STAGE_LABEL[stage]} <span className="text-muted-foreground">({deals.length})</span>
        </h3>
        <span className="text-xs text-muted-foreground">{formatCompactCurrency(totalValue)}</span>
      </div>

      <div className="flex min-h-[120px] flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {deals.map((deal) => (
            <DealKanbanCard
              key={deal.id}
              deal={deal}
              isDragging={draggingId === deal.id}
              onDragStart={(event) => onDragStartCard(event, deal.id)}
              onDragEnd={onDragEndCard}
              onClick={() => onCardClick(deal.id)}
            />
          ))}
        </AnimatePresence>

        {deals.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border py-6 text-xs text-muted-foreground">
            No deals
          </div>
        )}
      </div>
    </div>
  );
}
