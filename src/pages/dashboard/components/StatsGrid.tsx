import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Briefcase, DollarSign, Target, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { MOCK_DASHBOARD_STATS } from '@/mock/dashboard.mock';
import { useCustomersStore } from '@/store/customers.store';
import { useLeadsStore } from '@/store/leads.store';
import { useSalesStore } from '@/store/sales.store';
import type { DashboardStatId } from '@/types/dashboard.types';
import { formatCompactCurrency, formatCompactNumber } from '@/utils/format';

const STAT_ICONS: Record<DashboardStatId, LucideIcon> = {
  revenue: DollarSign,
  newLeads: Target,
  openDeals: Briefcase,
  activeCustomers: Users,
};

/**
 * Every value here is derived live from the real feature stores so the grid
 * reflects whatever the user has actually added or changed — Revenue from
 * completed Payments, New Leads/Open Deals from Leads/Deals, Active
 * Customers from Customers. Only the trend deltas ("+12.4% vs last month")
 * stay on the mock, since there's no historical snapshot to diff against.
 */
export function StatsGrid() {
  const leads = useLeadsStore((state) => state.leads);
  const customers = useCustomersStore((state) => state.customers);
  const deals = useSalesStore((state) => state.deals);
  const payments = useSalesStore((state) => state.payments);

  const liveValues = useMemo<Record<DashboardStatId, string>>(() => {
    const newLeadsCount = leads.filter((lead) => lead.stage === 'new').length;
    const openDealsCount = deals.filter((deal) => deal.stage !== 'won' && deal.stage !== 'lost').length;
    const activeCustomersCount = customers.filter((customer) => customer.status === 'active').length;
    const totalRevenue = payments
      .filter((payment) => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      revenue: formatCompactCurrency(totalRevenue),
      newLeads: formatCompactNumber(newLeadsCount),
      openDeals: formatCompactNumber(openDealsCount),
      activeCustomers: formatCompactNumber(activeCustomersCount),
    };
  }, [leads, deals, customers, payments]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {MOCK_DASHBOARD_STATS.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
        >
          <StatCard
            label={stat.label}
            value={liveValues[stat.id]}
            icon={STAT_ICONS[stat.id]}
            trend={stat.trend}
          />
        </motion.div>
      ))}
    </div>
  );
}
