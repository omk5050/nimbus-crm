import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().min(2, 'Enter a task title'),
  description: z.string(),
  assignee: z.string().min(1, 'Assign this task to someone'),
  relatedTo: z.string(),
  dueDate: z.string().min(1, 'Set a due date'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']),
});
