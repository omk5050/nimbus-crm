import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/buttons/Button';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { EmptyState } from '@/components/common/EmptyState';
import { NotificationCard } from '@/pages/notifications/components/NotificationCard';
import {
  useNotificationsStore,
  useSortedNotifications,
  useUnreadNotificationCount,
} from '@/store/notifications.store';
import { NOTIFICATION_TYPE_OPTIONS } from '@/constants/notification.constants';
import type { Notification, NotificationType } from '@/types/notification.types';
import { cn } from '@/utils/cn';

type ReadFilter = 'all' | 'unread';

function groupByRecency(notifications: Notification[]) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const groups: { label: string; items: Notification[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Earlier', items: [] },
  ];

  for (const notification of notifications) {
    const dateKey = notification.createdAt.slice(0, 10);
    if (dateKey === todayKey) groups[0].items.push(notification);
    else if (dateKey === yesterdayKey) groups[1].items.push(notification);
    else groups[2].items.push(notification);
  }

  return groups.filter((group) => group.items.length > 0);
}

export default function NotificationsPage() {
  const notifications = useSortedNotifications();
  const unreadCount = useUnreadNotificationCount();
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification);
  const navigate = useNavigate();

  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType[]>([]);

  const filtered = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesRead = readFilter === 'all' || !notification.isRead;
      const matchesType = typeFilter.length === 0 || typeFilter.includes(notification.type);
      return matchesRead && matchesType;
    });
  }, [notifications, readFilter, typeFilter]);

  const groups = useMemo(() => groupByRecency(filtered), [filtered]);

  function handleSelect(notification: Notification) {
    markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={() => markAllAsRead()}>
            <CheckCheck size={15} />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => setReadFilter('all')}
            className={cn(
              'rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
              readFilter === 'all' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setReadFilter('unread')}
            className={cn(
              'rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
              readFilter === 'unread' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Unread
          </button>
        </div>
        <FilterDropdown
          label="Type"
          options={NOTIFICATION_TYPE_OPTIONS}
          selected={typeFilter}
          onChange={setTypeFilter}
        />
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={readFilter === 'unread' ? 'No unread notifications' : 'No notifications match your filters'}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </h2>
              <div className="flex flex-col gap-2">
                {group.items.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onSelect={handleSelect}
                    onDelete={(entry) => deleteNotification(entry.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
