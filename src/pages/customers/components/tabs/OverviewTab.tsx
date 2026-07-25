import { Mail, MapPin, Phone, Tag, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader } from '@/components/cards/Card';
import { Badge } from '@/components/badges/Badge';
import type { Customer } from '@/types/customer.types';
import { formatCurrency, formatDate } from '@/utils/format';

interface OverviewTabProps {
  customer: Customer;
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Icon size={14} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

export function OverviewTab({ customer }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <CardHeader title="Contact information" />
        <DetailRow icon={Mail} label="Email" value={customer.email} />
        <DetailRow icon={Phone} label="Phone" value={customer.phone} />
        <DetailRow icon={MapPin} label="Address" value={customer.address} />
      </Card>

      <Card className="flex flex-col gap-4">
        <CardHeader title="Account information" />
        <DetailRow icon={User} label="Account owner" value={customer.owner} />
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Tag size={14} />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Tags</p>
            {customer.tags && customer.tags.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {customer.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">No tags yet</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {formatCurrency(customer.lifetimeValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Customer since</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
