import { create } from 'zustand';
import type {
  Customer,
  CustomerFormValues,
  CustomerNote,
  CustomerTimelineEvent,
} from '@/types/customer.types';
import {
  INITIAL_CUSTOMER_NOTES,
  INITIAL_CUSTOMER_TIMELINE,
  MOCK_CUSTOMERS,
} from '@/mock/customers.mock';
import { MOCK_CURRENT_USER } from '@/mock/user.mock';

function parseTags(rawTags: string): string[] {
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function generateId(): string {
  return `cust_${crypto.randomUUID().slice(0, 8)}`;
}

interface CustomersState {
  customers: Customer[];
  notesByCustomerId: Record<string, CustomerNote[]>;
  timelineByCustomerId: Record<string, CustomerTimelineEvent[]>;

  /** Creates the customer and returns it so the caller can e.g. navigate to its detail page. */
  addCustomer: (values: CustomerFormValues) => Customer;
  updateCustomer: (id: string, values: CustomerFormValues) => void;
  deleteCustomer: (id: string) => void;
  addNote: (customerId: string, content: string) => void;
}

export const useCustomersStore = create<CustomersState>()((set) => ({
  customers: MOCK_CUSTOMERS,
  notesByCustomerId: INITIAL_CUSTOMER_NOTES,
  timelineByCustomerId: INITIAL_CUSTOMER_TIMELINE,

  addCustomer: (values) => {
    const newCustomer: Customer = {
      id: generateId(),
      name: values.name,
      company: values.company,
      email: values.email,
      phone: values.phone,
      status: values.status,
      industry: values.industry,
      owner: values.owner,
      address: values.address,
      lifetimeValue: 0,
      tags: parseTags(values.tags),
      createdAt: new Date().toISOString(),
    };

    const createdEvent: CustomerTimelineEvent = {
      id: `evt_${newCustomer.id}_created`,
      customerId: newCustomer.id,
      type: 'created',
      description: 'Account created',
      actor: MOCK_CURRENT_USER.name,
      createdAt: newCustomer.createdAt,
    };

    set((state) => ({
      customers: [newCustomer, ...state.customers],
      notesByCustomerId: { ...state.notesByCustomerId, [newCustomer.id]: [] },
      timelineByCustomerId: {
        ...state.timelineByCustomerId,
        [newCustomer.id]: [createdEvent],
      },
    }));

    return newCustomer;
  },

  updateCustomer: (id, values) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              name: values.name,
              company: values.company,
              email: values.email,
              phone: values.phone,
              status: values.status,
              industry: values.industry,
              owner: values.owner,
              address: values.address,
              tags: parseTags(values.tags),
            }
          : customer,
      ),
      timelineByCustomerId: {
        ...state.timelineByCustomerId,
        [id]: [
          {
            id: `evt_${id}_${Date.now()}`,
            customerId: id,
            type: 'updated',
            description: 'Profile details updated',
            actor: MOCK_CURRENT_USER.name,
            createdAt: new Date().toISOString(),
          },
          ...(state.timelineByCustomerId[id] ?? []),
        ],
      },
    }));
  },

  deleteCustomer: (id) => {
    set((state) => {
      const nextNotes = { ...state.notesByCustomerId };
      delete nextNotes[id];
      const nextTimeline = { ...state.timelineByCustomerId };
      delete nextTimeline[id];

      return {
        customers: state.customers.filter((customer) => customer.id !== id),
        notesByCustomerId: nextNotes,
        timelineByCustomerId: nextTimeline,
      };
    });
  },

  addNote: (customerId, content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const note: CustomerNote = {
      id: `note_${customerId}_${Date.now()}`,
      customerId,
      author: MOCK_CURRENT_USER.name,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const event: CustomerTimelineEvent = {
      id: `evt_${customerId}_${Date.now()}`,
      customerId,
      type: 'note',
      description: 'Note added',
      actor: MOCK_CURRENT_USER.name,
      createdAt: note.createdAt,
    };

    set((state) => ({
      notesByCustomerId: {
        ...state.notesByCustomerId,
        [customerId]: [note, ...(state.notesByCustomerId[customerId] ?? [])],
      },
      timelineByCustomerId: {
        ...state.timelineByCustomerId,
        [customerId]: [event, ...(state.timelineByCustomerId[customerId] ?? [])],
      },
    }));
  },
}));

/** Convenience selector hook — components re-render only when this specific customer changes. */
export function useCustomer(id: string | undefined) {
  return useCustomersStore((state) => state.customers.find((customer) => customer.id === id));
}
