import { create } from 'zustand';
import type { ReserveTableInput, Table, TableFormValues } from '@/types/table.types';
import { apiClient } from '@/services/api.client';

interface TablesState {
  tables: Table[];
  isLoading: boolean;

  fetchTables: () => Promise<void>;
  createTable: (values: TableFormValues) => Promise<Table>;
  reserveTable: (id: string, input: ReserveTableInput) => Promise<void>;
  extendGracePeriod: (id: string, additionalMinutes?: number) => Promise<void>;
  clearTable: (id: string) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
}

export const useTablesStore = create<TablesState>()((set, get) => ({
  tables: [],
  isLoading: false,

  fetchTables: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/tables');
      set({ tables: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createTable: async (values) => {
    const res = await apiClient.post('/tables', values);
    const newTable: Table = res.data;
    set((state) => ({ tables: [...state.tables, newTable] }));
    return newTable;
  },

  reserveTable: async (id, input) => {
    const res = await apiClient.patch(`/tables/${id}/reserve`, input);
    const updated: Table = res.data;
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? updated : t)),
    }));
  },

  extendGracePeriod: async (id, additionalMinutes = 10) => {
    const res = await apiClient.patch(`/tables/${id}/extend`, { additionalMinutes });
    const updated: Table = res.data;
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? updated : t)),
    }));
  },

  clearTable: async (id) => {
    const res = await apiClient.patch(`/tables/${id}/clear`);
    const updated: Table = res.data;
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTable: async (id) => {
    await apiClient.delete(`/tables/${id}`);
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== id),
    }));
  },
}));
