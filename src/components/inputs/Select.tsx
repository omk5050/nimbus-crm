import { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover } from '@/components/common/Popover';
import type { SelectOption } from '@/types/common.types';
import { cn } from '@/utils/cn';

interface SelectProps<T extends string = string> {
  label?: string;
  value: T | null;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function Select<T extends string = string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  error,
  disabled,
}: SelectProps<T>) {
  const id = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <Popover
        className="w-full"
        panelClassName="w-full max-h-64 overflow-y-auto p-1"
        trigger={({ toggle, isOpen }) => (
          <button
            id={id}
            type="button"
            disabled={disabled}
            onClick={toggle}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-invalid={Boolean(error)}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive',
              !selected && 'text-muted-foreground',
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronDown size={16} className="ml-2 shrink-0 text-muted-foreground" />
          </button>
        )}
      >
        {({ close }) => (
          <ul role="listbox">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      close();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                      isSelected
                        ? 'bg-accent text-accent-foreground'
                        : 'text-popover-foreground hover:bg-accent/60',
                    )}
                  >
                    {option.label}
                    {isSelected && <Check size={14} />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Popover>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
