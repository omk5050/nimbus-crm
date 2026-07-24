import type {
  ActivityItem,
  DashboardStat,
  RevenuePoint,
} from '@/types/dashboard.types';

/**
 * All Dashboard mock data lives in this one file since every widget on the
 * page is a small, related slice of the same "how's the business doing
 * right now" snapshot. Once a real API exists this whole file is replaced
 * by a single `GET /dashboard/summary` call (see services/endpoints.ts).
 */

export const MOCK_DASHBOARD_STATS: DashboardStat[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$284,650',
    trend: { value: 12.4, label: 'vs last month' },
  },
  {
    id: 'newLeads',
    label: 'New Leads',
    value: '156',
    trend: { value: 8.2, label: 'vs last month' },
  },
  {
    id: 'openDeals',
    label: 'Open Deals',
    value: '42',
    trend: { value: -3.1, label: 'vs last month' },
  },
  {
    id: 'activeCustomers',
    label: 'Active Customers',
    value: '892',
    trend: { value: 5.6, label: 'vs last month' },
  },
];

/** Trailing 7 months ending on the current month (July), which is still in progress. */
export const MOCK_REVENUE_TREND: RevenuePoint[] = [
  { month: 'Jan', revenue: 142000 },
  { month: 'Feb', revenue: 158000 },
  { month: 'Mar', revenue: 149500 },
  { month: 'Apr', revenue: 171200 },
  { month: 'May', revenue: 196800 },
  { month: 'Jun', revenue: 213400 },
  { month: 'Jul', revenue: 168900, isProjected: true },
];

export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'deal',
    actor: 'Priya Shah',
    description: 'moved "Meridian Foods — Annual Contract" to Negotiation',
    timeLabel: '12m ago',
  },
  {
    id: 'act_002',
    type: 'call',
    actor: 'Marcus Webb',
    description: 'logged a 24-minute call with Bluewave Logistics',
    timeLabel: '48m ago',
  },
  {
    id: 'act_003',
    type: 'invoice',
    actor: 'System',
    description: 'Invoice #INV-2291 for Cedar & Co. was paid in full',
    timeLabel: '2h ago',
  },
  {
    id: 'act_004',
    type: 'email',
    actor: 'Aisha Khan',
    description: 'sent a proposal follow-up to Harlan Ortiz',
    timeLabel: '3h ago',
  },
  {
    id: 'act_005',
    type: 'meeting',
    actor: 'Jordan Reyes',
    description: 'scheduled a demo with Fernwood Analytics for Jul 18',
    timeLabel: '5h ago',
  },
  {
    id: 'act_006',
    type: 'note',
    actor: 'Marcus Webb',
    description: 'added a note to the Skyline Retail Co. account',
    timeLabel: 'Yesterday',
  },
];
