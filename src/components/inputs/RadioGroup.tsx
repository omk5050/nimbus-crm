import { useId } from 'react';
import type { SelectOption } from '@/types/common.types';
import { cn } from '@/utils/cn';

interface RadioGroupProps<T extends string = string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  direction?: 'row' | 'column';
  error?: string;
}

export function RadioGroup<T extends string = string>({
  label,
  value,
  onChange,
  options,
  direction = 'column',
  error,
}: RadioGroupProps<T>) {
  const name = useId();

  return (
    <fieldset className="flex flex-col gap-2">
      {label && <legend className="text-sm font-medium text-foreground">{label}</legend>}
      <div className={cn('flex gap-3', direction === 'column' ? 'flex-col' : 'flex-row flex-wrap')}>
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <label
              key={option.value}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground"
            >
              <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
                <input
                  type="radio"
                  name={name}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className={cn(
                    'peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-input bg-background',
                    'checked:border-[5px] checked:border-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  )}
                />
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </fieldset>
  );
}
