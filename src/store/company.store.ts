import { create } from 'zustand';
import type { CompanyProfile, CompanyProfileFormValues } from '@/types/settings.types';
import { apiClient } from '@/services/api.client';

interface CompanyState {
  company: CompanyProfile;
  isLoading: boolean;

  fetchCompany: () => Promise<void>;
  updateCompany: (values: CompanyProfileFormValues) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()((set) => ({
  company: {
    id: '',
    name: '',
    plan: 'starter',
    industry: '',
    website: '',
    address: '',
    timezone: 'UTC',
  },
  isLoading: false,

  fetchCompany: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/settings/company');
      if (res.data) {
        set({ company: res.data, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateCompany: async (values) => {
    const res = await apiClient.put('/settings/company', values);
    if (res.data) {
      set({ company: res.data });
    }
  },
}));
