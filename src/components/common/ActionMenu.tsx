import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Popover } from '@/components/common/Popover';
import { IconButton } from '@/components/buttons/IconButton';
import { cn } from '@/utils/cn';

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  label?: string;
}

/** The three-dot row/card action menu used throughout the tables in later phases. */
export function ActionMenu({ items, label = 'Open actions' }: ActionMenuProps) {
  return (
    <Popover
      align="end"
      panelClassName="w-48 p-1.5"
      trigger={({ toggle }) => (
        <IconButton icon={<MoreHorizontal size={16} />} label={label} onClick={toggle} />
      )}
    >
      {({ close }) => (
        <div className="flex flex-col">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  close();
                  item.onSelect();
                }}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  'disabled:pointer-events-none disabled:opacity-50',
                  item.tone === 'danger'
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-popover-foreground hover:bg-accent',
                )}
              >
                {Icon && <Icon size={15} />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </Popover>
  );
}
