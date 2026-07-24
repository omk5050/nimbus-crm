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
  /** Present in edit mode; omitted in create mode. */
  customer?: Customer;
  /** Fired after a successful create, with the new record — lets the caller navigate to it. */
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
    tags: customer.tags.join(', '),
  };
}

export function CustomerFormDrawer({ isOpen, onClose, customer, onCreated }: CustomerFormDrawerProps) {
  const addCustomer = useCustomersStore((state) => state.addCustomer);
  const updateCustomer = useCustomersStore((state) => state.updateCustomer);
  const isEditMode = Boolean(customer);

  function handleSubmit(values: CustomerFormValues) {
    if (customer) {
      updateCustomer(customer.id, values);
      toast.success('Customer updated', { description: `${values.name}'s profile was saved.` });
    } else {
      const created = addCustomer(values);
      toast.success('Customer added', { description: `${created.name} was added to your accounts.` });
      onCreated?.(created);
    }
    onClose();
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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
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
