import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().default(''),
  stage: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).default('new'),
  source: z.enum(['Website', 'Referral', 'Cold_Outreach', 'Social_Media', 'Partner']).default('Website'),
  owner: z.string().default(''),
  value: z.coerce.number().min(0).default(0),
  expectedCloseDate: z.string().optional(),
});

export const moveStageSchema = z.object({
  stage: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
});

export const assignOwnerSchema = z.object({
  owner: z.string().min(1, 'Owner is required'),
});

export const logActivitySchema = z.object({
  type: z.enum(['created', 'stage_change', 'owner_change', 'call', 'email', 'meeting', 'note']),
  description: z.string().min(1, 'Description is required'),
});

export const leadListQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  stage: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).optional(),
  source: z.enum(['Website', 'Referral', 'Cold_Outreach', 'Social_Media', 'Partner']).optional(),
  owner: z.string().optional(),
  search: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type MoveStageInput = z.infer<typeof moveStageSchema>;
export type AssignOwnerInput = z.infer<typeof assignOwnerSchema>;
export type LogActivityInput = z.infer<typeof logActivitySchema>;
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
