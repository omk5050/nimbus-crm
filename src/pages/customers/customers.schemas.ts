import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z.string().min(2, "Enter the contact's full name"),
  company: z.string().min(2, 'Company name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  status: z.enum(['active', 'prospect', 'inactive'], 'Select a status'),
  industry: z.string().min(1, 'Select an industry'),
  owner: z.string().min(1, 'Assign an owner'),
  address: z.string().min(3, 'Address is required'),
  tags: z.string(),
});
