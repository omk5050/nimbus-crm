import { CalendarPlus, Receipt, Target, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /**
   * Destination module. Until each module's own "create" flow ships
   * (Customers in Phase 4, Leads in Phase 5, …), Quick Actions just take
   * the user to that module — later this becomes `${path}?action=create`
   * to deep-link straight into the create modal.
   */
  path: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'add-customer',
    label: 'Add Customer',
    description: 'Create a new account',
    icon: UserPlus,
    path: `${ROUTES.CUSTOMERS}?new=true`,
  },
  {
    id: 'create-lead',
    label: 'Create Lead',
    description: 'Log a new opportunity',
    icon: Target,
    path: `${ROUTES.LEADS}?new=true`,
  },
  {
    id: 'new-invoice',
    label: 'New Invoice',
    description: 'Bill a customer',
    icon: Receipt,
    path: `${ROUTES.SALES}/invoices`,
  },
  {
    id: 'schedule-meeting',
    label: 'Schedule Meeting',
    description: 'Book time on the calendar',
    icon: CalendarPlus,
    path: `${ROUTES.TASKS}?new=true`,
  },
];
