import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PRIMARY_NAV } from '@/constants/nav.constants';
import { APP_NAME } from '@/constants/app.constants';
import { SidebarNavItem } from '@/components/layout/SidebarNavItem';
import { IconButton } from '@/components/buttons/IconButton';
import { useCompanyStore } from '@/store/company.store';
import { useHasPermission } from '@/hooks/usePermissions';
import { cn } from '@/utils/cn';
import logoMark from '@/assets/logo-mark.svg';

interface SidebarProps {
  /** Icon-only rail. Only ever true for the docked desktop variant — the drawer is always full width. */
  collapsed?: boolean;
  variant?: 'docked' | 'drawer';
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}

const PLAN_LABEL: Record<string, string> = {
  starter: 'Starter plan',
  growth: 'Growth plan',
  enterprise: 'Enterprise plan',
};

export function Sidebar({
  collapsed = false,
  variant = 'docked',
  onNavigate,
  onToggleCollapse,
}: SidebarProps) {
  const canViewCustomers = useHasPermission('customers', 'view');
  const canViewLeads = useHasPermission('leads', 'view');
  const canViewSales = useHasPermission('sales', 'view');
  const canViewTasks = useHasPermission('tasks', 'view');
  const canViewEmployees = useHasPermission('employees', 'view');
  const canViewReports = useHasPermission('reports', 'view');
  const canViewSettings = useHasPermission('settings', 'view');

  const visibleNav = PRIMARY_NAV.filter((item) => {
    if (item.id === 'customers') return canViewCustomers;
    if (item.id === 'leads') return canViewLeads;
    if (item.id === 'sales') return canViewSales;
    if (item.id === 'tasks') return canViewTasks;
    if (item.id === 'employees') return canViewEmployees;
    if (item.id === 'reports') return canViewReports;
    if (item.id === 'settings') return canViewSettings;
    return true;
  });

  return (
    <div className="flex h-full w-full flex-col bg-brand-950 text-brand-100">
      {/* Brand header */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-white/10 px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <img src={logoMark} alt="" className="h-8 w-8 shrink-0 rounded-lg" />
        {!collapsed && (
          <span className="ml-2.5 truncate text-base font-semibold tracking-tight text-white">
            {APP_NAME}
          </span>
        )}
      </div>

      {/* Nav list */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleNav.map((item) => (
          <SidebarNavItem key={item.id} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Footer: workspace card + collapse toggle (docked variant only) */}
      <div className="shrink-0 border-t border-white/10 p-3">
        {!collapsed && (
          <div className="mb-2 rounded-md bg-white/5 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-white">
              {company.name}
            </p>
            <p className="text-xs text-brand-300">
              {PLAN_LABEL[company.plan]}
            </p>
          </div>
        )}

        {variant === 'docked' && onToggleCollapse && (
          <IconButton
            icon={collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
            className={cn(
              'w-full text-brand-300 hover:bg-white/10 hover:text-white',
              collapsed && 'mx-auto w-9',
            )}
          />
        )}
      </div>
    </div>
  );
}
