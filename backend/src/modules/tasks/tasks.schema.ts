import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().default(''),
  relatedTo: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']).default('todo'),
});

export const moveStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']),
});

export const taskListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  search: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type MoveStatusInput = z.infer<typeof moveStatusSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
