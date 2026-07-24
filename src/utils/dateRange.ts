export interface DateRange {
  /** ISO date (day only), inclusive. */
  from: string;
  /** ISO date (day only), inclusive. */
  to: string;
}

export type DateRangePresetId = 'last7' | 'last30' | 'thisMonth' | 'thisQuarter' | 'allTime';

export interface DateRangePreset {
  id: DateRangePresetId;
  label: string;
}

export const DATE_RANGE_PRESETS: DateRangePreset[] = [
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last30', label: 'Last 30 days' },
  { id: 'thisMonth', label: 'This month' },
  { id: 'thisQuarter', label: 'This quarter' },
  { id: 'allTime', label: 'All time' },
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** A date far enough in the past to include any realistic mock data, used as the lower bound for "All time". */
const EPOCH_FLOOR = '2000-01-01';

export function resolveDateRangePreset(preset: DateRangePresetId): DateRange {
  const now = new Date();
  const today = toIsoDate(now);

  switch (preset) {
    case 'last7': {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      return { from: toIsoDate(from), to: today };
    }
    case 'last30': {
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      return { from: toIsoDate(from), to: today };
    }
    case 'thisMonth': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: toIsoDate(from), to: today };
    }
    case 'thisQuarter': {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const from = new Date(now.getFullYear(), quarterStartMonth, 1);
      return { from: toIsoDate(from), to: today };
    }
    case 'allTime':
      return { from: EPOCH_FLOOR, to: today };
  }
}

/** Compares by date only (string prefix), so both ISO dates and ISO datetimes work as input. */
export function isWithinDateRange(isoDateOrDateTime: string, range: DateRange): boolean {
  const date = isoDateOrDateTime.slice(0, 10);
  return date >= range.from && date <= range.to;
}
