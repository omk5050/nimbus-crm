import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, X, XCircle, Info, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useToastStore } from '@/store/toast.store';
import type { ToastVariant } from '@/store/toast.store';
import { cn } from '@/utils/cn';

const VARIANT_ICON: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const VARIANT_ICON_CLASSES: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-destructive',
  info: 'text-brand-500',
  warning: 'text-warning',
};

/** Mount once, near the root — every `toast.*()` call anywhere in the app renders through here. */
export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((entry) => {
          const Icon = VARIANT_ICON[entry.variant];

          return (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg"
            >
              <Icon size={18} className={cn('mt-0.5 shrink-0', VARIANT_ICON_CLASSES[entry.variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-card-foreground">{entry.title}</p>
                {entry.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{entry.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(entry.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
