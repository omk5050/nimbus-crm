import { useEffect, useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useNavigate, useSearchParams } from 'react-router';
import { Plus, Trash2, Eye, Pencil } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { Button } from '@/components/buttons/Button';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { CustomerFormDrawer } from '@/pages/customers/components/CustomerFormDrawer';
import { useCustomersStore } from '@/store/customers.store';
import { toast } from '@/store/toast.store';
import { customerDetailRoute } from '@/constants/routes.constants';
import {
  CUSTOMER_INDUSTRY_OPTIONS,
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUS_OPTIONS,
  CUSTOMER_STATUS_TONE,
} from '@/constants/customer.constants';
import type { Customer, CustomerIndustry, CustomerStatus } from '@/types/customer.types';
import { formatCurrency, formatDate } from '@/utils/format';

export default function CustomerListPage() {
  const isLoading = useSimulatedLoading();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const customers = useCustomersStore((state) => state.customers);
  const deleteCustomer = useCustomersStore((state) => state.deleteCustomer);

  const [statusFilter, setStatusFilter] = useState<CustomerStatus[]>([]);
  const [industryFilter, setIndustryFilter] = useState<CustomerIndustry[]>([]);
  const [drawerCustomer, setDrawerCustomer] = useState<Customer | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null);

  // Lets the Dashboard's "Add Customer" quick action deep-link straight into this drawer.
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setDrawerCustomer('new');
      setSearchParams((params) => {
        params.delete('new');
        return params;
      });
    }
  }, [searchParams, setSearchParams]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status);
      const matchesIndustry = industryFilter.length === 0 || industryFilter.includes(customer.industry);
      return matchesStatus && matchesIndustry;
    });
  }, [customers, statusFilter, industryFilter]);

  const columns: DataTableColumn<Customer>[] = [
    {
      id: 'name',
      header: 'Customer',
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
      id: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      cell: (row) => (
        <StatusBadge label={CUSTOMER_STATUS_LABEL[row.status]} tone={CUSTOMER_STATUS_TONE[row.status]} />
      ),
    },
    {
      id: 'industry',
      header: 'Industry',
      sortValue: (row) => row.industry,
      cell: (row) => row.industry,
    },
    {
      id: 'owner',
      header: 'Owner',
      sortValue: (row) => row.owner,
      cell: (row) => row.owner,
    },
    {
      id: 'lifetimeValue',
      header: 'Lifetime value',
      align: 'right',
      sortValue: (row) => row.lifetimeValue,
      cell: (row) => formatCurrency(row.lifetimeValue),
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
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length} account{customers.length === 1 ? '' : 's'} across your workspace
          </p>
        </div>
        <Button onClick={() => setDrawerCustomer('new')}>
          <Plus size={16} />
          Add customer
        </Button>
      </div>

      <DataTable
        isLoading={isLoading}
        data={filteredCustomers}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.name} ${row.company} ${row.email} ${row.owner}`}
        searchPlaceholder="Search customers…"
        onRowClick={(row) => navigate(customerDetailRoute(row.id))}
        pageSize={8}
        emptyState={{
          title: 'No customers match your filters',
          description: 'Try clearing a filter or adding a new customer.',
        }}
        toolbarExtra={
          <>
            <FilterDropdown
              label="Status"
              options={CUSTOMER_STATUS_OPTIONS}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Industry"
              options={CUSTOMER_INDUSTRY_OPTIONS}
              selected={industryFilter}
              onChange={setIndustryFilter}
            />
          </>
        }
        rowActions={(row) => [
          { label: 'View profile', icon: Eye, onSelect: () => navigate(customerDetailRoute(row.id)) },
          { label: 'Edit', icon: Pencil, onSelect: () => setDrawerCustomer(row) },
          {
            label: 'Delete',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => setPendingDelete(row),
          },
        ]}
      />

      <CustomerFormDrawer
        isOpen={drawerCustomer !== null}
        onClose={() => setDrawerCustomer(null)}
        customer={drawerCustomer === 'new' || drawerCustomer === null ? undefined : drawerCustomer}
        onCreated={(created) => navigate(customerDetailRoute(created.id))}
      />

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this customer?"
        description={
          pendingDelete
            ? `This removes ${pendingDelete.name} (${pendingDelete.company}) and their notes and timeline. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete customer"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteCustomer(pendingDelete.id);
          toast.success('Customer deleted', { description: `${pendingDelete.name} was removed.` });
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
