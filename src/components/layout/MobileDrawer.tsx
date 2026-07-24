import { AnimatePresence, motion } from 'motion/react';
import { useUiStore } from '@/store/ui.store';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Renders nothing when closed. Mounted once at the DashboardLayout root so
 * it can overlay the entire viewport regardless of where in the tree the
 * Topbar's menu button lives.
 */
export function MobileDrawer() {
  const isOpen = useUiStore((state) => state.isMobileDrawerOpen);
  const closeMobileDrawer = useUiStore((state) => state.closeMobileDrawer);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <motion.div
            className="absolute inset-0 bg-slate-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileDrawer}
          />
          <motion.div
            className="absolute inset-y-0 left-0 w-72 max-w-[80vw] shadow-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
          >
            <Sidebar variant="drawer" onNavigate={closeMobileDrawer} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
