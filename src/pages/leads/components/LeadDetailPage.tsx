import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Mail, MapPin, Pencil, Phone, Target, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/badges/Badge';
import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { Card, CardHeader } from '@/components/cards/Card';
import { Select } from '@/components/inputs/Select';
import { EmptyState } from '@/components/common/EmptyState';
import { PageLoader } from '@/components/common/PageLoader';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { LeadFormDrawer } from '@/pages/leads/components/LeadFormDrawer';
import { LeadStageStepper } from '@/pages/leads/components/LeadStageStepper';
import { LeadActivityTimeline } from '@/pages/leads/components/LeadActivityTimeline';
import { LeadNoteComposer } from '@/pages/leads/components/LeadNoteComposer';
import { useLead, useLeadsStore } from '@/store/leads.store';
import { toast } from '@/store/toast.store';
import { ROUTES } from '@/constants/routes.constants';
import { useSalesRepOptions } from '@/constants/team.constants';
import { formatCompactCurrency, formatDate } from '@/utils/format';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lead = useLead(id);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const fetchLeadActivity = useLeadsStore((state) => state.fetchLeadActivity);
  const moveStage = useLeadsStore((state) => state.moveStage);
  const assignOwner = useLeadsStore((state) => state.assignOwner);
  const deleteLead = useLeadsStore((state) => state.deleteLead);
  const ownerOptions = useSalesRepOptions();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Ensure leads list is loaded (covers direct URL navigation / page refresh)
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (id) {
      fetchLeadActivity(id);
    }
  }, [id, fetchLeadActivity]);

  if (!lead) {
    if (isLoading) {
      return <PageLoader />;
    }
    return (
      <EmptyState
        icon={Target}
        title="Lead not found"
        description="This lead may have been deleted."
        action={
          <Button variant="secondary" onClick={() => navigate(ROUTES.LEADS)}>
            Back to leads
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <IconButton
        icon={<ArrowLeft size={16} />}
        label="Back to leads"
        onClick={() => navigate(ROUTES.LEADS)}
        className="-ml-2"
      />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <Avatar name={lead.name} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{lead.name}</h1>
              <Badge tone="neutral">{lead.source}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {lead.company} · {formatCompactCurrency(lead.value)} estimated value
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <Pencil size={15} />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 size={15} />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title="Pipeline stage" description="Click a stage to move this lead, or close it out." />
        <LeadStageStepper stage={lead.stage} onChange={(stage) => moveStage(lead.id, stage)} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <CardHeader title="Contact information" />
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Mail size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-0.5 truncate text-sm font-medium text-card-foreground">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Phone size={14} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="mt-0.5 truncate text-sm font-medium text-card-foreground">{lead.phone}</p>
            </div>
          </div>
          {lead.expectedCloseDate && (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <MapPin size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Expected close date</p>
                <p className="mt-0.5 text-sm font-medium text-card-foreground">
                  {formatDate(lead.expectedCloseDate)}
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-4">
          <CardHeader title="Assign salesperson" description="Change who owns this lead." />
          <Select
            value={lead.owner}
            onChange={(owner) => {
              assignOwner(lead.id, owner);
              toast.success('Lead reassigned', { description: `Now owned by ${owner}.` });
            }}
            options={ownerOptions}
          />
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="mt-0.5 text-sm font-semibold text-card-foreground">
                {formatDate(lead.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estimated value</p>
              <p className="mt-0.5 text-sm font-semibold text-card-foreground">
                {formatCompactCurrency(lead.value)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">Activity</h2>
        <LeadNoteComposer leadId={lead.id} />
        <LeadActivityTimeline leadId={lead.id} />
      </div>

      <LeadFormDrawer isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} lead={lead} />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete this lead?"
        description={`This removes ${lead.name} (${lead.company}) from your pipeline. This can't be undone.`}
        confirmLabel="Delete lead"
        tone="danger"
        onConfirm={() => {
          deleteLead(lead.id);
          toast.success('Lead deleted', { description: `${lead.name} was removed.` });
          navigate(ROUTES.LEADS);
        }}
      />
    </div>
  );
}
