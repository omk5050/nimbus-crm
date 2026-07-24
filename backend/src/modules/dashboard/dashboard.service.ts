import { prisma } from '@/config/prisma';

export async function getSummary(companyId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    invoicesPaidThisMonth,
    invoicesPaidLastMonth,
    newLeadsThisMonth,
    newLeadsLastMonth,
    openDeals,
    openDealsLastMonth,
    activeCustomers,
    activeCustomersLastMonth,
  ] = await Promise.all([
    // Revenue this month (sum of paid invoice amounts)
    prisma.payment.aggregate({
      where: { companyId, status: 'completed', createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { companyId, status: 'completed', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { amount: true },
    }),

    // Leads this month
    prisma.lead.count({ where: { companyId, createdAt: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { companyId, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),

    // Open deals
    prisma.deal.count({ where: { companyId, stage: { notIn: ['won', 'lost'] } } }),
    prisma.deal.count({ where: { companyId, stage: { notIn: ['won', 'lost'] }, createdAt: { lte: endOfLastMonth } } }),

    // Active customers
    prisma.customer.count({ where: { companyId, status: 'active' } }),
    prisma.customer.count({ where: { companyId, status: 'active', createdAt: { lte: endOfLastMonth } } }),
  ]);

  const revenue = invoicesPaidThisMonth._sum.amount ?? 0;
  const revenueLastMonth = invoicesPaidLastMonth._sum.amount ?? 0;
  const revenueTrend = revenueLastMonth > 0 ? ((revenue - revenueLastMonth) / revenueLastMonth) * 100 : 0;

  const leadsTrend = newLeadsLastMonth > 0
    ? ((newLeadsThisMonth - newLeadsLastMonth) / newLeadsLastMonth) * 100
    : 0;

  const dealsTrend = openDealsLastMonth > 0
    ? ((openDeals - openDealsLastMonth) / openDealsLastMonth) * 100
    : 0;

  const customersTrend = activeCustomersLastMonth > 0
    ? ((activeCustomers - activeCustomersLastMonth) / activeCustomersLastMonth) * 100
    : 0;

  return [
    { id: 'revenue', label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, trend: { value: Math.round(revenueTrend * 10) / 10, label: 'vs last month' } },
    { id: 'newLeads', label: 'New Leads', value: String(newLeadsThisMonth), trend: { value: Math.round(leadsTrend * 10) / 10, label: 'vs last month' } },
    { id: 'openDeals', label: 'Open Deals', value: String(openDeals), trend: { value: Math.round(dealsTrend * 10) / 10, label: 'vs last month' } },
    { id: 'activeCustomers', label: 'Active Customers', value: String(activeCustomers), trend: { value: Math.round(customersTrend * 10) / 10, label: 'vs last month' } },
  ];
}

export async function getRevenueTrend(companyId: string, months = 7) {
  const result = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthLabel = date.toLocaleString('en-US', { month: 'short' });
    const isProjected = i === 0;

    const { _sum } = await prisma.payment.aggregate({
      where: {
        companyId,
        status: 'completed',
        createdAt: { gte: date, lte: isProjected ? now : endDate },
      },
      _sum: { amount: true },
    });

    result.push({ month: monthLabel, revenue: _sum.amount ?? 0, ...(isProjected ? { isProjected: true } : {}) });
  }

  return result;
}

export async function getLeadSourceBreakdown(companyId: string) {
  const leads = await prisma.lead.groupBy({
    by: ['source'],
    where: { companyId },
    _count: { source: true },
  });
  return leads.map((l: { source: string; _count: { source: number } }) => ({ source: l.source, count: l._count.source }));
}

export async function getRecentActivity(companyId: string, limit = 10) {
  // Pull from multiple activity tables and merge/sort
  const [customerEvents, leadEvents] = await Promise.all([
    prisma.customerTimelineEvent.findMany({
      where: { customer: { companyId } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.leadActivity.findMany({
      where: { lead: { companyId } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
  ]);

  type ActivityEntry = { id: string; type: string; actor: string; description: string; createdAt: Date };
  const combined: ActivityEntry[] = [
    ...customerEvents.map((e: ActivityEntry) => ({ id: e.id, type: e.type, actor: e.actor, description: e.description, createdAt: e.createdAt })),
    ...leadEvents.map((e: ActivityEntry) => ({ id: e.id, type: e.type, actor: e.actor, description: e.description, createdAt: e.createdAt })),
  ];

  return combined
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
