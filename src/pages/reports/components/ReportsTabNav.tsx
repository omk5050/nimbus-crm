import { NavLink } from 'react-router';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes.constants';

interface ReportTab {
  label: string;
  to: string;
  end?: boolean;
}

const REPORT_TABS: ReportTab[] = [
  { label: 'Revenue', to: ROUTES.REPORTS, end: true },
  { label: 'Sales', to: `${ROUTES.REPORTS}/sales` },
  { label: 'Leads', to: `${ROUTES.REPORTS}/leads` },
  { label: 'Employees', to: `${ROUTES.REPORTS}/employees` },
];

export function ReportsTabNav() {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {REPORT_TABS.map((tab) => (
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
