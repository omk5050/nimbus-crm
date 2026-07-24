import { Fragment } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

export function Breadcrumbs() {
  const trail = useBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center text-sm sm:flex">
      {trail.map((crumb, index) => {
        const isLast = index === trail.length - 1;
        return (
          <Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && (
              <ChevronRight size={14} className="mx-1.5 shrink-0 text-muted-foreground" />
            )}
            {crumb.path && !isLast ? (
              <Link
                to={crumb.path}
                className="truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="truncate font-medium text-foreground" aria-current={isLast ? 'page' : undefined}>
                {crumb.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
