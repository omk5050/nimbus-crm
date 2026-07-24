import { motion } from 'motion/react';
import type { DragEvent } from 'react';
import { Calendar } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import type { Deal } from '@/types/sales.types';
import { formatCompactCurrency, formatDate } from '@/utils/format';

interface DealKanbanCardProps {
  deal: Deal;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

export function DealKanbanCard({ deal, isDragging, onDragStart, onDragEnd, onClick }: DealKanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        layout
        layoutId={deal.id}
        onClick={onClick}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.18 }}
        className="cursor-grab flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 shadow-sm active:cursor-grabbing"
      >
        <div>
          <p className="truncate text-sm font-medium text-card-foreground">{deal.title}</p>
          <p className="truncate text-xs text-muted-foreground">{deal.company}</p>
        </div>

        <span className="text-sm font-semibold text-card-foreground">
          {formatCompactCurrency(deal.value)}
        </span>

        <div className="flex items-center justify-between border-t border-border pt-2.5">
          <div className="flex items-center gap-1.5">
            <Avatar name={deal.owner} size="xs" />
            <span className="truncate text-xs text-muted-foreground">{deal.owner}</span>
          </div>
          {deal.expectedCloseDate && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} />
              {formatDate(deal.expectedCloseDate)}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
