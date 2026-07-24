import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastEntry {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastEntry[];
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((entry) => entry.id !== id) })),
}));

interface ToastOptions {
  description?: string;
  /** Milliseconds before auto-dismiss. Set to 0 to require manual dismissal. */
  duration?: number;
}

const DEFAULT_DURATION = 4000;

function push(variant: ToastVariant, title: string, options?: ToastOptions) {
  const id = crypto.randomUUID();
  const duration = options?.duration ?? DEFAULT_DURATION;

  useToastStore.setState((state) => ({
    toasts: [...state.toasts, { id, title, description: options?.description, variant }],
  }));

  if (duration > 0) {
    setTimeout(() => useToastStore.getState().dismiss(id), duration);
  }
}

/**
 * Fire-and-forget toast helper, callable from anywhere — form submit handlers, mock
 * async actions, route guards — without needing to be inside a component that calls
 * the hook. `<ToastContainer />` (mounted once in App.tsx) renders whatever is queued.
 *
 *   toast.success('Customer saved')
 *   toast.error('Something went wrong', { description: 'Please try again.' })
 */
export const toast = {
  success: (title: string, options?: ToastOptions) => push('success', title, options),
  error: (title: string, options?: ToastOptions) => push('error', title, options),
  info: (title: string, options?: ToastOptions) => push('info', title, options),
  warning: (title: string, options?: ToastOptions) => push('warning', title, options),
};

export { useToastStore };
