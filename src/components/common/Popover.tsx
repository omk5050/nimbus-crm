import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/utils/cn';

export interface PopoverRenderProps {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

interface PopoverProps {
  trigger: (props: PopoverRenderProps) => ReactNode;
  children: (props: { close: () => void }) => ReactNode;
  /** Horizontal alignment of the panel relative to the trigger. */
  align?: 'start' | 'end';
  panelClassName?: string;
  className?: string;
  /** Lets a parent (e.g. a table row) control open state instead of the popover managing its own. */
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Popover({
  trigger,
  children,
  align = 'start',
  panelClassName,
  className,
  isOpen: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const disclosure = useDisclosure();
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : disclosure.isOpen;

  const containerRef = useRef<HTMLDivElement>(null);

  function close() {
    if (isControlled) onOpenChange?.(false);
    else disclosure.close();
  }

  function open() {
    if (isControlled) onOpenChange?.(true);
    else disclosure.open();
  }

  function toggle() {
    if (isControlled) onOpenChange?.(!isOpen);
    else disclosure.toggle();
  }

  useOnClickOutside(containerRef, close, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {trigger({ isOpen, toggle, open, close })}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-40 mt-2 rounded-lg border border-border bg-popover shadow-lg',
              align === 'start' ? 'left-0' : 'right-0',
              panelClassName,
            )}
          >
            {children({ close })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
