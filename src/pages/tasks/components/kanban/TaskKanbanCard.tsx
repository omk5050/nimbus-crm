import { motion } from 'motion/react';
import type { DragEvent } from 'react';
import { Calendar } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import type { Task } from '@/types/task.types';
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE } from '@/constants/task.constants';
import { formatDate } from '@/utils/format';

interface TaskKanbanCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

export function TaskKanbanCard({ task, isDragging, onDragStart, onDragEnd, onClick }: TaskKanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        layout
        layoutId={task.id}
        onClick={onClick}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.18 }}
        className="cursor-grab flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 shadow-sm active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-card-foreground">{task.title}</p>
          <StatusBadge label={TASK_PRIORITY_LABEL[task.priority]} tone={TASK_PRIORITY_TONE[task.priority]} />
        </div>

        {task.relatedTo && <p className="truncate text-xs text-muted-foreground">{task.relatedTo}</p>}

        <div className="flex items-center justify-between border-t border-border pt-2.5">
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignee} size="xs" />
            <span className="truncate text-xs text-muted-foreground">{task.assignee}</span>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={11} />
            {formatDate(task.dueDate)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
