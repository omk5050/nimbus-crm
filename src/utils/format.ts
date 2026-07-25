/**
 * Shared number/currency formatters. Centralized here so every module that
 * ever shows money (Dashboard, Sales, Reports, Invoices…) formats it the
 * same way instead of each page rolling its own `Intl.NumberFormat` call.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** e.g. 284650 -> "$284.7K" — used where space is tight (chart axes, tooltips). */
export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

export function formatSignedPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value}%`;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return dateFormatter.format(d);
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return dateTimeFormatter.format(d);
}

/** "3h ago", "12m ago", "Yesterday", falling back to a short date beyond 6 days. */
export function formatRelativeTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}
