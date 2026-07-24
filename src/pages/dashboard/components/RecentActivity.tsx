import { Card, CardHeader } from '@/components/cards/Card';
import { MOCK_RECENT_ACTIVITY } from '@/mock/dashboard.mock';
import type { ActivityType } from '@/types/dashboard.types';
import { Briefcase, FileText, Mail, Phone, Receipt, Video, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  call: Phone,
  email: Mail,
  meeting: Video,
  deal: Briefcase,
  note: FileText,
  invoice: Receipt,
};

export function RecentActivity() {
  const activities = MOCK_RECENT_ACTIVITY || [];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Recent activity" description="Latest updates across your team" />

      {activities.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-muted-foreground">
          <Activity className="mb-2 h-8 w-8 opacity-40" />
          <p>No recent activity recorded yet.</p>
        </div>
      ) : (
        <ol className="flex flex-col">
          {activities.map((activity, index) => {
            const Icon = ACTIVITY_ICON[activity.type] || Activity;
            const isLast = index === activities.length - 1;

            return (
              <li key={activity.id} className="relative flex gap-3 pb-4 last:pb-0">
                {!isLast && (
                  <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" />
                )}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon size={14} />
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-sm text-card-foreground">
                    <span className="font-medium">{activity.actor}</span>{' '}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/80">{activity.timeLabel}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
