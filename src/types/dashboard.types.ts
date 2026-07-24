/** Identifies which StatCard this is so the page can map it to an icon/route. */
export type DashboardStatId = 'revenue' | 'newLeads' | 'openDeals' | 'activeCustomers';

export interface DashboardStat {
  id: DashboardStatId;
  label: string;
  value: string;
  trend: {
    value: number;
    label: string;
  };
}

/** One point on the revenue trend chart. */
export interface RevenuePoint {
  /** Short month label, e.g. "Jan". */
  month: string;
  revenue: number;
  /** True for the current, still-in-progress month — rendered as a dashed projection. */
  isProjected?: boolean;
}

/** One row in the "New Leads by Source" breakdown. */
export interface LeadSourceBreakdown {
  source: string;
  count: number;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'deal' | 'note' | 'invoice';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  actor: string;
  description: string;
  /** Pre-formatted relative time, e.g. "12m ago" — mirrors the notifications mock. */
  timeLabel: string;
}
