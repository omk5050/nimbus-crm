import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginFormValues } from '@/types/auth.types';
import { apiClient } from '@/services/api.client';

interface AuthState {
  isAuthenticated: boolean;
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
        set({ isAuthenticated: false, user: null, isSubmitting: false, error: null });
      },

      fetchMe: async () => {
        try {
          const token = localStorage.getItem('nimbus_access_token');
          if (!token) {
            set({ isAuthenticated: false, user: null, isSubmitting: false });
            return;
          }
          const res = await apiClient.get('/auth/me');
          set({ isAuthenticated: true, user: res.data, isSubmitting: false });
        } catch {
          localStorage.removeItem('nimbus_access_token');
          set({ isAuthenticated: false, user: null, isSubmitting: false });
        }
      },
    }),
    {
      name: 'nimbus-auth',
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
