import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema } from '@/pages/leads/leads.schemas';
import type { LeadFormValues } from '@/types/lead.types';
import { TextField } from '@/components/inputs/TextField';
import { Select } from '@/components/inputs/Select';
import {
  LEAD_SOURCE_OPTIONS,
  LEAD_STAGE_OPTIONS,
} from '@/constants/lead.constants';
import { useSalesRepOptions } from '@/constants/team.constants';

const EMPTY_DEFAULT_VALUES: LeadFormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  stage: 'new',
  source: 'Website',
  owner: '',
  value: 0,
  expectedCloseDate: '',
};

interface LeadFormProps {
  /** Links the <form> to submit buttons rendered outside it (e.g. a Drawer footer) via the HTML `form` attribute. */
  formId: string;
  defaultValues?: LeadFormValues;
  onSubmit: (values: LeadFormValues) => void;
}

export function LeadForm({ formId, defaultValues, onSubmit }: LeadFormProps) {
  const ownerOptions = useSalesRepOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: defaultValues ?? { ...EMPTY_DEFAULT_VALUES, owner: ownerOptions[0]?.value ?? '' },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Full name"
        placeholder="Isabella Cruz"
        error={errors.name?.message}
        {...register('name')}
      />

      <TextField
        label="Company"
        placeholder="Northlight Media"
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
          name="stage"
          control={control}
          render={({ field }) => (
            <Select
              label="Stage"
              value={field.value}
              onChange={field.onChange}
              options={LEAD_STAGE_OPTIONS}
              error={errors.stage?.message}
            />
          )}
        />
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Select
              label="Source"
              value={field.value}
              onChange={field.onChange}
              options={LEAD_SOURCE_OPTIONS}
              error={errors.source?.message}
            />
          )}
        />
      </div>

      <Controller
        name="owner"
        control={control}
        render={({ field }) => (
          <Select
            label="Assigned to"
            value={field.value}
            onChange={field.onChange}
            options={ownerOptions}
            error={errors.owner?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Estimated value"
          type="number"
          min={0}
          step={100}
          placeholder="25000"
          error={errors.value?.message}
          {...register('value', { valueAsNumber: true })}
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
