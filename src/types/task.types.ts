import type { EntityId } from '@/types/common.types';

/** Kanban column order: To Do → In Progress → In Review → Done. */
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: EntityId;
  title: string;
  description?: string;
  /** Employee name — see constants/team.constants.ts. */
  assignee: string;
  /** Freeform label, e.g. a customer or company name this task relates to. */
  relatedTo?: string;
  /** ISO date (day only). */
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  assignee: string;
  relatedTo: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}
