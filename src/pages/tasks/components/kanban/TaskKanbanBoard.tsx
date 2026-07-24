import { useState } from 'react';
import type { DragEvent } from 'react';
import { TaskKanbanColumn } from '@/pages/tasks/components/kanban/TaskKanbanColumn';
import { useTasksStore } from '@/store/tasks.store';
import { TASK_STATUS_COLUMNS } from '@/constants/task.constants';
import type { Task, TaskStatus } from '@/types/task.types';

interface TaskKanbanBoardProps {
  tasks: Task[];
  onCardClick: (taskId: string) => void;
}

/** Native HTML5 drag-and-drop, mirroring the Lead/Deal Kanban boards — see those files for the rationale. */
export function TaskKanbanBoard({ tasks, onCardClick }: TaskKanbanBoardProps) {
  const moveStatus = useTasksStore((state) => state.moveStatus);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(null);

  function handleDragStartCard(event: DragEvent<HTMLDivElement>, taskId: string) {
    event.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  }

  function handleDragEndCard() {
    setDraggingId(null);
    setDropTargetStatus(null);
  }

  function handleDropColumn(event: DragEvent<HTMLDivElement>, status: TaskStatus) {
    event.preventDefault();
    if (draggingId) moveStatus(draggingId, status);
    setDraggingId(null);
    setDropTargetStatus(null);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {TASK_STATUS_COLUMNS.map((status) => (
        <TaskKanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((task) => task.status === status)}
          draggingId={draggingId}
          isDropTarget={dropTargetStatus === status}
          onDragStartCard={handleDragStartCard}
          onDragEndCard={handleDragEndCard}
          onDragOverColumn={(event) => {
            event.preventDefault();
            if (draggingId) setDropTargetStatus(status);
          }}
          onDragLeaveColumn={() => setDropTargetStatus((current) => (current === status ? null : current))}
          onDropColumn={(event) => handleDropColumn(event, status)}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}
