import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

/** Base pulsing placeholder block. Compose with className to shape it (h-4 w-32, rounded-full, etc). */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />;
}

interface SkeletonTextProps {
  /** Number of lines to render. */
  lines?: number;
  className?: string;
}

/** A block of skeleton text lines, the last one shorter to mimic a natural paragraph end. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-3.5 w-full', index === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}
