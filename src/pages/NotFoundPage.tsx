import { Link } from 'react-router';
import { Compass } from 'lucide-react';
import { Button } from '@/components/buttons/Button';
import { ROUTES } from '@/constants/routes.constants';

export default function NotFoundPage() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
        <Compass size={26} />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to={ROUTES.DASHBOARD} className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
