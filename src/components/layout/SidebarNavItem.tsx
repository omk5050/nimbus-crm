import { NavLink } from 'react-router';
import type { NavItem } from '@/types/nav.types';
import { Badge } from '@/components/badges/Badge';
import { cn } from '@/utils/cn';

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, collapsed, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={!item.matchPrefix}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-brand-800/80 text-white'
            : 'text-brand-200/70 hover:bg-brand-900/60 hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator rail — only meaningful when expanded, but reserves no space when collapsed */}
          <span
            className={cn(
              'absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary transition-opacity',
              isActive && !collapsed ? 'opacity-100' : 'opacity-0',
            )}
          />
          <Icon size={18} className="shrink-0" />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {!collapsed && item.badgeCount ? (
            <Badge tone="info">{item.badgeCount}</Badge>
          ) : null}
        </>
      )}
    </NavLink>
  );
}
