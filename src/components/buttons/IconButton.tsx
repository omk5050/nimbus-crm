import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  /** Required — this button shows no text, so its accessible name must come from here. */
  label: string;
  variant?: 'ghost' | 'solid';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = 'ghost', className, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.1 }}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'ghost' &&
          'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        variant === 'solid' && 'bg-primary text-primary-foreground hover:opacity-90',
        className,
      )}
      {...props}
    >
      {icon}
    </motion.button>
  ),
);

IconButton.displayName = 'IconButton';
