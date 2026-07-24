import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { Briefcase, Percent, Target, Trophy } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { ChartCard } from '@/components/cards/ChartCard';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { useSalesStore } from '@/store/sales.store';
import { DEAL_STAGE_LABEL, DEAL_STAGE_OPTIONS, DEAL_STAGE_TONE } from '@/constants/sales.constants';
import type { Deal, DealStage } from '@/types/sales.types';
import { resolveDateRangePreset, isWithinDateRange } from '@/utils/dateRange';
import { formatCompactCurrency, formatDate } from '@/utils/format';

export default function SalesReportPage() {
  const isLoading = useSimulatedLoading();
  const deals = useSalesStore((state) => state.deals);
  const [range, setRange] = useState(() => resolveDateRangePreset('last30'));
  const [stageFilter, setStageFilter] = useState<DealStage[]>([]);

  const dealsInRange = useMemo(
    () => deals.filter((deal) => isWithinDateRange(deal.createdAt, range)),
    [deals, range],
  );

  const filteredDeals = useMemo(
    () => (stageFilter.length === 0 ? dealsInRange : dealsInRange.filter((deal) => stageFilter.includes(deal.stage))),
    [dealsInRange, stageFilter],
  );

  const wonDeals = dealsInRange.filter((deal) => deal.stage === 'won');
  const lostDeals = dealsInRange.filter((deal) => deal.stage === 'lost');
  const openValue = dealsInRange
    .filter((deal) => deal.stage !== 'won' && deal.stage !== 'lost')
    .reduce((sum, deal) => sum + deal.value, 0);
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const winRate = wonDeals.length + lostDeals.length > 0
    ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
    : 0;

  const stageBreakdown = useMemo(() => {
    const counts = new Map<DealStage, number>();
    for (const deal of dealsInRange) counts.set(deal.stage, (counts.get(deal.stage) ?? 0) + 1);
    return Array.from(counts, ([stage, count]) => ({ label: DEAL_STAGE_LABEL[stage], value: count }));
  }, [dealsInRange]);

  const columns: DataTableColumn<Deal>[] = [
    {
      id: 'title',
      header: 'Deal',
      hideable: false,
      sortValue: (row) => row.title,
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{row.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      id: 'stage',
      header: 'Stage',
      sortValue: (row) => row.stage,
      cell: (row) => <StatusBadge label={DEAL_STAGE_LABEL[row.stage]} tone={DEAL_STAGE_TONE[row.stage]} />,
    },
    {
      id: 'owner',
      header: 'Owner',
      sortValue: (row) => row.owner,
      cell: (row) => row.owner,
    },
    {
      id: 'value',
      header: 'Value',
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
        <StatCard label="Open pipeline" value={formatCompactCurrency(openValue)} icon={Briefcase} />
        <StatCard label="Won value" value={formatCompactCurrency(wonValue)} icon={Trophy} />
        <StatCard label="Win rate" value={`${winRate}%`} icon={Percent} />
        <StatCard label="Deals in range" value={String(dealsInRange.length)} icon={Target} />
      </div>

      <ChartCard title="Deals by stage" description="Count of deals created in the selected range">
        <CategoryBarChart data={stageBreakdown} />
      </ChartCard>

      <DataTable
        isLoading={isLoading}
        data={filteredDeals}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.title} ${row.company} ${row.owner}`}
        searchPlaceholder="Search deals…"
        pageSize={8}
        emptyState={{ title: 'No deals in this range', description: 'Try widening the date range or clearing a filter.' }}
        toolbarExtra={
          <FilterDropdown
            label="Stage"
            options={DEAL_STAGE_OPTIONS}
            selected={stageFilter}
            onChange={setStageFilter}
          />
        }
      />
    </div>
  );
}
