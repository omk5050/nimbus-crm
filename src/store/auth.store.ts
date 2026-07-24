import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginFormValues } from '@/types/auth.types';
import { MOCK_CURRENT_USER } from '@/mock/user.mock';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** Set while a mock login/reset request is "in flight". */
  isSubmitting: boolean;

  /**
   * Mock login. Accepts any well-formed credentials and resolves after a
   * short simulated delay — there is no backend yet, so nothing is actually
   * verified. Swap the body of this function for a real POST /auth/login
   * call (via src/services/api.client.ts) when the API exists; nothing
   * calling `login()` elsewhere needs to change.
   */
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
}

const MOCK_NETWORK_DELAY_MS = 600;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Defaults to signed in so the dashboard is reviewable immediately.
      // Flip to `false` to preview the auth pages / redirect flow.
      isAuthenticated: true,
      user: MOCK_CURRENT_USER,
      isSubmitting: false,

      login: async (_values) => {
        set({ isSubmitting: true });
        await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY_MS));
        set({ isAuthenticated: true, user: MOCK_CURRENT_USER, isSubmitting: false });
      },

      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'nimbus-auth' },
  ),
);
