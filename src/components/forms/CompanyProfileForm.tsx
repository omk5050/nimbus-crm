import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyProfileFormSchema } from '@/pages/settings/settings.schemas';
import type { CompanyProfileFormValues } from '@/types/settings.types';
import { TextField } from '@/components/inputs/TextField';
import { Textarea } from '@/components/inputs/Textarea';
import { Select } from '@/components/inputs/Select';
import { Button } from '@/components/buttons/Button';
import { TIMEZONE_OPTIONS } from '@/constants/settings.constants';

interface CompanyProfileFormProps {
  defaultValues: CompanyProfileFormValues;
  onSubmit: (values: CompanyProfileFormValues) => void;
}

export function CompanyProfileForm({ defaultValues, onSubmit }: CompanyProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField label="Company name" error={errors.name?.message} {...register('name')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Industry" error={errors.industry?.message} {...register('industry')} />
        <TextField
          label="Website"
          placeholder="https://example.com"
          error={errors.website?.message}
          {...register('website')}
        />
      </div>

      <Textarea label="Address" rows={2} error={errors.address?.message} {...register('address')} />

      <Controller
        name="timezone"
        control={control}
        render={({ field }) => (
          <Select
            label="Timezone"
            value={field.value}
            onChange={field.onChange}
            options={TIMEZONE_OPTIONS}
            error={errors.timezone?.message}
          />
        )}
      />

      <Button type="submit" className="self-start" disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  );
}
