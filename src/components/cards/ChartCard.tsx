import type { ReactNode } from 'react';
import { Card, CardHeader } from '@/components/cards/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { cn } from '@/utils/cn';

interface ChartCardProps {
  title: string;
  description?: string;
  /** Rendered next to the title — a period selector, a legend, an export button, etc. */
  action?: ReactNode;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
  /** Fixed height for the chart area so cards in a grid stay aligned. */
  minHeight?: number;
}

/**
 * Chart panel shell. Charts themselves (Phase 3+) are handed in as `children` — this
 * component only owns the card chrome, loading state, and consistent sizing so every
 * chart on the dashboard/reports pages lines up.
 */
export function ChartCard({
  title,
  description,
  action,
  isLoading = false,
  children,
  className,
  minHeight = 280,
}: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader title={title} description={description} action={action} />

      <div style={{ minHeight }} className="flex-1">
        {isLoading ? (
          <div className="flex h-full flex-col justify-end gap-2 py-2">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
