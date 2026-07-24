import { NavLink } from 'react-router';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes.constants';

interface SettingsTab {
  label: string;
  to: string;
  end?: boolean;
}

const SETTINGS_TABS: SettingsTab[] = [
  { label: 'Company Profile', to: ROUTES.SETTINGS, end: true },
  { label: 'Users', to: `${ROUTES.SETTINGS}/users` },
  { label: 'Roles & Permissions', to: `${ROUTES.SETTINGS}/roles` },
  { label: 'Preferences', to: `${ROUTES.SETTINGS}/preferences` },
];

export function SettingsTabNav() {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {SETTINGS_TABS.map((tab) => (
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
