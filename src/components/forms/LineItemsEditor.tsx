import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ArrayPath, Control, FieldArray, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { TextField } from '@/components/inputs/TextField';
import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { formatCurrency } from '@/utils/format';
import { calculateLineItemsTotal } from '@/utils/sales';

interface LineItemShape {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface LineItemsFormShape extends FieldValues {
  items: LineItemShape[];
}

interface LineItemsEditorProps<T extends LineItemsFormShape> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

/**
 * Reads/writes the `items` field array on whatever form renders it — both
 * QuotationForm and InvoiceForm share this exact shape, so it lives here
 * once instead of being copy-pasted between the two. Requires the parent
 * form to be wrapped in a <FormProvider>.
 */
export function LineItemsEditor<T extends LineItemsFormShape>({ control, errors }: LineItemsEditorProps<T>) {
  const { register, watch } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' as unknown as ArrayPath<T> });
  const watchedItems = (watch('items' as Path<T>) as LineItemShape[] | undefined) ?? [];
  const total = calculateLineItemsTotal(watchedItems);

  const itemErrors = errors.items as unknown as
    | { message?: string; root?: { message?: string }; [index: number]: Partial<Record<keyof LineItemShape, { message?: string }>> }
    | undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Line items</label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ description: '', quantity: 1, unitPrice: 0 } as unknown as FieldArray<T, ArrayPath<T>>)}
        >
          <Plus size={14} />
          Add item
        </Button>
      </div>

      {(itemErrors?.root?.message || (typeof itemErrors?.message === 'string' && itemErrors.message)) && (
        <p className="text-xs text-destructive">{itemErrors?.root?.message ?? itemErrors?.message}</p>
      )}

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-start"
          >
            <div className="flex-1">
              <TextField
                label="Description"
                placeholder="Item or service"
                error={itemErrors?.[index]?.description?.message}
                {...register(`items.${index}.description` as Path<T>)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 sm:w-20 sm:flex-none">
                <TextField
                  label="Qty"
                  type="number"
                  min={1}
                  error={itemErrors?.[index]?.quantity?.message}
                  {...register(`items.${index}.quantity` as Path<T>, { valueAsNumber: true })}
                />
              </div>
              <div className="flex-1 sm:w-28 sm:flex-none">
                <TextField
                  label="Unit price"
                  type="number"
                  min={0}
                  step={1}
                  error={itemErrors?.[index]?.unitPrice?.message}
                  {...register(`items.${index}.unitPrice` as Path<T>, { valueAsNumber: true })}
                />
              </div>
              <IconButton
                icon={<Trash2 size={14} />}
                label="Remove item"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="mt-6 shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">Total:&nbsp;</span>
        <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
