import type { EntityId } from '@/types/common.types';

/**
 * 'new' through 'proposal' are the active pipeline (Kanban columns a lead
 * moves through left to right). 'won' and 'lost' are terminal outcomes,
 * shown as their own columns but reached at any point, not just from
 * 'proposal'.
 */
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export type LeadSource = 'Website' | 'Referral' | 'Cold Outreach' | 'Social Media' | 'Partner';

export interface Lead {
  id: EntityId;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: LeadStage;
  source: LeadSource;
  /** Sales rep name — see constants/team.constants.ts. */
  owner: string;
  /** Estimated deal value in USD. */
  value: number;
  /** ISO date, optional — not every lead has a projected close date yet. */
  expectedCloseDate?: string;
  createdAt: string;
}

export interface LeadFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: LeadStage;
  source: LeadSource;
  owner: string;
  value: number;
  expectedCloseDate: string;
}

export type LeadActivityType = 'created' | 'stage-change' | 'owner-change' | 'call' | 'email' | 'meeting' | 'note';

export interface LeadActivity {
  id: EntityId;
  leadId: EntityId;
  type: LeadActivityType;
  description: string;
  actor: string;
  createdAt: string;
}
