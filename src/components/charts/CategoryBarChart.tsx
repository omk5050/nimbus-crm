import { motion } from 'motion/react';

export interface CategoryBarDatum {
  label: string;
  value: number;
}

interface CategoryBarChartProps {
  data: CategoryBarDatum[];
  /** Formats the value shown next to each bar, e.g. currency vs a plain count. */
  formatValue?: (value: number) => string;
}

/** Horizontal bars, longest first, each animating in from zero width on mount. */
export function CategoryBarChart({ data, formatValue = String }: CategoryBarChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((row) => row.value), 1);

  if (sorted.every((row) => row.value === 0)) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No data in this range</p>;
  }

  return (
    <div className="flex h-full flex-col justify-center gap-4">
      {sorted.map((row, index) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-card-foreground">{row.label}</span>
            <span className="text-muted-foreground">{formatValue(row.value)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(row.value / max) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
