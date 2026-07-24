import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /**
   * Classes for the outer <label> (full-width rows, padding, hover states — e.g. inside a
   * dropdown list). Do NOT wrap <Checkbox> in another <label> to achieve this: nested labels
   * cause double-toggle clicks, since both labels forward the click to the input.
   */
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn('inline-flex cursor-pointer items-center gap-2', containerClassName)}
      >
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-input bg-background',
              'checked:border-primary checked:bg-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              className,
            )}
            {...props}
          />
          <Check
            size={12}
            strokeWidth={3}
            className="pointer-events-none absolute text-primary-foreground opacity-0 peer-checked:opacity-100"
          />
        </span>
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
