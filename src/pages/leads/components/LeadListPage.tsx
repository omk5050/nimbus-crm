import { useEffect, useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useNavigate, useSearchParams } from 'react-router';
import { Plus, Trash2, Eye, Pencil, LayoutGrid, List as ListIcon } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { LeadFormDrawer } from '@/pages/leads/components/LeadFormDrawer';
import { LeadKanbanBoard } from '@/pages/leads/components/kanban/LeadKanbanBoard';
import { useLeadsStore } from '@/store/leads.store';
import { toast } from '@/store/toast.store';
import { leadDetailRoute } from '@/constants/routes.constants';
import {
  LEAD_SOURCE_OPTIONS,
  LEAD_STAGE_LABEL,
  LEAD_STAGE_OPTIONS,
  LEAD_STAGE_TONE,
} from '@/constants/lead.constants';
import type { Lead, LeadSource, LeadStage } from '@/types/lead.types';
import { formatCompactCurrency, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

type ViewMode = 'kanban' | 'list';

export default function LeadListPage() {
  const isLoading = useSimulatedLoading();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const leads = useLeadsStore((state) => state.leads);
  const deleteLead = useLeadsStore((state) => state.deleteLead);

  const [view, setView] = useState<ViewMode>('kanban');
  const [stageFilter, setStageFilter] = useState<LeadStage[]>([]);
  const [sourceFilter, setSourceFilter] = useState<LeadSource[]>([]);
  const [drawerLead, setDrawerLead] = useState<Lead | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);

  // Lets the Dashboard's "Create Lead" quick action deep-link straight into this drawer.
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setDrawerLead('new');
      setSearchParams((params) => {
        params.delete('new');
        return params;
      });
    }
  }, [searchParams, setSearchParams]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStage = stageFilter.length === 0 || stageFilter.includes(lead.stage);
      const matchesSource = sourceFilter.length === 0 || sourceFilter.includes(lead.source);
      return matchesStage && matchesSource;
    });
  }, [leads, stageFilter, sourceFilter]);

  const columns: DataTableColumn<Lead>[] = [
    {
      id: 'name',
      header: 'Lead',
      hideable: false,
      sortValue: (row) => row.name,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'company',
      header: 'Company',
      sortValue: (row) => row.company,
      cell: (row) => row.company,
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
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} lead{leads.length === 1 ? '' : 's'} in your pipeline
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
              Board
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
              List
            </button>
          </div>
          <Button onClick={() => setDrawerLead('new')}>
            <Plus size={16} />
            Add lead
          </Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <>
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Source"
              options={LEAD_SOURCE_OPTIONS}
              selected={sourceFilter}
              onChange={setSourceFilter}
            />
          </div>
          <LeadKanbanBoard
            leads={filteredLeads}
            onCardClick={(leadId) => navigate(leadDetailRoute(leadId))}
          />
        </>
      ) : (
        <DataTable
          isLoading={isLoading}
          data={filteredLeads}
          columns={columns}
          getRowId={(row) => row.id}
          getSearchableText={(row) => `${row.name} ${row.company} ${row.email} ${row.owner}`}
          searchPlaceholder="Search leads…"
          onRowClick={(row) => navigate(leadDetailRoute(row.id))}
          pageSize={8}
          emptyState={{
            title: 'No leads match your filters',
            description: 'Try clearing a filter or adding a new lead.',
          }}
          toolbarExtra={
            <>
              <FilterDropdown
                label="Stage"
                options={LEAD_STAGE_OPTIONS}
                selected={stageFilter}
                onChange={setStageFilter}
              />
              <FilterDropdown
                label="Source"
                options={LEAD_SOURCE_OPTIONS}
                selected={sourceFilter}
                onChange={setSourceFilter}
              />
            </>
          }
          rowActions={(row) => [
            { label: 'View details', icon: Eye, onSelect: () => navigate(leadDetailRoute(row.id)) },
            { label: 'Edit', icon: Pencil, onSelect: () => setDrawerLead(row) },
            {
              label: 'Delete',
              icon: Trash2,
              tone: 'danger',
              onSelect: () => setPendingDelete(row),
            },
          ]}
        />
      )}

      <LeadFormDrawer
        isOpen={drawerLead !== null}
        onClose={() => setDrawerLead(null)}
        lead={drawerLead === 'new' || drawerLead === null ? undefined : drawerLead}
        onCreated={(created) => navigate(leadDetailRoute(created.id))}
      />

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this lead?"
        description={
          pendingDelete
            ? `This removes ${pendingDelete.name} (${pendingDelete.company}) from your pipeline. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete lead"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteLead(pendingDelete.id);
          toast.success('Lead deleted', { description: `${pendingDelete.name} was removed.` });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
