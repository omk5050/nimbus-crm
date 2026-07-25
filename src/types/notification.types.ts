import type { EntityId } from '@/types/common.types';

export type NotificationType = 'lead' | 'deal' | 'invoice' | 'task' | 'customer' | 'system' | 'table';

export interface Notification {
  id: EntityId;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  /** ISO datetime. */
  createdAt: string;
  /** Route to navigate to when the notification is clicked, e.g. a lead or invoice detail page. */
  link?: string;
}
