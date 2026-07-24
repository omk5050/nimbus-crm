import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentFormSchema } from '@/pages/sales/sales.schemas';
import type { PaymentFormValues } from '@/types/sales.types';
import { TextField } from '@/components/inputs/TextField';
import { Select } from '@/components/inputs/Select';
import { PAYMENT_METHOD_OPTIONS } from '@/constants/sales.constants';

interface PaymentFormProps {
  formId: string;
  /** Pre-fills the amount field with the invoice's outstanding balance. */
  defaultAmount: number;
  onSubmit: (values: PaymentFormValues) => void;
}

export function PaymentForm({ formId, defaultAmount, onSubmit }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { amount: defaultAmount, method: 'card' },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <TextField
        label="Amount"
        type="number"
        min={0.01}
        step={0.01}
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />
      <Controller
        name="method"
        control={control}
        render={({ field }) => (
          <Select
            label="Payment method"
            value={field.value}
            onChange={field.onChange}
            options={PAYMENT_METHOD_OPTIONS}
            error={errors.method?.message}
          />
        )}
      />
    </form>
  );
}
