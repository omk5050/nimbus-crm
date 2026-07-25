import { useMemo } from 'react';
import { create } from 'zustand';
import type { Notification } from '@/types/notification.types';
import { apiClient } from '@/services/api.client';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  pollNotifications: () => Promise<void>;
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

  pollNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications');
      const data: Notification[] = res.data.data || res.data || [];
      const currentNotifications = useNotificationsStore.getState().notifications;

      const previousIds = new Set(currentNotifications.map((n) => n.id));
      const newlyAddedUnread = data.filter((n) => !n.isRead && !previousIds.has(n.id));

      set({ notifications: data });

      if (newlyAddedUnread.length > 0) {
        const { usePreferencesStore } = await import('@/store/preferences.store');
        const prefs = usePreferencesStore.getState();

        if (prefs.audioChimesEnabled) {
          const { playNotificationChime } = await import('@/utils/notificationSound');
          playNotificationChime();
        }

        if (prefs.desktopNotificationsEnabled) {
          const { sendDesktopNotification } = await import('@/utils/nativeNotifications');
          const latest = newlyAddedUnread[0];
          sendDesktopNotification(latest.title, latest.description);
        }
      }
    } catch {
      // Ignore background poll errors
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
