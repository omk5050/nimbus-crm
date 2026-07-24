import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardHeader } from '@/components/cards/Card';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { ROUTES, customerDetailRoute } from '@/constants/routes.constants';
import { CUSTOMER_STATUS_LABEL, CUSTOMER_STATUS_TONE } from '@/constants/customer.constants';
import { useCustomersStore } from '@/store/customers.store';
import { formatDate } from '@/utils/format';

/**
 * Intentionally a lighter-weight table than <DataTable /> — no search/sort/
 * pagination chrome, since this is a five-row "what just happened" preview.
 * Pulls from the same store the full Customers module (Phase 4) reads and
 * writes, so a customer added from the dashboard's Quick Action shows up
 * here immediately.
 */
export function RecentCustomers() {
  const navigate = useNavigate();
  const customers = useCustomersStore((state) => state.customers);
  const recentCustomers = useMemo(() =>
    [...customers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [customers]
  );

  return (
    <Card noPadding className="flex flex-col">
      <div className="p-5 pb-0">
        <CardHeader
          title="Recent customers"
          description="Newest accounts added this month"
          action={
            <Link
              to={ROUTES.CUSTOMERS}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          }
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-2 font-medium">Customer</th>
              <th className="px-5 py-2 font-medium">Company</th>
              <th className="px-5 py-2 font-medium">Status</th>
              <th className="px-5 py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentCustomers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => navigate(customerDetailRoute(customer.id))}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-accent/40"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={customer.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-card-foreground">{customer.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{customer.company}</td>
                <td className="px-5 py-3">
                  <StatusBadge
                    label={CUSTOMER_STATUS_LABEL[customer.status]}
                    tone={CUSTOMER_STATUS_TONE[customer.status]}
                  />
                </td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
