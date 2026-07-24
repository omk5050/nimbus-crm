import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginFormValues } from '@/types/auth.types';
import { apiClient } from '@/services/api.client';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isSubmitting: boolean;

  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

const hasToken = () => Boolean(typeof window !== 'undefined' && localStorage.getItem('nimbus_access_token'));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: hasToken(),
      user: null,
      isSubmitting: false,

      login: async (values) => {
        set({ isSubmitting: true });
        try {
          const res = await apiClient.post('/auth/login', values);
          const { user, tokens } = res.data;
          if (tokens?.accessToken) {
            localStorage.setItem('nimbus_access_token', tokens.accessToken);
          }
          set({ isAuthenticated: true, user, isSubmitting: false });
        } catch (error) {
          set({ isSubmitting: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('nimbus_access_token');
        set({ isAuthenticated: false, user: null });
      },

      fetchMe: async () => {
        try {
          const token = localStorage.getItem('nimbus_access_token');
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }
          const res = await apiClient.get('/auth/me');
          set({ isAuthenticated: true, user: res.data });
        } catch {
          localStorage.removeItem('nimbus_access_token');
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'nimbus-auth',
      onRehydrateStorage: () => (state) => {
        // Double check token existence after rehydration from localStorage
        if (state && !localStorage.getItem('nimbus_access_token')) {
          state.isAuthenticated = false;
          state.user = null;
        }
      },
    },
  ),
);
