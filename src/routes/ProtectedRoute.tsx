import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';
import { PageLoader } from '@/components/common/PageLoader';

/**
 * Guards protected routes behind a verified session.
 * Shows a full-screen loader while the initial /auth/me check is in-flight
 * so we never flash protected content or redirect prematurely.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const location = useLocation();

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

