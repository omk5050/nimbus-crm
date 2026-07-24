import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { Plus, Trash2, Pencil, LayoutGrid, List as ListIcon } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { DealFormDrawer } from '@/pages/sales/components/DealFormDrawer';
import { DealKanbanBoard } from '@/pages/sales/components/kanban/DealKanbanBoard';
import { useSalesStore } from '@/store/sales.store';
import { toast } from '@/store/toast.store';
import { DEAL_STAGE_LABEL, DEAL_STAGE_OPTIONS, DEAL_STAGE_TONE } from '@/constants/sales.constants';
import type { Deal, DealStage } from '@/types/sales.types';
import { formatCompactCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

type ViewMode = 'kanban' | 'list';

export default function DealsPage() {
  const isLoading = useSimulatedLoading();
  const deals = useSalesStore((state) => state.deals);
  const deleteDeal = useSalesStore((state) => state.deleteDeal);

  const [view, setView] = useState<ViewMode>('kanban');
  const [stageFilter, setStageFilter] = useState<DealStage[]>([]);
  const [drawerDeal, setDrawerDeal] = useState<Deal | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Deal | null>(null);

  const filteredDeals = useMemo(() => {
    if (stageFilter.length === 0) return deals;
    return deals.filter((deal) => stageFilter.includes(deal.stage));
  }, [deals, stageFilter]);

  function openEdit(deal: Deal) {
    setDrawerDeal(deal);
  }

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
      id: 'expectedCloseDate',
      header: 'Expected close',
      align: 'right',
      sortValue: (row) => row.expectedCloseDate ?? '',
      cell: (row) => (row.expectedCloseDate ? formatDate(row.expectedCloseDate) : '—'),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {deals.length} deal{deals.length === 1 ? '' : 's'} · {formatCompactCurrency(
              deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0),
            )}{' '}
            open pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            <button
              type="button"
              onClick={() => setView('kanban')}
              className={cn(
                'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'kanban'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <LayoutGrid size={14} />
              Pipeline
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
                view === 'list'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <ListIcon size={14} />
              Table
            </button>
          </div>
          <Button onClick={() => setDrawerDeal('new')}>
            <Plus size={16} />
            Add deal
          </Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <DealKanbanBoard deals={filteredDeals} onCardClick={(dealId) => {
          const deal = deals.find((entry) => entry.id === dealId);
          if (deal) openEdit(deal);
        }} />
      ) : (
        <DataTable
          isLoading={isLoading}
          data={filteredDeals}
          columns={columns}
          getRowId={(row) => row.id}
          getSearchableText={(row) => `${row.title} ${row.company} ${row.owner}`}
          searchPlaceholder="Search deals…"
          onRowClick={openEdit}
          pageSize={8}
          emptyState={{
            title: 'No deals match your filters',
            description: 'Try clearing a filter or adding a new deal.',
          }}
          toolbarExtra={
            <FilterDropdown
              label="Stage"
              options={DEAL_STAGE_OPTIONS}
              selected={stageFilter}
              onChange={setStageFilter}
            />
          }
          rowActions={(row) => [
            { label: 'Edit', icon: Pencil, onSelect: () => openEdit(row) },
            {
              label: 'Delete',
              icon: Trash2,
              tone: 'danger',
              onSelect: () => setPendingDelete(row),
            },
          ]}
        />
      )}

      <DealFormDrawer
        isOpen={drawerDeal !== null}
        onClose={() => setDrawerDeal(null)}
        deal={drawerDeal === 'new' || drawerDeal === null ? undefined : drawerDeal}
      />

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this deal?"
        description={pendingDelete ? `This removes "${pendingDelete.title}" from your pipeline. This can't be undone.` : undefined}
        confirmLabel="Delete deal"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteDeal(pendingDelete.id);
          toast.success('Deal deleted', { description: `"${pendingDelete.title}" was removed.` });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
