import { create } from 'zustand';
import type { CompanyProfile, CompanyProfileFormValues } from '@/types/settings.types';
import { MOCK_CURRENT_COMPANY } from '@/mock/company.mock';

interface CompanyState {
  company: CompanyProfile;
  updateCompany: (values: CompanyProfileFormValues) => void;
}

export const useCompanyStore = create<CompanyState>()((set) => ({
  company: MOCK_CURRENT_COMPANY,

  updateCompany: (values) => {
    set((state) => ({ company: { ...state.company, ...values } }));
  },
}));
