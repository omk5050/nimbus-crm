import { Briefcase, Clock, FileText, Mail, Phone, Sparkles, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { useCustomersStore } from '@/store/customers.store';
import type { CustomerTimelineEventType } from '@/types/customer.types';
import { formatDateTime, formatRelativeTime } from '@/utils/format';

interface TimelineTabProps {
  customerId: string;
}

const EVENT_ICON: Record<CustomerTimelineEventType, LucideIcon> = {
  created: Sparkles,
  updated: FileText,
  note: FileText,
  call: Phone,
  email: Mail,
  meeting: Video,
  deal: Briefcase,
};

export function TimelineTab({ customerId }: TimelineTabProps) {
  const events = useCustomersStore((state) => state.timelineByCustomerId[customerId] ?? []);

  if (events.length === 0) {
    return <EmptyState icon={Clock} title="No activity yet" />;
  }

  return (
    <Card>
      <ol className="flex flex-col">
        {events.map((event, index) => {
          const Icon = EVENT_ICON[event.type];
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
