import { useMemo } from 'react';
import { ChartCard } from '@/components/cards/ChartCard';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { LeadSourceBarChart } from '@/components/charts/LeadSourceBarChart';
import { MOCK_REVENUE_TREND } from '@/mock/dashboard.mock';
import { useLeadsStore } from '@/store/leads.store';
import { DashboardHeader } from '@/pages/dashboard/components/DashboardHeader';
import { StatsGrid } from '@/pages/dashboard/components/StatsGrid';
import { QuickActions } from '@/pages/dashboard/components/QuickActions';
import { TodaysTasks } from '@/pages/dashboard/components/TodaysTasks';
import { RecentActivity } from '@/pages/dashboard/components/RecentActivity';
import { NotificationsPreview } from '@/pages/dashboard/components/NotificationsPreview';
import { RecentCustomers } from '@/pages/dashboard/components/RecentCustomers';

export default function DashboardPage() {
  const leads = useLeadsStore((state) => state.leads);

  const leadSourceBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const lead of leads) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }
    return Array.from(counts, ([source, count]) => ({ source, count }));
  }, [leads]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <StatsGrid />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Revenue trend"
          description="Last 7 months"
          className="lg:col-span-2"
        >
          <RevenueAreaChart data={MOCK_REVENUE_TREND} />
        </ChartCard>

        <ChartCard title="New leads by source" description="This month">
          <LeadSourceBarChart data={leadSourceBreakdown} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TodaysTasks />
        <RecentActivity />
        <NotificationsPreview />
      </div>

      <RecentCustomers />
    </div>
  );
}
