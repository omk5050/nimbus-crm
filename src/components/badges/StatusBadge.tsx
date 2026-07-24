import { Badge } from '@/components/badges/Badge';
import type { StatusTone } from '@/types/common.types';
import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

const DOT_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-muted-foreground',
  info: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
};

/**
 * Domain-status variant of <Badge>, with a leading dot for faster scanning down a
 * table column. Feature pages (Leads, Tasks, Sales…) map their own status enums to a
 * StatusTone and pass the human label straight through.
 */
export function StatusBadge({ label, tone = 'neutral', className }: StatusBadgeProps) {
  return (
    <Badge tone={tone} className={cn('gap-1.5', className)}>
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', DOT_CLASSES[tone])} />
      {label}
    </Badge>
  );
}
