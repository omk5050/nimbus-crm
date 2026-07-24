import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { Percent, Target, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { ChartCard } from '@/components/cards/ChartCard';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { useLeadsStore } from '@/store/leads.store';
import { LEAD_SOURCE_OPTIONS, LEAD_STAGE_LABEL, LEAD_STAGE_TONE } from '@/constants/lead.constants';
import type { Lead, LeadSource } from '@/types/lead.types';
import { resolveDateRangePreset, isWithinDateRange } from '@/utils/dateRange';
import { formatCompactCurrency, formatDate } from '@/utils/format';

export default function LeadsReportPage() {
  const isLoading = useSimulatedLoading();
  const leads = useLeadsStore((state) => state.leads);
  const [range, setRange] = useState(() => resolveDateRangePreset('last30'));
  const [sourceFilter, setSourceFilter] = useState<LeadSource[]>([]);

  const leadsInRange = useMemo(
    () => leads.filter((lead) => isWithinDateRange(lead.createdAt, range)),
    [leads, range],
  );

  const filteredLeads = useMemo(
    () => (sourceFilter.length === 0 ? leadsInRange : leadsInRange.filter((lead) => sourceFilter.includes(lead.source))),
    [leadsInRange, sourceFilter],
  );

  const wonLeads = leadsInRange.filter((lead) => lead.stage === 'won');
  const lostLeads = leadsInRange.filter((lead) => lead.stage === 'lost');
  const conversionRate = wonLeads.length + lostLeads.length > 0
    ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100)
    : 0;
  const avgEstimatedValue = leadsInRange.length > 0
    ? leadsInRange.reduce((sum, lead) => sum + lead.value, 0) / leadsInRange.length
    : 0;

  const sourceBreakdown = useMemo(() => {
    const counts = new Map<LeadSource, number>();
    for (const lead of leadsInRange) counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    return Array.from(counts, ([source, count]) => ({ label: source, value: count }));
  }, [leadsInRange]);

  const columns: DataTableColumn<Lead>[] = [
    {
      id: 'name',
      header: 'Lead',
      hideable: false,
      sortValue: (row) => row.name,
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{row.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      id: 'stage',
      header: 'Stage',
      sortValue: (row) => row.stage,
      cell: (row) => <StatusBadge label={LEAD_STAGE_LABEL[row.stage]} tone={LEAD_STAGE_TONE[row.stage]} />,
    },
    {
      id: 'source',
      header: 'Source',
      sortValue: (row) => row.source,
      cell: (row) => row.source,
    },
    {
      id: 'owner',
      header: 'Owner',
      sortValue: (row) => row.owner,
      cell: (row) => row.owner,
    },
    {
      id: 'value',
      header: 'Est. value',
      align: 'right',
      sortValue: (row) => row.value,
      cell: (row) => formatCompactCurrency(row.value),
    },
    {
      id: 'createdAt',
      header: 'Created',
      align: 'right',
      sortValue: (row) => row.createdAt,
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <DateRangePicker value={range} onChange={setRange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads in range" value={String(leadsInRange.length)} icon={Users} />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} icon={Percent} />
        <StatCard label="Avg est. value" value={formatCompactCurrency(avgEstimatedValue)} icon={TrendingUp} />
        <StatCard label="Won this range" value={String(wonLeads.length)} icon={Target} />
      </div>

      <ChartCard title="Leads by source" description="Count of leads created in the selected range">
        <CategoryBarChart data={sourceBreakdown} />
      </ChartCard>

      <DataTable
        isLoading={isLoading}
        data={filteredLeads}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.name} ${row.company} ${row.owner}`}
        searchPlaceholder="Search leads…"
        pageSize={8}
        emptyState={{ title: 'No leads in this range', description: 'Try widening the date range or clearing a filter.' }}
        toolbarExtra={
          <FilterDropdown
            label="Source"
            options={LEAD_SOURCE_OPTIONS}
            selected={sourceFilter}
            onChange={setSourceFilter}
          />
        }
      />
    </div>
  );
}
