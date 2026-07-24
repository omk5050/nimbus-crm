import { useState } from 'react';
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
  lead?: Lead;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: LeadFormValues) {
    setIsSubmitting(true);
    try {
      if (lead) {
        await updateLead(lead.id, values);
        toast.success('Lead updated', { description: `${values.name}'s details were saved.` });
      } else {
        const created = await addLead(values);
        toast.success('Lead added', { description: `${created.name} was added to your pipeline.` });
        onCreated?.(created);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save lead';
      toast.error('Error saving lead', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
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
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
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
