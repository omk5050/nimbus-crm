import type {
  Customer,
  CustomerFile,
  CustomerNote,
  CustomerTimelineEvent,
} from '@/types/customer.types';

export const MOCK_CUSTOMERS: Customer[] = [];
export const INITIAL_CUSTOMER_NOTES: Record<string, CustomerNote[]> = {};
export const INITIAL_CUSTOMER_TIMELINE: Record<string, CustomerTimelineEvent[]> = {};
export const CUSTOMER_FILES: Record<string, CustomerFile[]> = {};
