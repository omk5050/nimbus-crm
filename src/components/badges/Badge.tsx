import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { StatusTone } from '@/types/common.types';

interface BadgeProps {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}

// Semantic tokens (success/warning/destructive/…) already re-theme via the
// CSS variable swap in .dark — no dark: prefixes needed here. Only the fixed
// brand scale needs an explicit dark variant.
const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/15 text-destructive',
};

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium leading-none',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
