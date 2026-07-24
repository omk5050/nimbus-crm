import type { EntityId } from '@/types/common.types';

export type CustomerStatus = 'active' | 'prospect' | 'inactive';

export type CustomerIndustry =
  | 'Technology'
  | 'Retail'
  | 'Manufacturing'
  | 'Healthcare'
  | 'Logistics'
  | 'Finance'
  | 'Hospitality'
  | 'Education';

export interface Customer {
  id: EntityId;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  industry: CustomerIndustry;
  /** Sales rep name. Plain string for now — becomes a real Employee reference in Phase 7. */
  owner: string;
  address: string;
  lifetimeValue: number;
  tags: string[];
  /** ISO timestamp. */
  createdAt: string;
}

export interface CustomerFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  industry: CustomerIndustry;
  owner: string;
  address: string;
  /** Comma-separated in the form UI, split into Customer.tags on submit. */
  tags: string;
}

export interface CustomerNote {
  id: EntityId;
  customerId: EntityId;
  author: string;
  content: string;
  createdAt: string;
}

export type CustomerFileType = 'pdf' | 'doc' | 'sheet' | 'image' | 'other';

export interface CustomerFile {
  id: EntityId;
  customerId: EntityId;
  fileName: string;
  fileType: CustomerFileType;
  sizeLabel: string;
  uploadedBy: string;
  createdAt: string;
}

export type CustomerTimelineEventType =
  | 'created'
  | 'updated'
  | 'note'
  | 'call'
  | 'email'
  | 'meeting'
  | 'deal';

export interface CustomerTimelineEvent {
  id: EntityId;
  customerId: EntityId;
  type: CustomerTimelineEventType;
  description: string;
  actor: string;
  createdAt: string;
}
