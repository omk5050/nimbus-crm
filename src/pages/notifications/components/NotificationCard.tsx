import { X } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { NOTIFICATION_TYPE_ICON, NOTIFICATION_TYPE_LABEL } from '@/constants/notification.constants';
import type { Notification } from '@/types/notification.types';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

interface NotificationCardProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

export function NotificationCard({ notification, onSelect, onDelete }: NotificationCardProps) {
  const Icon = NOTIFICATION_TYPE_ICON[notification.type];

  return (
    <Card
      className={cn(
        'flex cursor-pointer items-start gap-3 transition-colors hover:border-primary/40',
        !notification.isRead && 'bg-accent/30',
      )}
      onClick={() => onSelect(notification)}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground',
        )}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-card-foreground">{notification.title}</p>
          {!notification.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{notification.description}</p>
        <p className="mt-1.5 text-xs text-muted-foreground/70">
          {NOTIFICATION_TYPE_LABEL[notification.type]} · {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(notification);
        }}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <X size={14} />
      </button>
    </Card>
  );
}
