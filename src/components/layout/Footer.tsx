import { APP_NAME } from '@/constants/app.constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {APP_NAME}. All rights reserved.
        </span>
        <span>v0.1.0 — mock data build</span>
      </div>
    </footer>
  );
}
