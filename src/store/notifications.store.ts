import { useMemo } from 'react';
import { create } from 'zustand';
import type { Notification } from '@/types/notification.types';
import { apiClient } from '@/services/api.client';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/notifications');
      const data = res.data.data || res.data || [];
      set({ notifications: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      // Ignore
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {
      // Ignore
    }
  },

  deleteNotification: async (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));

export function useSortedNotifications() {
  const notifications = useNotificationsStore((state) => state.notifications);
  return useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [notifications],
  );
}

export function useUnreadNotificationCount() {
  return useNotificationsStore((state) => state.notifications.filter((n) => !n.isRead).length);
}
