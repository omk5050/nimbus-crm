import { motion } from 'motion/react';
import type { LeadSourceBreakdown } from '@/types/dashboard.types';

interface LeadSourceBarChartProps {
  data: LeadSourceBreakdown[];
}

export function LeadSourceBarChart({ data }: LeadSourceBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full min-h-[180px] w-full items-center justify-center text-sm text-muted-foreground">
        No lead sources recorded yet.
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...sorted.map((row) => row.count));
  const total = Math.max(1, sorted.reduce((sum, row) => sum + row.count, 0));

  return (
    <div className="flex h-full flex-col justify-center gap-4">
      {sorted.map((row, index) => {
        const widthPct = (row.count / max) * 100;
        const sharePct = Math.round((row.count / total) * 100);

        return (
          <div key={row.source} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-card-foreground">{row.source}</span>
              <span className="text-muted-foreground">
                {row.count} <span className="text-muted-foreground/70">({sharePct}%)</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
