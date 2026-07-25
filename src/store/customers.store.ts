import { create } from 'zustand';
import type {
  Customer,
  CustomerFormValues,
  CustomerNote,
  CustomerTimelineEvent,
} from '@/types/customer.types';
import { apiClient } from '@/services/api.client';

function parseTags(rawTags: string): string[] {
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

interface CustomersState {
  customers: Customer[];
  notesByCustomerId: Record<string, CustomerNote[]>;
  timelineByCustomerId: Record<string, CustomerTimelineEvent[]>;
  filesByCustomerId: Record<string, any[]>;
  isLoading: boolean;

  fetchCustomers: () => Promise<void>;
  fetchCustomer: (id: string) => Promise<Customer | null>;
  fetchCustomerDetails: (id: string) => Promise<void>;
  addCustomer: (values: CustomerFormValues) => Promise<Customer>;
  updateCustomer: (id: string, values: CustomerFormValues) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addNote: (customerId: string, content: string) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>()((set) => ({
  customers: [],
  notesByCustomerId: {},
  timelineByCustomerId: {},
  filesByCustomerId: {},
  isLoading: false,

  fetchCustomers: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/customers');
      const data = res.data.data || res.data || [];
      set({ customers: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCustomer: async (id: string) => {
    try {
      const res = await apiClient.get(`/customers/${id}`);
      const fetched: Customer = res.data;
      if (fetched && fetched.id) {
        set((state) => {
          const exists = state.customers.some((c) => c.id === fetched.id);
          return {
            customers: exists
              ? state.customers.map((c) => (c.id === fetched.id ? fetched : c))
              : [fetched, ...state.customers],
          };
        });
        return fetched;
      }
      return null;
    } catch {
      return null;
    }
  },

  fetchCustomerDetails: async (id: string) => {
    try {
      const [notesRes, timelineRes, filesRes] = await Promise.all([
        apiClient.get(`/customers/${id}/notes`).catch(() => ({ data: [] })),
        apiClient.get(`/customers/${id}/timeline`).catch(() => ({ data: [] })),
        apiClient.get(`/customers/${id}/files`).catch(() => ({ data: [] })),
      ]);
      set((state) => ({
        notesByCustomerId: { ...state.notesByCustomerId, [id]: Array.isArray(notesRes.data) ? notesRes.data : [] },
        timelineByCustomerId: { ...state.timelineByCustomerId, [id]: Array.isArray(timelineRes.data) ? timelineRes.data : [] },
        filesByCustomerId: { ...state.filesByCustomerId, [id]: Array.isArray(filesRes.data) ? filesRes.data : [] },
      }));
    } catch {
      // Ignore
    }
  },

  addCustomer: async (values) => {
    const payload = {
      ...values,
      tags: parseTags(values.tags),
    };
    const res = await apiClient.post('/customers', payload);
    const newCustomer: Customer = res.data;

    set((state) => ({
      customers: [newCustomer, ...state.customers],
    }));

    return newCustomer;
  },

  updateCustomer: async (id, values) => {
    const payload = {
      ...values,
      tags: parseTags(values.tags),
    };
    const res = await apiClient.put(`/customers/${id}`, payload);
    const updated: Customer = res.data;

    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCustomer: async (id) => {
    await apiClient.delete(`/customers/${id}`);
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
  },

  addNote: async (customerId, content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const res = await apiClient.post(`/customers/${customerId}/notes`, { content: trimmed });
    const note: CustomerNote = res.data;

    set((state) => ({
      notesByCustomerId: {
        ...state.notesByCustomerId,
        [customerId]: [note, ...(state.notesByCustomerId[customerId] ?? [])],
      },
    }));
  },
}));

export function useCustomer(id: string | undefined) {
  return useCustomersStore((state) => state.customers.find((customer) => customer.id === id));
}
