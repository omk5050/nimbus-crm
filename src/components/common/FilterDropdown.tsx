import { ListFilter } from 'lucide-react';
import { Popover } from '@/components/common/Popover';
import { Checkbox } from '@/components/inputs/Checkbox';
import type { SelectOption } from '@/types/common.types';
import { cn } from '@/utils/cn';

interface FilterDropdownProps<T extends string = string> {
  label: string;
  options: SelectOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

/** Table-toolbar multi-select filter (status, assignee, department…). Shows an active count badge. */
export function FilterDropdown<T extends string = string>({
  label,
  options,
  selected,
  onChange,
}: FilterDropdownProps<T>) {
  function toggleValue(value: T) {
    onChange(
      selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value],
    );
  }

  return (
    <Popover
      align="start"
      panelClassName="w-56 p-1.5"
      trigger={({ toggle, isOpen }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors',
            'hover:bg-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <ListFilter size={15} className="text-muted-foreground" />
          {label}
          {selected.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
              {selected.length}
            </span>
          )}
        </button>
      )}
    >
      {() => (
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <li key={option.value}>
                <Checkbox
                  label={option.label}
                  checked={selected.includes(option.value)}
                  onChange={() => toggleValue(option.value)}
                  containerClassName="w-full rounded-md px-2 py-2 text-sm text-popover-foreground hover:bg-accent/60"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Popover>
  );
}
