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

export function formatCurrency(value?: number | null): string {
  if (value == null || isNaN(value)) return '$0';
  return currencyFormatter.format(value);
}

/** e.g. 284650 -> "$284.7K" — used where space is tight (chart axes, tooltips). */
export function formatCompactCurrency(value?: number | null): string {
  if (value == null || isNaN(value)) return '$0';
  return compactCurrencyFormatter.format(value);
}

export function formatCompactNumber(value?: number | null): string {
  if (value == null || isNaN(value)) return '0';
  return compactNumberFormatter.format(value);
}

export function formatSignedPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value}%`;
}

import { usePreferencesStore } from '@/store/preferences.store';

function parseDate(iso?: string | null): Date | null {
  if (!iso) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDate(iso?: string | null): string {
  const d = parseDate(iso);
  if (!d) return '—';

  const format = usePreferencesStore.getState().dateFormat;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'DMY') {
    return `${day}/${month}/${year}`;
  }
  return `${month}/${day}/${year}`;
}

export function formatDateTime(iso?: string | null): string {
  const d = parseDate(iso);
  if (!d) return '—';

  const format = usePreferencesStore.getState().dateFormat;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const dateStr = format === 'DMY' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
  return `${dateStr}, ${hours}:${minutes} ${ampm}`;
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
