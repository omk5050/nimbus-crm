import { Link, useNavigate } from 'react-router';
import { Card, CardHeader } from '@/components/cards/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { ROUTES } from '@/constants/routes.constants';
import { useNotificationsStore, useSortedNotifications, useUnreadNotificationCount } from '@/store/notifications.store';
import { NOTIFICATION_TYPE_ICON } from '@/constants/notification.constants';
import { BellOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Notification } from '@/types/notification.types';

export function NotificationsPreview() {
  const notifications = useSortedNotifications();
  const unreadCount = useUnreadNotificationCount();
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const navigate = useNavigate();

  function handleSelect(notification: Notification) {
    markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        action={
          <Link
            to={ROUTES.NOTIFICATIONS}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState icon={BellOff} title="No notifications yet" />
      ) : (
        <ul className="flex flex-col gap-1">
          {notifications.slice(0, 4).map((entry) => {
            const Icon = NOTIFICATION_TYPE_ICON[entry.type];
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(entry)}
                  className="flex w-full items-start gap-3 rounded-md px-1 py-2 text-left hover:bg-accent/40"
                >
                  <span
                    className={cn(
                      'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                      entry.isRead ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground',
                    )}
                  >
                    <Icon size={12} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-card-foreground">{entry.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.description}</p>
                  </div>
                  {!entry.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
