import { z } from 'zod';

export const companyProfileFormSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  website: z.string().url('Enter a valid URL, e.g. https://example.com').or(z.literal('')),
  address: z.string().min(3, 'Address is required'),
  timezone: z.string().min(1, 'Select a timezone'),
});
