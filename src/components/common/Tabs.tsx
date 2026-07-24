import { useId } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Renders the tab strip only — the active panel is up to the parent (`{value === 'notes' && <Notes />}`).
 * Keeping panels out of this component avoids forcing every consumer through one render-prop shape.
 */
export function Tabs<T extends string = string>({ tabs, value, onChange, className }: TabsProps<T>) {
  const layoutId = useId();

  return (
    <div role="tablist" className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {Icon && <Icon size={15} />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-0.5 rounded-full px-1.5 py-0.5 text-[11px] leading-none',
                  isActive ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {tab.count}
              </span>
            )}

            {isActive && (
              <motion.span
                layoutId={`tabs-active-indicator-${layoutId}`}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
