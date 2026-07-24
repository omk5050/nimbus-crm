import { useState } from 'react';
import { Drawer } from '@/components/modals/Drawer';
import { Button } from '@/components/buttons/Button';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { useCustomersStore } from '@/store/customers.store';
import { toast } from '@/store/toast.store';
import type { Customer, CustomerFormValues } from '@/types/customer.types';

const FORM_ID = 'customer-form';

interface CustomerFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  onCreated?: (customer: Customer) => void;
}

function toFormValues(customer: Customer): CustomerFormValues {
  return {
    name: customer.name,
    company: customer.company,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    industry: customer.industry,
    owner: customer.owner,
    address: customer.address,
    tags: Array.isArray(customer.tags) ? customer.tags.join(', ') : customer.tags || '',
  };
}

export function CustomerFormDrawer({ isOpen, onClose, customer, onCreated }: CustomerFormDrawerProps) {
  const addCustomer = useCustomersStore((state) => state.addCustomer);
  const updateCustomer = useCustomersStore((state) => state.updateCustomer);
  const isEditMode = Boolean(customer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: CustomerFormValues) {
    setIsSubmitting(true);
    try {
      if (customer) {
        await updateCustomer(customer.id, values);
        toast.success('Customer updated', { description: `${values.name}'s profile was saved.` });
      } else {
        const created = await addCustomer(values);
        toast.success('Customer added', { description: `${created.name} was added to your accounts.` });
        onCreated?.(created);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save customer';
      toast.error('Error saving customer', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit customer' : 'Add customer'}
      description={isEditMode ? "Update this account's details." : 'Create a new customer record.'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Add customer'}
          </Button>
        </>
      }
    >
      <CustomerForm
        key={customer?.id ?? 'new'}
        formId={FORM_ID}
        defaultValues={customer ? toFormValues(customer) : undefined}
        onSubmit={handleSubmit}
      />
    </Drawer>
  );
}
