import { Briefcase, Clock, FileText, Mail, Phone, Sparkles, UserCog, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { useLeadsStore } from '@/store/leads.store';
import type { LeadActivityType } from '@/types/lead.types';
import { formatDateTime, formatRelativeTime } from '@/utils/format';

interface LeadActivityTimelineProps {
  leadId: string;
}

const ACTIVITY_ICON: Record<LeadActivityType, LucideIcon> = {
  created: Sparkles,
  'stage-change': Briefcase,
  'owner-change': UserCog,
  call: Phone,
  email: Mail,
  meeting: Video,
  note: FileText,
};

export function LeadActivityTimeline({ leadId }: LeadActivityTimelineProps) {
  const events = useLeadsStore((state) => state.activityByLeadId[leadId] ?? []);

  if (events.length === 0) {
    return <EmptyState icon={Clock} title="No activity yet" />;
  }

  return (
    <Card>
      <ol className="flex flex-col">
        {events.map((event, index) => {
          const Icon = ACTIVITY_ICON[event.type];
          const isLast = index === events.length - 1;

          return (
            <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" />
              )}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon size={14} />
              </span>
              <div className="min-w-0 pt-1">
                <p className="text-sm font-medium text-card-foreground">{event.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {event.actor} · {formatRelativeTime(event.createdAt)}
                  <span className="hidden sm:inline"> · {formatDateTime(event.createdAt)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
