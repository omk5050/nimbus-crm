import { DataTable } from '@/components/tables/DataTable';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Badge } from '@/components/badges/Badge';
import { useSalesStore } from '@/store/sales.store';
import {
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_TONE,
} from '@/constants/sales.constants';
import type { Payment } from '@/types/sales.types';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function PaymentsPage() {
  const isLoading = useSimulatedLoading();
  const payments = useSalesStore((state) => state.payments);

  const totalCollected = payments
    .filter((payment) => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const columns: DataTableColumn<Payment>[] = [
    {
      id: 'invoiceNumber',
      header: 'Invoice #',
      hideable: false,
      sortValue: (row) => row.invoiceNumber,
      cell: (row) => <span className="font-medium text-foreground">{row.invoiceNumber}</span>,
    },
    {
      id: 'customer',
      header: 'Customer',
      sortValue: (row) => row.customerName,
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-foreground">{row.customerName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      align: 'right',
      sortValue: (row) => row.amount,
      cell: (row) => <span className="font-medium text-foreground">{formatCurrency(row.amount)}</span>,
    },
    {
      id: 'method',
      header: 'Method',
      sortValue: (row) => row.method,
      cell: (row) => <Badge tone="neutral">{PAYMENT_METHOD_LABEL[row.method]}</Badge>,
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (row) => row.status,
      cell: (row) => (
        <StatusBadge label={PAYMENT_STATUS_LABEL[row.status]} tone={PAYMENT_STATUS_TONE[row.status]} />
      ),
    },
    {
      id: 'createdAt',
      header: 'Date',
      align: 'right',
      sortValue: (row) => row.createdAt,
      cell: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        {payments.length} payment{payments.length === 1 ? '' : 's'} ·{' '}
        <span className="font-medium text-foreground">{formatCurrency(totalCollected)}</span> collected
      </p>

      <DataTable
        isLoading={isLoading}
        data={payments}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.invoiceNumber} ${row.customerName} ${row.company}`}
        searchPlaceholder="Search payments…"
        pageSize={8}
        emptyState={{
          title: 'No payments recorded yet',
          description: 'Payments appear here once you record one against an invoice.',
        }}
      />
    </div>
  );
}
