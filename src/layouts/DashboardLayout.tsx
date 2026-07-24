import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { useUiStore } from '@/store/ui.store';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { Topbar } from '@/components/layout/Topbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/utils/cn';

export function DashboardLayout() {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);
  const { pathname } = useLocation();

  // Key on the top-level segment only (e.g. "/employees") so that navigating
  // to a sub-page like "/employees/emp_123" does NOT trigger the exit
  // animation and blank-screen flash. Only switching between top-level
  // sections (Dashboard → Customers, etc.) plays the transition.
  const topLevelKey = '/' + pathname.split('/')[1];

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Docked sidebar — desktop/laptop only. The mobile drawer below covers <lg. */}
      <aside
        className={cn(
          'hidden shrink-0 transition-[width] duration-200 ease-out lg:block',
          isSidebarCollapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        <Sidebar
          collapsed={isSidebarCollapsed}
          variant="docked"
          onToggleCollapse={toggleSidebarCollapsed}
        />
      </aside>

      <MobileDrawer />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={topLevelKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}
