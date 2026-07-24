import type { SelectOption, StatusTone } from '@/types/common.types';
import type { TaskPriority, TaskStatus } from '@/types/task.types';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

export const TASK_STATUS_TONE: Record<TaskStatus, StatusTone> = {
  todo: 'neutral',
  in_progress: 'info',
  in_review: 'warning',
  done: 'success',
};

/** Left-to-right Kanban column order. */
export const TASK_STATUS_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];

export const TASK_STATUS_OPTIONS: SelectOption<TaskStatus>[] = TASK_STATUS_COLUMNS.map((status) => ({
  value: status,
  label: TASK_STATUS_LABEL[status],
}));

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const TASK_PRIORITY_TONE: Record<TaskPriority, StatusTone> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

export const TASK_PRIORITY_OPTIONS: SelectOption<TaskPriority>[] = (
  Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]
).map((priority) => ({ value: priority, label: TASK_PRIORITY_LABEL[priority] }));
