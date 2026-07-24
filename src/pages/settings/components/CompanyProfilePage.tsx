import { Card, CardHeader } from '@/components/cards/Card';
import { Badge } from '@/components/badges/Badge';
import { Button } from '@/components/buttons/Button';
import { CompanyProfileForm } from '@/components/forms/CompanyProfileForm';
import { useCompanyStore } from '@/store/company.store';
import { toast } from '@/store/toast.store';
import type { CompanyProfileFormValues } from '@/types/settings.types';

const PLAN_LABEL: Record<string, string> = {
  starter: 'Starter plan',
  growth: 'Growth plan',
  enterprise: 'Enterprise plan',
};

export default function CompanyProfilePage() {
  const company = useCompanyStore((state) => state.company);
  const updateCompany = useCompanyStore((state) => state.updateCompany);

  function handleSubmit(values: CompanyProfileFormValues) {
    updateCompany(values);
    toast.success('Company profile updated');
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-card-foreground">Current plan</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Billing isn't part of this preview — this is display only.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="info">{PLAN_LABEL[company.plan]}</Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.info('Plan changes coming soon', { description: 'Billing connects once a backend is wired up.' })}
          >
            Change plan
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Company details" description="Shown on quotes, invoices, and across the workspace." />
        <CompanyProfileForm
          key={company.id}
          defaultValues={{
            name: company.name,
            industry: company.industry,
            website: company.website,
            address: company.address,
            timezone: company.timezone,
          }}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
