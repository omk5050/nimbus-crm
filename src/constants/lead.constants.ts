import type { SelectOption, StatusTone } from '@/types/common.types';
import type { LeadSource, LeadStage } from '@/types/lead.types';

export const LEAD_STAGE_LABEL: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export const LEAD_STAGE_TONE: Record<LeadStage, StatusTone> = {
  new: 'info',
  contacted: 'info',
  qualified: 'warning',
  proposal: 'warning',
  won: 'success',
  lost: 'danger',
};

/** The stages a lead actively progresses through, in order — used for the stage stepper (excludes the terminal Won/Lost outcomes). */
export const LEAD_PIPELINE_STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'proposal'];

/** Left-to-right Kanban column order — includes the two terminal outcomes at the end. */
export const LEAD_STAGE_COLUMNS: LeadStage[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
];

export const LEAD_STAGE_OPTIONS: SelectOption<LeadStage>[] = LEAD_STAGE_COLUMNS.map((stage) => ({
  value: stage,
  label: LEAD_STAGE_LABEL[stage],
}));

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'Cold Outreach',
  'Social Media',
  'Partner',
];

export const LEAD_SOURCE_OPTIONS: SelectOption<LeadSource>[] = LEAD_SOURCES.map((source) => ({
  value: source,
  label: source,
}));
