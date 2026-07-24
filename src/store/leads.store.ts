import { create } from 'zustand';
import type { Lead, LeadActivity, LeadFormValues, LeadStage } from '@/types/lead.types';
import { INITIAL_LEAD_ACTIVITY, MOCK_LEADS } from '@/mock/leads.mock';
import { LEAD_STAGE_LABEL } from '@/constants/lead.constants';
import { MOCK_CURRENT_USER } from '@/mock/user.mock';

function generateId(): string {
  return `lead_${crypto.randomUUID().slice(0, 8)}`;
}

function logActivity(
  activityByLeadId: Record<string, LeadActivity[]>,
  leadId: string,
  entry: Omit<LeadActivity, 'id' | 'leadId' | 'createdAt'>,
): Record<string, LeadActivity[]> {
  const event: LeadActivity = {
    id: `act_${leadId}_${Date.now()}`,
    leadId,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  return {
    ...activityByLeadId,
    [leadId]: [event, ...(activityByLeadId[leadId] ?? [])],
  };
}

interface LeadsState {
  leads: Lead[];
  activityByLeadId: Record<string, LeadActivity[]>;

  addLead: (values: LeadFormValues) => Lead;
  updateLead: (id: string, values: LeadFormValues) => void;
  deleteLead: (id: string) => void;
  /** Used by both the Kanban drag-drop and the detail page's stage stepper. */
  moveStage: (id: string, stage: LeadStage) => void;
  assignOwner: (id: string, owner: string) => void;
  logNote: (leadId: string, content: string) => void;
}

export const useLeadsStore = create<LeadsState>()((set) => ({
  leads: MOCK_LEADS,
  activityByLeadId: INITIAL_LEAD_ACTIVITY,

  addLead: (values) => {
    const newLead: Lead = {
      id: generateId(),
      ...values,
      expectedCloseDate: values.expectedCloseDate || undefined,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      leads: [newLead, ...state.leads],
      activityByLeadId: logActivity(state.activityByLeadId, newLead.id, {
        type: 'created',
        description: `Lead captured from ${newLead.source}`,
        actor: MOCK_CURRENT_USER.name,
      }),
    }));

    return newLead;
  },

  updateLead: (id, values) => {
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id
          ? { ...lead, ...values, expectedCloseDate: values.expectedCloseDate || undefined }
          : lead,
      ),
      activityByLeadId: logActivity(state.activityByLeadId, id, {
        type: 'note',
        description: 'Lead details updated',
        actor: MOCK_CURRENT_USER.name,
      }),
    }));
  },

  deleteLead: (id) => {
    set((state) => {
      const nextActivity = { ...state.activityByLeadId };
      delete nextActivity[id];
      return {
        leads: state.leads.filter((lead) => lead.id !== id),
        activityByLeadId: nextActivity,
      };
    });
  },

  moveStage: (id, stage) => {
    set((state) => {
      const lead = state.leads.find((entry) => entry.id === id);
      if (!lead || lead.stage === stage) return state;

      return {
        leads: state.leads.map((entry) => (entry.id === id ? { ...entry, stage } : entry)),
        activityByLeadId: logActivity(state.activityByLeadId, id, {
          type: 'stage-change',
          description: `Moved from ${LEAD_STAGE_LABEL[lead.stage]} to ${LEAD_STAGE_LABEL[stage]}`,
          actor: MOCK_CURRENT_USER.name,
        }),
      };
    });
  },

  assignOwner: (id, owner) => {
    set((state) => {
      const lead = state.leads.find((entry) => entry.id === id);
      if (!lead || lead.owner === owner) return state;

      return {
        leads: state.leads.map((entry) => (entry.id === id ? { ...entry, owner } : entry)),
        activityByLeadId: logActivity(state.activityByLeadId, id, {
          type: 'owner-change',
          description: `Reassigned from ${lead.owner} to ${owner}`,
          actor: MOCK_CURRENT_USER.name,
        }),
      };
    });
  },

  logNote: (leadId, content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    set((state) => ({
      activityByLeadId: logActivity(state.activityByLeadId, leadId, {
        type: 'note',
        description: trimmed,
        actor: MOCK_CURRENT_USER.name,
      }),
    }));
  },
}));

export function useLead(id: string | undefined) {
  return useLeadsStore((state) => state.leads.find((lead) => lead.id === id));
}
