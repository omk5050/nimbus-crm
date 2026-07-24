import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerFormSchema } from '@/pages/customers/customers.schemas';
import type { CustomerFormValues } from '@/types/customer.types';
import { TextField } from '@/components/inputs/TextField';
import { Textarea } from '@/components/inputs/Textarea';
import { Select } from '@/components/inputs/Select';
import {
  CUSTOMER_INDUSTRY_OPTIONS,
  CUSTOMER_STATUS_OPTIONS,
} from '@/constants/customer.constants';
import { useSalesRepOptions } from '@/constants/team.constants';

const EMPTY_DEFAULT_VALUES: CustomerFormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'prospect',
  industry: 'Technology',
  owner: '',
  address: '',
  tags: '',
};

interface CustomerFormProps {
  /** Links the <form> to submit buttons rendered outside it (e.g. a Drawer footer) via the HTML `form` attribute. */
  formId: string;
  defaultValues?: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => void;
}

export function CustomerForm({ formId, defaultValues, onSubmit }: CustomerFormProps) {
  const ownerOptions = useSalesRepOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: defaultValues ?? { ...EMPTY_DEFAULT_VALUES, owner: ownerOptions[0]?.value ?? '' },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Full name"
        placeholder="Harlan Ortiz"
        error={errors.name?.message}
        {...register('name')}
      />

      <TextField
        label="Company"
        placeholder="Cedar & Co."
        error={errors.company?.message}
        {...register('company')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              value={field.value}
              onChange={field.onChange}
              options={CUSTOMER_STATUS_OPTIONS}
              error={errors.status?.message}
            />
          )}
        />
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Select
              label="Industry"
              value={field.value}
              onChange={field.onChange}
              options={CUSTOMER_INDUSTRY_OPTIONS}
              error={errors.industry?.message}
            />
          )}
        />
      </div>

      <Controller
        name="owner"
        control={control}
        render={({ field }) => (
          <Select
            label="Account owner"
            value={field.value}
            onChange={field.onChange}
            options={ownerOptions}
            error={errors.owner?.message}
          />
        )}
      />

      <Textarea
        label="Address"
        rows={2}
        placeholder="Street, city, state"
        error={errors.address?.message}
        {...register('address')}
      />

      <TextField
        label="Tags"
        placeholder="Enterprise, Renewal Q3"
        hint="Comma-separated"
        {...register('tags')}
      />
    </form>
  );
}
