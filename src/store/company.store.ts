import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanyProfile, CompanyProfileFormValues } from '@/types/settings.types';
import { apiClient } from '@/services/api.client';

interface CompanyState {
  company: CompanyProfile;
  isLoading: boolean;

  fetchCompany: () => Promise<void>;
  updateCompany: (values: CompanyProfileFormValues) => Promise<void>;
}

const DEFAULT_COMPANY: CompanyProfile = {
  id: '',
  name: '',
  plan: 'starter',
  industry: '',
  website: '',
  address: '',
  timezone: 'UTC',
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      company: DEFAULT_COMPANY,
      isLoading: false,

      fetchCompany: async () => {
        set({ isLoading: true });
        try {
          const res = await apiClient.get('/settings/company');
          if (res.data) {
            set({ company: res.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      updateCompany: async (values) => {
        // Optimistic update — reflect changes in the UI immediately
        const previous = get().company;
        set({ company: { ...previous, ...values } });

        try {
          const res = await apiClient.put('/settings/company', values);
          if (res.data) {
            // Merge server response in case it contains server-assigned fields
            set({ company: res.data });
          }
        } catch {
          // Roll back to the previous value if the server rejects it
          set({ company: previous });
          throw new Error('Failed to save company profile. Changes have been reverted.');
        }
      },
    }),
    {
      name: 'nimbus-company',
      // Only persist the company object, not the loading flag
      partialize: (state) => ({ company: state.company }),
    },
  ),
);

