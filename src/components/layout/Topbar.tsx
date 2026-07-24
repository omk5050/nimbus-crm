import { Menu } from 'lucide-react';
import { useUiStore } from '@/store/ui.store';
import { IconButton } from '@/components/buttons/IconButton';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { UserMenu } from '@/components/layout/UserMenu';

export function Topbar() {
  const openMobileDrawer = useUiStore((state) => state.openMobileDrawer);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
      <IconButton
        icon={<Menu size={20} />}
        label="Open navigation"
        onClick={openMobileDrawer}
        className="lg:hidden"
      />

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <NotificationsMenu />
        <div className="mx-1 h-6 w-px bg-border" />
        <UserMenu />
      </div>
    </header>
  );
}
