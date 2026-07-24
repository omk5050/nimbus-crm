import { motion } from 'motion/react';
import type { DragEvent } from 'react';
import { Calendar } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/badges/Badge';
import type { Lead } from '@/types/lead.types';
import { formatCompactCurrency, formatDate } from '@/utils/format';

interface LeadKanbanCardProps {
  lead: Lead;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

export function LeadKanbanCard({ lead, isDragging, onDragStart, onDragEnd, onClick }: LeadKanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        layout
        layoutId={lead.id}
        onClick={onClick}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.18 }}
        className="cursor-grab flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 shadow-sm active:cursor-grabbing"
      >
        <div>
          <p className="truncate text-sm font-medium text-card-foreground">{lead.name}</p>
          <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-card-foreground">
            {formatCompactCurrency(lead.value)}
          </span>
          <Badge tone="neutral">{lead.source}</Badge>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2.5">
          <div className="flex items-center gap-1.5">
            <Avatar name={lead.owner} size="xs" />
            <span className="truncate text-xs text-muted-foreground">{lead.owner}</span>
          </div>
          {lead.expectedCloseDate && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} />
              {formatDate(lead.expectedCloseDate)}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
