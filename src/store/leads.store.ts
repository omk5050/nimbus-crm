import { create } from 'zustand';
import type { Lead, LeadActivity, LeadFormValues, LeadStage } from '@/types/lead.types';
import { apiClient } from '@/services/api.client';

interface LeadsState {
  leads: Lead[];
  activityByLeadId: Record<string, LeadActivity[]>;
  isLoading: boolean;

  fetchLeads: () => Promise<void>;
  fetchLeadActivity: (id: string) => Promise<void>;
  addLead: (values: LeadFormValues) => Promise<Lead>;
  updateLead: (id: string, values: LeadFormValues) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  moveStage: (id: string, stage: LeadStage) => Promise<void>;
  assignOwner: (id: string, owner: string) => Promise<void>;
  logNote: (leadId: string, content: string) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>()((set, get) => ({
  leads: [],
  activityByLeadId: {},
  isLoading: false,

  fetchLeads: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/leads');
      const data = res.data.data || res.data || [];
      set({ leads: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchLeadActivity: async (id: string) => {
    try {
      const res = await apiClient.get(`/leads/${id}/activity`);
      set((state) => ({
        activityByLeadId: { ...state.activityByLeadId, [id]: res.data },
      }));
    } catch {
      // Ignore
    }
  },

  addLead: async (values) => {
    const res = await apiClient.post('/leads', values);
    const newLead: Lead = res.data;

    set((state) => ({
      leads: [newLead, ...state.leads],
    }));

    return newLead;
  },

  updateLead: async (id, values) => {
    const res = await apiClient.put(`/leads/${id}`, values);
    const updated: Lead = res.data;

    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? updated : l)),
    }));
  },

  deleteLead: async (id) => {
    await apiClient.delete(`/leads/${id}`);
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
    }));
  },

  moveStage: async (id, stage) => {
    const lead = get().leads.find((l) => l.id === id);
    if (!lead) return;
    const updatedLead = { ...lead, stage };

    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? updatedLead : l)),
    }));

    try {
      await apiClient.patch(`/leads/${id}/stage`, { stage });
    } catch {
      // Rollback on error
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? lead : l)),
      }));
    }
  },

  assignOwner: async (id, owner) => {
    const lead = get().leads.find((l) => l.id === id);
    if (!lead) return;
    const updatedLead = { ...lead, owner };

    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? updatedLead : l)),
    }));

    try {
      await apiClient.patch(`/leads/${id}/owner`, { owner });
    } catch {
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? lead : l)),
      }));
    }
  },

  logNote: async (leadId, content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      const res = await apiClient.post(`/leads/${leadId}/activity`, {
        type: 'note',
        description: trimmed,
      });
      const activity: LeadActivity = res.data;

      set((state) => ({
        activityByLeadId: {
          ...state.activityByLeadId,
          [leadId]: [activity, ...(state.activityByLeadId[leadId] ?? [])],
        },
      }));
    } catch {
      // Ignore
    }
  },
}));

export function useLead(id: string | undefined) {
  return useLeadsStore((state) => state.leads.find((lead) => lead.id === id));
}
