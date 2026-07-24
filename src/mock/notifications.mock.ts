import type { Notification } from '@/types/notification.types';
import { ROUTES, customerDetailRoute, leadDetailRoute } from '@/constants/routes.constants';

function minutesAgoIso(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/**
 * A realistic mixed feed across every module — the Topbar bell, the
 * Dashboard preview, and the full Notification Center (Phase 10) all read
 * from the same store seeded with this data, so read/unread state stays
 * consistent everywhere it's shown.
 */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'ntf_001',
    type: 'lead',
    title: 'New lead assigned',
    description: 'Priya Shah assigned "Bluewave Logistics" to you.',
    isRead: false,
    createdAt: minutesAgoIso(8),
    link: leadDetailRoute('lead_002'),
  },
  {
    id: 'ntf_002',
    type: 'deal',
    title: 'Deal moved to Negotiation',
    description: '"Multi-year renewal" for Fenwick & Partners changed stage.',
    isRead: false,
    createdAt: minutesAgoIso(52),
    link: `${ROUTES.SALES}`,
  },
  {
    id: 'ntf_003',
    type: 'task',
    title: 'Task due today',
    description: 'Follow up call with Harlan Ortiz is due today.',
    isRead: false,
    createdAt: minutesAgoIso(180),
    link: ROUTES.TASKS,
  },
  {
    id: 'ntf_004',
    type: 'invoice',
    title: 'Invoice paid',
    description: 'Invoice #INV-2291 for Cedar & Co. was paid in full.',
    isRead: true,
    createdAt: minutesAgoIso(1440),
    link: `${ROUTES.SALES}/invoices`,
  },
  {
    id: 'ntf_005',
    type: 'customer',
    title: 'New customer added',
    description: 'Naomi Fields (Fernwood Analytics) was added as a prospect.',
    isRead: true,
    createdAt: minutesAgoIso(1600),
    link: customerDetailRoute('cust_002'),
  },
  {
    id: 'ntf_006',
    type: 'lead',
    title: 'Lead marked as Won',
    description: '"Haddad Import Group" closed successfully.',
    isRead: true,
    createdAt: minutesAgoIso(2100),
    link: ROUTES.LEADS,
  },
  {
    id: 'ntf_007',
    type: 'invoice',
    title: 'Invoice overdue',
    description: 'Invoice #INV-2294 for Meridian Foods is now overdue.',
    isRead: false,
    createdAt: minutesAgoIso(2600),
    link: `${ROUTES.SALES}/invoices`,
  },
  {
    id: 'ntf_008',
    type: 'task',
    title: 'Task completed',
    description: 'Leo Nakamura marked "Ship dark mode polish" as done.',
    isRead: true,
    createdAt: minutesAgoIso(4300),
    link: ROUTES.TASKS,
  },
  {
    id: 'ntf_009',
    type: 'system',
    title: 'Weekly report ready',
    description: 'Your Sales report for last week is ready to view.',
    isRead: true,
    createdAt: minutesAgoIso(5900),
    link: `${ROUTES.REPORTS}/sales`,
  },
  {
    id: 'ntf_010',
    type: 'deal',
    title: 'Deal at risk',
    description: '"Logistics module rollout" has had no activity in 9 days.',
    isRead: true,
    createdAt: minutesAgoIso(7100),
    link: ROUTES.SALES,
  },
  {
    id: 'ntf_011',
    type: 'customer',
    title: 'Customer flagged as churn risk',
    description: 'Northgate Supply was tagged "Churn risk" by Jordan Reyes.',
    isRead: true,
    createdAt: minutesAgoIso(8700),
    link: customerDetailRoute('cust_005'),
  },
  {
    id: 'ntf_012',
    type: 'system',
    title: 'New team member onboarded',
    description: 'Connor Blake was added to the HR department.',
    isRead: true,
    createdAt: minutesAgoIso(10200),
    link: ROUTES.EMPLOYEES,
  },
];
