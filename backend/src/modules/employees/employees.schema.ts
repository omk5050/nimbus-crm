import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().default(''),
  role: z.string().default(''),
  department: z.enum(['Sales', 'Engineering', 'Marketing', 'Support', 'Finance', 'HR']),
  status: z.enum(['active', 'on_leave', 'terminated']).default('active'),
  hireDate: z.string().min(1, 'Hire date is required'),
  avatarColor: z.string().optional(),
});

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  department: z.enum(['Sales', 'Engineering', 'Marketing', 'Support', 'Finance', 'HR']).optional(),
  status: z.enum(['active', 'on_leave', 'terminated']).optional(),
  search: z.string().optional(),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeListQuery = z.infer<typeof employeeListQuerySchema>;
