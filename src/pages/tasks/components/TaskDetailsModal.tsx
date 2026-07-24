import { Calendar, CheckCircle2, Pencil, Trash2, UserRound } from 'lucide-react';
import { Modal } from '@/components/modals/Modal';
import { Button } from '@/components/buttons/Button';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Avatar } from '@/components/common/Avatar';
import { useTasksStore } from '@/store/tasks.store';
import { toast } from '@/store/toast.store';
import {
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_TONE,
  TASK_STATUS_LABEL,
  TASK_STATUS_TONE,
} from '@/constants/task.constants';
import type { Task } from '@/types/task.types';
import { formatDate } from '@/utils/format';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskDetailsModal({ task, onClose, onEdit, onDelete }: TaskDetailsModalProps) {
  const toggleDone = useTasksStore((state) => state.toggleDone);

  return (
    <Modal
      isOpen={task !== null}
      onClose={onClose}
      size="md"
      footer={
        task && (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                onDelete(task);
                onClose();
              }}
            >
              <Trash2 size={15} />
              Delete
            </Button>
            <Button variant="secondary" onClick={() => onEdit(task)}>
              <Pencil size={15} />
              Edit
            </Button>
            <Button
              onClick={() => {
                toggleDone(task.id);
                toast.success(task.status === 'done' ? 'Reopened task' : 'Task marked done');
                onClose();
              }}
            >
              <CheckCircle2 size={15} />
              {task.status === 'done' ? 'Mark as not done' : 'Mark as done'}
            </Button>
          </>
        )
      }
    >
      {task && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">{task.title}</h2>
            <div className="flex shrink-0 gap-1.5">
              <StatusBadge label={TASK_STATUS_LABEL[task.status]} tone={TASK_STATUS_TONE[task.status]} />
              <StatusBadge
                label={TASK_PRIORITY_LABEL[task.priority]}
                tone={TASK_PRIORITY_TONE[task.priority]}
              />
            </div>
          </div>

          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}

          <div className="grid grid-cols-1 gap-4 rounded-md bg-muted/40 p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <Avatar name={task.assignee} size="sm" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Assignee</p>
                <p className="truncate text-sm font-medium text-foreground">{task.assignee}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Calendar size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Due date</p>
                <p className="text-sm font-medium text-foreground">{formatDate(task.dueDate)}</p>
              </div>
            </div>
            {task.relatedTo && (
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <UserRound size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Related to</p>
                  <p className="truncate text-sm font-medium text-foreground">{task.relatedTo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
