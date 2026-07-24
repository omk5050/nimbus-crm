import { useState } from 'react';
import { Drawer } from '@/components/modals/Drawer';
import { Button } from '@/components/buttons/Button';
import { DealForm } from '@/components/forms/DealForm';
import { useSalesStore } from '@/store/sales.store';
import { toast } from '@/store/toast.store';
import type { Deal, DealFormValues } from '@/types/sales.types';

const FORM_ID = 'deal-form';

interface DealFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal;
  onCreated?: (deal: Deal) => void;
}

function toFormValues(deal: Deal): DealFormValues {
  return {
    title: deal.title,
    customerId: deal.customerId,
    stage: deal.stage,
    value: deal.value,
    owner: deal.owner,
    expectedCloseDate: deal.expectedCloseDate ?? '',
  };
}

export function DealFormDrawer({ isOpen, onClose, deal, onCreated }: DealFormDrawerProps) {
  const addDeal = useSalesStore((state) => state.addDeal);
  const updateDeal = useSalesStore((state) => state.updateDeal);
  const isEditMode = Boolean(deal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: DealFormValues) {
    setIsSubmitting(true);
    try {
      if (deal) {
        await updateDeal(deal.id, values);
        toast.success('Deal updated', { description: `${values.title} was saved.` });
      } else {
        const created = await addDeal(values);
        toast.success('Deal added', { description: `${created.title} was added to your pipeline.` });
        onCreated?.(created);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save deal';
      toast.error('Error saving deal', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit deal' : 'Add deal'}
      description={isEditMode ? "Update this deal's details." : 'Create a new deal in your pipeline.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Add deal'}
          </Button>
        </>
      }
    >
      <DealForm
        key={deal?.id ?? 'new'}
        formId={FORM_ID}
        defaultValues={deal ? toFormValues(deal) : undefined}
        onSubmit={handleSubmit}
      />
    </Drawer>
  );
}
