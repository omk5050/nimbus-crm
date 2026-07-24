import { Link, useNavigate } from 'react-router';
import { Bell, CheckCheck } from 'lucide-react';
import { Popover } from '@/components/common/Popover';
import { IconButton } from '@/components/buttons/IconButton';
import { useNotificationsStore, useSortedNotifications, useUnreadNotificationCount } from '@/store/notifications.store';
import { NOTIFICATION_TYPE_ICON } from '@/constants/notification.constants';
import { ROUTES } from '@/constants/routes.constants';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Notification } from '@/types/notification.types';

const PREVIEW_COUNT = 5;

export function NotificationsMenu() {
  const notifications = useSortedNotifications();
  const unreadCount = useUnreadNotificationCount();
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const navigate = useNavigate();

  function handleSelect(notification: Notification, close: () => void) {
    markAsRead(notification.id);
    close();
    if (notification.link) navigate(notification.link);
  }

  return (
    <Popover
      align="end"
      panelClassName="w-80"
      trigger={({ toggle }) => (
        <div className="relative">
          <IconButton icon={<Bell size={18} />} label="Notifications" onClick={toggle} />
          {unreadCount > 0 && (
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-popover-foreground">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">You're all caught up.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.slice(0, PREVIEW_COUNT).map((notification) => {
                const Icon = NOTIFICATION_TYPE_ICON[notification.type];
                return (
                  <li key={notification.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      onClick={() => handleSelect(notification, close)}
                      className="flex w-full items-start gap-2 px-4 py-3 text-left hover:bg-accent/50"
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                          notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground',
                        )}
                      >
                        <Icon size={13} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-popover-foreground">
                          {notification.title}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            to={ROUTES.NOTIFICATIONS}
            onClick={close}
            className="block px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-accent/50"
          >
            View all notifications
          </Link>
        </>
      )}
    </Popover>
  );
}
