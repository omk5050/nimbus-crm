import { useMemo, useState } from 'react';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { DollarSign, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { ChartCard } from '@/components/cards/ChartCard';
import { DataTable } from '@/components/tables/DataTable';
import type { DataTableColumn } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Badge } from '@/components/badges/Badge';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { useSalesStore } from '@/store/sales.store';
import {
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_TONE,
} from '@/constants/sales.constants';
import type { Payment } from '@/types/sales.types';
import { resolveDateRangePreset, isWithinDateRange } from '@/utils/dateRange';
import { bucketPaymentsByPeriod, calculateLineItemsTotal } from '@/utils/sales';
import { formatCompactCurrency, formatCurrency } from '@/utils/format';

export default function RevenueReportPage() {
  const isLoading = useSimulatedLoading();
  const payments = useSalesStore((state) => state.payments);
  const invoices = useSalesStore((state) => state.invoices);
  const [range, setRange] = useState(() => resolveDateRangePreset('last30'));

  const paymentsInRange = useMemo(
    () => payments.filter((payment) => isWithinDateRange(payment.createdAt, range)),
    [payments, range],
  );

  const completedInRange = paymentsInRange.filter((payment) => payment.status === 'completed');
  const totalCollected = completedInRange.reduce((sum, payment) => sum + payment.amount, 0);
  const avgPayment = completedInRange.length > 0 ? totalCollected / completedInRange.length : 0;

  const outstandingBalance = useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((sum, invoice) => {
        const total = calculateLineItemsTotal(invoice.items);
        const paid = payments
          .filter((payment) => payment.invoiceId === invoice.id && payment.status === 'completed')
          .reduce((paidSum, payment) => paidSum + payment.amount, 0);
        return sum + Math.max(total - paid, 0);
      }, 0);
  }, [invoices, payments]);

  const revenueTrend = useMemo(
    () => bucketPaymentsByPeriod(payments, range).map((bucket) => ({ month: bucket.label, revenue: bucket.revenue })),
    [payments, range],
  );

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
  ];

  return (
    <div className="flex flex-col gap-5">
      <DateRangePicker value={range} onChange={setRange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Collected in range" value={formatCompactCurrency(totalCollected)} icon={DollarSign} />
        <StatCard label="Outstanding" value={formatCompactCurrency(outstandingBalance)} icon={Wallet} />
        <StatCard label="Avg payment" value={formatCompactCurrency(avgPayment)} icon={TrendingUp} />
        <StatCard label="Payments in range" value={String(paymentsInRange.length)} icon={Receipt} />
      </div>

      <ChartCard title="Revenue trend" description="Completed payments over the selected range">
        {revenueTrend.length > 0 ? (
          <RevenueAreaChart data={revenueTrend} />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">No completed payments in this range</p>
        )}
      </ChartCard>

      <DataTable
        isLoading={isLoading}
        data={paymentsInRange}
        columns={columns}
        getRowId={(row) => row.id}
        getSearchableText={(row) => `${row.invoiceNumber} ${row.customerName} ${row.company}`}
        searchPlaceholder="Search payments…"
        pageSize={8}
        emptyState={{ title: 'No payments in this range', description: 'Try widening the date range.' }}
      />
    </div>
  );
}
