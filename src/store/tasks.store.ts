import { create } from 'zustand';
import type { Task, TaskFormValues, TaskStatus } from '@/types/task.types';
import { apiClient } from '@/services/api.client';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;

  fetchTasks: () => Promise<void>;
  addTask: (values: TaskFormValues) => Promise<Task>;
  updateTask: (id: string, values: TaskFormValues) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveStatus: (id: string, status: TaskStatus) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/tasks');
      const data = res.data.data || res.data || [];
      set({ tasks: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addTask: async (values) => {
    const res = await apiClient.post('/tasks', values);
    const newTask: Task = res.data;
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    return newTask;
  },

  updateTask: async (id, values) => {
    const res = await apiClient.put(`/tasks/${id}`, values);
    const updated: Task = res.data;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTask: async (id) => {
    await apiClient.delete(`/tasks/${id}`);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  moveStatus: async (id, status) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = { ...task, status };
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
    try {
      await apiClient.patch(`/tasks/${id}/status`, { status });
    } catch {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
      }));
    }
  },

  toggleDone: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    const updated = { ...task, status: nextStatus };
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
    try {
      await apiClient.patch(`/tasks/${id}/toggle-done`);
    } catch {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
      }));
    }
  },
}));
