import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quotationFormSchema } from '@/pages/sales/sales.schemas';
import type { QuotationFormValues } from '@/types/sales.types';
import { TextField } from '@/components/inputs/TextField';
import { Textarea } from '@/components/inputs/Textarea';
import { Select } from '@/components/inputs/Select';
import { LineItemsEditor } from '@/components/forms/LineItemsEditor';
import { useCustomersStore } from '@/store/customers.store';
import { useSalesStore } from '@/store/sales.store';

const EMPTY_DEFAULT_VALUES: QuotationFormValues = {
  customerId: '',
  dealId: '',
  validUntil: '',
  notes: '',
  items: [{ description: '', quantity: 1, unitPrice: 0 }],
};

interface QuotationFormProps {
  /** Links the <form> to submit buttons rendered outside it (e.g. a Drawer footer) via the HTML `form` attribute. */
  formId: string;
  defaultValues?: QuotationFormValues;
  onSubmit: (values: QuotationFormValues) => void;
}

export function QuotationForm({ formId, defaultValues, onSubmit }: QuotationFormProps) {
  const customers = useCustomersStore((state) => state.customers);
  const deals = useSalesStore((state) => state.deals);

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.name} — ${customer.company}`,
  }));
  const dealOptions = [
    { value: '', label: 'No linked deal' },
    ...deals.map((deal) => ({ value: deal.id, label: deal.title })),
  ];

  const methods = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULT_VALUES,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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

        <Controller
          name="dealId"
          control={control}
          render={({ field }) => (
            <Select
              label="Linked deal"
              value={field.value}
              onChange={field.onChange}
              options={dealOptions}
            />
          )}
        />

        <TextField
          label="Valid until"
          type="date"
          error={errors.validUntil?.message}
          {...register('validUntil')}
        />

        <LineItemsEditor control={control} errors={errors} />

        <Textarea
          label="Notes"
          rows={2}
          placeholder="Payment terms, delivery details…"
          hint="Optional"
          {...register('notes')}
        />
      </form>
    </FormProvider>
  );
}
