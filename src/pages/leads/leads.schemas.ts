import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z.string().min(2, "Enter the lead's full name"),
  company: z.string().min(2, 'Company name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  stage: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
  source: z.enum(['Website', 'Referral', 'Cold Outreach', 'Social Media', 'Partner']),
  owner: z.string().min(1, 'Assign an owner'),
  value: z.number().min(0, 'Enter a valid deal value'),
  expectedCloseDate: z.string(),
});
