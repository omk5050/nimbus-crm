import type { SelectOption, StatusTone } from '@/types/common.types';
import type { CustomerIndustry, CustomerStatus } from '@/types/customer.types';

export const CUSTOMER_STATUS_TONE: Record<CustomerStatus, StatusTone> = {
  active: 'success',
  prospect: 'info',
  inactive: 'neutral',
};

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  active: 'Active',
  prospect: 'Prospect',
  inactive: 'Inactive',
};

export const CUSTOMER_STATUS_OPTIONS: SelectOption<CustomerStatus>[] = (
  Object.keys(CUSTOMER_STATUS_LABEL) as CustomerStatus[]
).map((status) => ({ value: status, label: CUSTOMER_STATUS_LABEL[status] }));

export const CUSTOMER_INDUSTRIES: CustomerIndustry[] = [
  'Technology',
  'Retail',
  'Manufacturing',
  'Healthcare',
  'Logistics',
  'Finance',
  'Hospitality',
  'Education',
];

export const CUSTOMER_INDUSTRY_OPTIONS: SelectOption<CustomerIndustry>[] = CUSTOMER_INDUSTRIES.map(
  (industry) => ({ value: industry, label: industry }),
);
