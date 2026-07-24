import type { DragEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { TaskKanbanCard } from '@/pages/tasks/components/kanban/TaskKanbanCard';
import type { Task, TaskStatus } from '@/types/task.types';
import { TASK_STATUS_LABEL } from '@/constants/task.constants';
import { cn } from '@/utils/cn';

interface TaskKanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  draggingId: string | null;
  isDropTarget: boolean;
  onDragStartCard: (event: DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEndCard: () => void;
  onDragOverColumn: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeaveColumn: () => void;
  onDropColumn: (event: DragEvent<HTMLDivElement>) => void;
  onCardClick: (taskId: string) => void;
}

export function TaskKanbanColumn({
  status,
  tasks,
  draggingId,
  isDropTarget,
  onDragStartCard,
  onDragEndCard,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropColumn,
  onCardClick,
}: TaskKanbanColumnProps) {
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
          {TASK_STATUS_LABEL[status]} <span className="text-muted-foreground">({tasks.length})</span>
        </h3>
      </div>

      <div className="flex min-h-[120px] flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <TaskKanbanCard
              key={task.id}
              task={task}
              isDragging={draggingId === task.id}
              onDragStart={(event) => onDragStartCard(event, task.id)}
              onDragEnd={onDragEndCard}
              onClick={() => onCardClick(task.id)}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border py-6 text-xs text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
