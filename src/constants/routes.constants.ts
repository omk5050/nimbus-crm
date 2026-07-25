/**
 * Every path string in the app should be imported from here — never
 * inlined as a literal. This is what makes renaming or nesting a route
 * later a one-line change instead of a grep-and-pray.
 */
export const ROUTES = {
  ROOT: '/',

  // Auth (outside the dashboard shell)
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard shell
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  LEADS: '/leads',
  SALES: '/sales',
  TASKS: '/tasks',
  EMPLOYEES: '/employees',
  REPORTS: '/reports',
  TABLES: '/tables',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const;

/** `/customers/:id` — a function since it takes a param; everything static stays in ROUTES above. */
export function customerDetailRoute(id: string): string {
  return `${ROUTES.CUSTOMERS}/${id}`;
}

/** `/leads/:id` */
export function leadDetailRoute(id: string): string {
  return `${ROUTES.LEADS}/${id}`;
}

/** `/employees/:id` */
export function employeeDetailRoute(id: string): string {
  return `${ROUTES.EMPLOYEES}/${id}`;
}
