import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().default(''),
  status: z.enum(['active', 'prospect', 'inactive']),
  industry: z.enum(['Technology', 'Retail', 'Manufacturing', 'Healthcare', 'Logistics', 'Finance', 'Hospitality', 'Education']),
  owner: z.string().optional().default(''),
  address: z.string().optional().default(''),
  tags: z.preprocess((val) => (Array.isArray(val) ? val.join(', ') : val ?? ''), z.string().default('')),
});

export const customerNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
});

export const customerListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['active', 'prospect', 'inactive']).optional(),
  industry: z.enum(['Technology', 'Retail', 'Manufacturing', 'Healthcare', 'Logistics', 'Finance', 'Hospitality', 'Education']).optional(),
  owner: z.string().optional(),
  search: z.string().optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CustomerNoteInput = z.infer<typeof customerNoteSchema>;
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
