import { useMemo } from 'react';
import { create } from 'zustand';
import type { Notification } from '@/types/notification.types';
import { MOCK_NOTIFICATIONS } from '@/mock/notifications.mock';

interface NotificationsState {
  notifications: Notification[];

  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: MOCK_NOTIFICATIONS,

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, isRead: true })),
    }));
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));

/** Sorted newest-first — every consumer (menu, preview, center) wants this order. */
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
