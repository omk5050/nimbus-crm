import { prisma } from '@/config/prisma';

interface DateRangeQuery {
  from?: unknown;
  to?: unknown;
}

function parseDateRange(query: DateRangeQuery) {
  const from = query.from && typeof query.from === 'string' ? new Date(query.from) : new Date(Date.now() - 30 * 86400000);
  const to = query.to && typeof query.to === 'string' ? new Date(query.to) : new Date();
  return { from, to };
}

export async function getRevenueReport(companyId: string, query: DateRangeQuery) {
  const { from, to } = parseDateRange(query);

  const payments = await prisma.payment.findMany({
    where: { companyId, status: 'completed', createdAt: { gte: from, lte: to } },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const byMonth: Record<string, number> = {};
  for (const p of payments) {
    const key = p.createdAt.toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] ?? 0) + p.amount;
  }

  const total = payments.reduce((s: number, p: { amount: number }) => s + p.amount, 0);

  return {
    total,
    byMonth: Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue })),
    from,
    to,
  };
}

export async function getSalesReport(companyId: string, query: DateRangeQuery) {
  const { from, to } = parseDateRange(query);
  const where = { companyId, createdAt: { gte: from, lte: to } };

  const [allDeals, wonDeals] = await Promise.all([
    prisma.deal.findMany({ where, select: { stage: true, value: true } }),
    prisma.deal.findMany({ where: { ...where, stage: 'won' }, select: { value: true } }),
  ]);

  const totalValue = allDeals.reduce((s: number, d: { value: number }) => s + d.value, 0);
  const wonValue = wonDeals.reduce((s: number, d: { value: number }) => s + d.value, 0);
  const avgDealSize = allDeals.length > 0 ? totalValue / allDeals.length : 0;
  const conversionRate = allDeals.length > 0 ? (wonDeals.length / allDeals.length) * 100 : 0;

  const byStage = allDeals.reduce(
    (acc: Record<string, number>, d: { stage: string }) => {
      acc[d.stage] = (acc[d.stage] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalDeals: allDeals.length,
    wonDeals: wonDeals.length,
    lostDeals: allDeals.filter((d: { stage: string }) => d.stage === 'lost').length,
    wonValue,
    avgDealSize,
    conversionRate: Math.round(conversionRate * 10) / 10,
    byStage,
    from,
    to,
  };
}

export async function getLeadsReport(companyId: string, query: DateRangeQuery) {
  const { from, to } = parseDateRange(query);
  const where = { companyId, createdAt: { gte: from, lte: to } };

  const leads = await prisma.lead.findMany({ where, select: { stage: true, source: true, value: true } });

  const byStage = leads.reduce(
    (acc: Record<string, number>, l: { stage: string }) => {
      acc[l.stage] = (acc[l.stage] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const bySource = leads.reduce(
    (acc: Record<string, number>, l: { source: string }) => {
      acc[l.source] = (acc[l.source] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const wonLeads = leads.filter((l: { stage: string }) => l.stage === 'won');
  const conversionRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;
  const totalPipelineValue = leads
    .filter((l: { stage: string; value: number }) => !['won', 'lost'].includes(l.stage))
    .reduce((s: number, l: { value: number }) => s + l.value, 0);

  return {
    total: leads.length,
    won: wonLeads.length,
    lost: leads.filter((l: { stage: string }) => l.stage === 'lost').length,
    conversionRate: Math.round(conversionRate * 10) / 10,
    totalPipelineValue,
    byStage,
    bySource,
    from,
    to,
  };
}

export async function getEmployeesReport(companyId: string, query: DateRangeQuery) {
  const { from, to } = parseDateRange(query);

  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: { performance: true },
  });

  const attendance = await prisma.attendanceRecord.findMany({
    where: {
      employee: { companyId },
      date: { gte: from.toISOString().slice(0, 10), lte: to.toISOString().slice(0, 10) },
    },
    select: { employeeId: true, status: true },
  });

  const attendanceMap: Record<string, { present: number; total: number }> = {};
  for (const rec of attendance) {
    if (!attendanceMap[rec.employeeId]) attendanceMap[rec.employeeId] = { present: 0, total: 0 };
    attendanceMap[rec.employeeId]!.total += 1;
    if (rec.status === 'present') attendanceMap[rec.employeeId]!.present += 1;
  }

  type EmpWithPerf = (typeof employees)[number];

  const rankings = employees.map((emp: EmpWithPerf) => {
    const att = attendanceMap[emp.id] ?? { present: 0, total: 0 };
    const attendanceRate = att.total > 0 ? (att.present / att.total) * 100 : 0;
    return {
      id: emp.id,
      name: emp.name,
      department: emp.department,
      score: emp.performance?.score ?? 0,
      dealsClosed: emp.performance?.dealsClosed ?? 0,
      tasksCompleted: emp.performance?.tasksCompleted ?? 0,
      trend: emp.performance?.trend ?? 0,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
    };
  }).sort((a: { score: number }, b: { score: number }) => b.score - a.score);

  return { rankings, from, to };
}
