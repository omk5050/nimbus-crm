import { Link, useNavigate } from 'react-router';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Popover } from '@/components/common/Popover';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';
import { cn } from '@/utils/cn';

export function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Popover
      align="end"
      panelClassName="w-56 overflow-hidden"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight text-foreground">
              {user.name}
            </span>
            <span className="block text-xs leading-tight text-muted-foreground">{user.title}</span>
          </span>
          <ChevronDown size={16} className="hidden shrink-0 text-muted-foreground sm:block" />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-popover-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="p-1.5">
            <Link
              to={ROUTES.SETTINGS}
              onClick={close}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-popover-foreground hover:bg-accent"
            >
              <Settings size={16} className="text-muted-foreground" />
              Settings
            </Link>
            <button
              type="button"
              onClick={() => {
                close();
                logout();
                navigate(ROUTES.LOGIN);
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </>
      )}
    </Popover>
  );
}
