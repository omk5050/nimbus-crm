import { Briefcase, CheckCircle2, Contact, Receipt, Settings, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SelectOption } from '@/types/common.types';
import type { NotificationType } from '@/types/notification.types';

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  lead: 'Leads',
  deal: 'Deals',
  invoice: 'Invoices',
  task: 'Tasks',
  customer: 'Customers',
  system: 'System',
};

export const NOTIFICATION_TYPE_ICON: Record<NotificationType, LucideIcon> = {
  lead: Target,
  deal: Briefcase,
  invoice: Receipt,
  task: CheckCircle2,
  customer: Contact,
  system: Settings,
};

export const NOTIFICATION_TYPE_OPTIONS: SelectOption<NotificationType>[] = (
  Object.keys(NOTIFICATION_TYPE_LABEL) as NotificationType[]
).map((type) => ({ value: type, label: NOTIFICATION_TYPE_LABEL[type] }));
