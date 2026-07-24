import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dealFormSchema } from '@/pages/sales/sales.schemas';
import type { DealFormValues } from '@/types/sales.types';
import { TextField } from '@/components/inputs/TextField';
import { Select } from '@/components/inputs/Select';
import { DEAL_STAGE_OPTIONS } from '@/constants/sales.constants';
import { useSalesRepOptions } from '@/constants/team.constants';
import { useCustomersStore } from '@/store/customers.store';

const EMPTY_DEFAULT_VALUES: DealFormValues = {
  title: '',
  customerId: '',
  stage: 'qualifying',
  value: 0,
  owner: '',
  expectedCloseDate: '',
};

interface DealFormProps {
  /** Links the <form> to submit buttons rendered outside it (e.g. a Drawer footer) via the HTML `form` attribute. */
  formId: string;
  defaultValues?: DealFormValues;
  onSubmit: (values: DealFormValues) => void;
}

export function DealForm({ formId, defaultValues, onSubmit }: DealFormProps) {
  const customers = useCustomersStore((state) => state.customers);
  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.name} — ${customer.company}`,
  }));
  const ownerOptions = useSalesRepOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: defaultValues ?? { ...EMPTY_DEFAULT_VALUES, owner: ownerOptions[0]?.value ?? '' },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Deal name"
        placeholder="Annual platform license"
        error={errors.title?.message}
        {...register('title')}
      />

      <Controller
        name="customerId"
        control={control}
        render={({ field }) => (
          <Select
            label="Customer"
            value={field.value || null}
            onChange={field.onChange}
            options={customerOptions}
            placeholder="Select a customer…"
            error={errors.customerId?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="stage"
          control={control}
          render={({ field }) => (
            <Select
              label="Stage"
              value={field.value}
              onChange={field.onChange}
              options={DEAL_STAGE_OPTIONS}
              error={errors.stage?.message}
            />
          )}
        />
        <TextField
          label="Deal value"
          type="number"
          min={0}
          step={100}
          placeholder="25000"
          error={errors.value?.message}
          {...register('value', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="owner"
          control={control}
          render={({ field }) => (
            <Select
              label="Owner"
              value={field.value}
              onChange={field.onChange}
              options={ownerOptions}
              error={errors.owner?.message}
            />
          )}
        />
        <TextField
          label="Expected close date"
          type="date"
          hint="Optional"
          error={errors.expectedCloseDate?.message}
          {...register('expectedCloseDate')}
        />
      </div>
    </form>
  );
}
