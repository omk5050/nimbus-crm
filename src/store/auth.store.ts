import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginFormValues } from '@/types/auth.types';
import { apiClient } from '@/services/api.client';

interface AuthState {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  user: AuthUser | null;
  isSubmitting: boolean;
  error: string | null;

  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isCheckingAuth: true,
      user: null,
      isSubmitting: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (values) => {
        console.time('login');
        set({ isSubmitting: true, error: null });
        try {
          const res = await apiClient.post('/auth/login', values);
          console.timeEnd('login');
          const { user, accessToken, tokens } = res.data;
          const token = accessToken || tokens?.accessToken;

          if (token) {
            localStorage.setItem('nimbus_access_token', token);
          }

          if (values.rememberMe && user) {
            const remembered = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              title: user.title,
              avatarUrl: user.avatarUrl,
            };
            localStorage.setItem('nimbus_remembered_account', JSON.stringify(remembered));
            localStorage.setItem('nimbus_remembered_email', user.email);
          } else if (!values.rememberMe) {
            localStorage.removeItem('nimbus_remembered_account');
            localStorage.removeItem('nimbus_remembered_email');
          }

          set({ isAuthenticated: true, user, isSubmitting: false, error: null });
        } catch (error: any) {
          console.timeEnd('login');
          const errorMessage =
            error.response?.data?.message ??
            (error.code === 'ECONNABORTED'
              ? 'Request timed out. Please try again.'
              : 'Login failed. Please check your credentials.');

          set({
            isSubmitting: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('nimbus_access_token');
        set({ isAuthenticated: false, isCheckingAuth: false, user: null, isSubmitting: false, error: null });
      },

      fetchMe: async () => {
        set({ isCheckingAuth: true });
        try {
          const token = localStorage.getItem('nimbus_access_token');
          if (!token) {
            set({ isAuthenticated: false, isCheckingAuth: false, user: null, isSubmitting: false });
            return;
          }
          const res = await apiClient.get('/auth/me');
          set({ isAuthenticated: true, isCheckingAuth: false, user: res.data, isSubmitting: false });
        } catch {
          localStorage.removeItem('nimbus_access_token');
          set({ isAuthenticated: false, isCheckingAuth: false, user: null, isSubmitting: false });
        }
      },
    }),
    {
      name: 'nimbus-auth',
      // Only persist auth identity — not the transient checking flag
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !localStorage.getItem('nimbus_access_token')) {
          state.isAuthenticated = false;
          state.user = null;
          state.isSubmitting = false;
        }
      },
    },
  ),
);

