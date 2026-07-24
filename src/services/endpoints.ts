/**
 * Future REST resource paths, relative to VITE_API_BASE_URL. Not called
 * by anything yet — this is here so each feature's future *.service.ts
 * (Phase 4+) has one obvious place to point at instead of inventing
 * path strings inline.
 */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  customers: '/customers',
  leads: '/leads',
  sales: '/sales',
  tasks: '/tasks',
  employees: '/employees',
  reports: '/reports',
  notifications: '/notifications',
} as const;
