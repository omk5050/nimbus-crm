import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label for screen readers — the spinner itself has no visible text. */
  label?: string;
}

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 14,
  md: 20,
  lg: 28,
};

/** Inline spinner for buttons, cards, and table bodies. For full-page loads, use <PageLoader />. */
export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center justify-center">
      <Loader2 size={SIZE_PX[size]} className={cn('animate-spin text-primary', className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
