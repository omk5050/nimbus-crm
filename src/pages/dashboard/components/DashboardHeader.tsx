import { useAuthStore } from '@/store/auth.store';
import { useCompanyStore } from '@/store/company.store';

const TODAY_LABEL = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

function firstName(fullName?: string): string {
  if (!fullName) return 'there';
  return fullName.split(' ')[0];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);
  const company = useCompanyStore((state) => state.company);

  return (
    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {getGreeting()}, {firstName(user?.name)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across {company.name || 'your workspace'} today.
        </p>
      </div>
      <span className="text-sm text-muted-foreground">{TODAY_LABEL}</span>
    </div>
  );
}
