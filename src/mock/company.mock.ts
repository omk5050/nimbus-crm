import type { CompanyProfile } from '@/types/settings.types';

/**
 * The workspace/tenant currently "signed in" to. Once multi-company
 * support is real, this becomes the response of GET /companies/current
 * and the sidebar switcher (visual-only for now) becomes functional.
 */
export const MOCK_CURRENT_COMPANY: CompanyProfile = {
  id: 'cmp_001',
  name: 'Skyline Retail Co.',
  plan: 'growth',
  industry: 'Retail',
  website: 'https://skylineretail.co',
  address: '55 Fifth Avenue, New York, NY',
  timezone: 'America/New_York',
};
