import type { LineItem, LineItemFormValues, Payment } from '@/types/sales.types';
import type { DateRange } from '@/utils/dateRange';
import { isWithinDateRange } from '@/utils/dateRange';

export function calculateLineItemsTotal(items: Array<LineItem | LineItemFormValues>): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/** e.g. "Q-2026-0148" — sequential-looking but random enough to avoid mock-data collisions. */
export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(1000 + Math.random() * 8999);
  return `Q-${year}-${sequence}`;
}

/** e.g. "INV-2299" */
export function generateInvoiceNumber(): string {
  const sequence = Math.floor(1000 + Math.random() * 8999);
  return `INV-${sequence}`;
}

export interface RevenueBucket {
  label: string;
  revenue: number;
}

/**
 * Buckets completed payments by day when the range spans a month or less
 * (so short ranges like "Last 7 days" still show meaningful granularity),
 * otherwise by month. Only completed payments count toward revenue.
 */
export function bucketPaymentsByPeriod(payments: Payment[], range: DateRange): RevenueBucket[] {
  const completed = payments.filter(
    (payment) => payment.status === 'completed' && isWithinDateRange(payment.createdAt, range),
  );

  const spanDays =
    (new Date(range.to).getTime() - new Date(range.from).getTime()) / (1000 * 60 * 60 * 24);
  const byDay = spanDays <= 31;

  // Keyed by a sortable ISO prefix (YYYY-MM-DD or YYYY-MM) so buckets can be ordered
  // chronologically regardless of the order payments appear in the input array.
  const buckets = new Map<string, { label: string; revenue: number }>();
  for (const payment of completed) {
    const date = new Date(payment.createdAt);
    const sortKey = payment.createdAt.slice(0, byDay ? 10 : 7);
    const label = byDay
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    const existing = buckets.get(sortKey);
    buckets.set(sortKey, { label, revenue: (existing?.revenue ?? 0) + payment.amount });
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, bucket]) => bucket);
}
