import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { cn } from '@/utils/cn';

export interface StatCardTrend {
  /** Signed or unsigned percentage/number — component adds the +/- and color. */
  value: number;
  /** e.g. "vs last month" */
  label?: string;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: StatCardTrend;
  className?: string;
}

/** Single KPI tile: "Total Revenue", "New Leads", "Open Deals", etc. Grid these in the dashboard. */
export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : null;

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon size={17} />
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight text-card-foreground">
          {value}
        </span>

        {trend && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isPositive ? 'text-success' : 'text-destructive',
            )}
          >
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>

      {trend?.label && <span className="text-xs text-muted-foreground/80">{trend.label}</span>}
    </Card>
  );
}
