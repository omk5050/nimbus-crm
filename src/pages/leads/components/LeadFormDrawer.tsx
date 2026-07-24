import { Drawer } from '@/components/modals/Drawer';
import { Button } from '@/components/buttons/Button';
import { LeadForm } from '@/components/forms/LeadForm';
import { useLeadsStore } from '@/store/leads.store';
import { toast } from '@/store/toast.store';
import type { Lead, LeadFormValues } from '@/types/lead.types';

const FORM_ID = 'lead-form';

interface LeadFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Present in edit mode; omitted in create mode. */
  lead?: Lead;
  /** Fired after a successful create, with the new record — lets the caller navigate to it. */
  onCreated?: (lead: Lead) => void;
}

function toFormValues(lead: Lead): LeadFormValues {
  return {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    stage: lead.stage,
    source: lead.source,
    owner: lead.owner,
    value: lead.value,
    expectedCloseDate: lead.expectedCloseDate ?? '',
  };
}

export function LeadFormDrawer({ isOpen, onClose, lead, onCreated }: LeadFormDrawerProps) {
  const addLead = useLeadsStore((state) => state.addLead);
  const updateLead = useLeadsStore((state) => state.updateLead);
  const isEditMode = Boolean(lead);

  function handleSubmit(values: LeadFormValues) {
    if (lead) {
      updateLead(lead.id, values);
      toast.success('Lead updated', { description: `${values.name}'s details were saved.` });
    } else {
      const created = addLead(values);
      toast.success('Lead added', { description: `${created.name} was added to your pipeline.` });
      onCreated?.(created);
    }
    onClose();
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit lead' : 'Add lead'}
      description={isEditMode ? "Update this lead's details." : 'Create a new lead in your pipeline.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            {isEditMode ? 'Save changes' : 'Add lead'}
          </Button>
        </>
      }
    >
      <LeadForm
        key={lead?.id ?? 'new'}
        formId={FORM_ID}
        defaultValues={lead ? toFormValues(lead) : undefined}
        onSubmit={handleSubmit}
      />
    </Drawer>
  );
}
