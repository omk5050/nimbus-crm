import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';

/**
 * Placeholder guard for the mock-auth phase: gates on the Zustand auth
 * store's `isAuthenticated` flag rather than a verified session/JWT.
 * Swapping in real auth later means changing what sets that flag, not
 * anything about how routes are guarded.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
