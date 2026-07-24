import { z } from 'zod';

export const employeeFormSchema = z.object({
  name: z.string().min(2, "Enter the employee's full name"),
  email: z.email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  role: z.string().min(2, 'Enter a job title'),
  department: z.enum(['Sales', 'Engineering', 'Marketing', 'Support', 'Finance', 'HR'], 'Select a department'),
  status: z.enum(['active', 'on_leave', 'terminated'], 'Select a status'),
  hireDate: z.string().min(1, 'Set a hire date'),
});
