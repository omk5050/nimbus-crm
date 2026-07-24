import { useState } from 'react';
import { Select } from '@/components/inputs/Select';
import { TextField } from '@/components/inputs/TextField';
import {
  DATE_RANGE_PRESETS,
  resolveDateRangePreset,
  type DateRange,
  type DateRangePresetId,
} from '@/utils/dateRange';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Which preset the dropdown shows as selected initially — must match the range the parent seeded `value` with. */
  defaultPreset?: DateRangePresetId;
}

const PRESET_OPTIONS = [
  ...DATE_RANGE_PRESETS.map((preset) => ({ value: preset.id, label: preset.label })),
  { value: 'custom', label: 'Custom range' },
];

/**
 * Defaults to a preset (e.g. "Last 30 days"); switching to "Custom range"
 * reveals two date inputs. Whichever the user touches last is what the
 * parent's `value` reflects — this component doesn't track its own copy of
 * the range, so it stays in sync if the parent resets it.
 */
export function DateRangePicker({ value, onChange, defaultPreset = 'last30' }: DateRangePickerProps) {
  const [mode, setMode] = useState<DateRangePresetId | 'custom'>(defaultPreset);

  function handlePresetChange(next: string) {
    if (next === 'custom') {
      setMode('custom');
      return;
    }
    setMode(next as DateRangePresetId);
    onChange(resolveDateRangePreset(next as DateRangePresetId));
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-44">
        <Select value={mode} onChange={handlePresetChange} options={PRESET_OPTIONS} />
      </div>

      {mode === 'custom' && (
        <>
          <div className="w-36">
            <TextField
              label="From"
              type="date"
              value={value.from}
              onChange={(event) => onChange({ ...value, from: event.target.value })}
            />
          </div>
          <div className="w-36">
            <TextField
              label="To"
              type="date"
              value={value.to}
              onChange={(event) => onChange({ ...value, to: event.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
