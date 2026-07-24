import { NavLink } from 'react-router';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes.constants';

interface SalesTab {
  label: string;
  to: string;
  end?: boolean;
}

const SALES_TABS: SalesTab[] = [
  { label: 'Deals', to: ROUTES.SALES, end: true },
  { label: 'Quotations', to: `${ROUTES.SALES}/quotations` },
  { label: 'Invoices', to: `${ROUTES.SALES}/invoices` },
  { label: 'Payments', to: `${ROUTES.SALES}/payments` },
];

export function SalesTabNav() {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {SALES_TABS.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              'relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          {({ isActive }) => (
            <>
              {tab.label}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
