import { Sun, Moon, Monitor } from 'lucide-react';
import { Card, CardHeader } from '@/components/cards/Card';
import { RadioGroup } from '@/components/inputs/RadioGroup';
import { Checkbox } from '@/components/inputs/Checkbox';
import { Select } from '@/components/inputs/Select';
import { useThemeStore } from '@/store/theme.store';
import type { ThemePreference } from '@/store/theme.store';
import { usePreferencesStore } from '@/store/preferences.store';
import { DATE_FORMAT_OPTIONS, DENSITY_OPTIONS } from '@/constants/settings.constants';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const THEME_ICON: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function PreferencesPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const preferences = usePreferencesStore();

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <CardHeader title="Theme" description="Choose how Nimbus looks on this device." />
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => {
            const Icon = THEME_ICON[option.value];
            const isSelected = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                  isSelected ? 'border-primary bg-accent/40' : 'border-border hover:border-primary/40'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardHeader title="Notifications" description="Choose what Nimbus emails you about." />
        <Checkbox
          label="Email notifications"
          checked={preferences.emailNotifications}
          onChange={(event) => preferences.setEmailNotifications(event.target.checked)}
        />
        <Checkbox
          label="Task reminders"
          checked={preferences.taskReminders}
          onChange={(event) => preferences.setTaskReminders(event.target.checked)}
        />
        <Checkbox
          label="Weekly digest"
          checked={preferences.weeklyDigest}
          onChange={(event) => preferences.setWeeklyDigest(event.target.checked)}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <CardHeader title="Display" description="Adjust density and date formatting." />
        <RadioGroup
          label="Table density"
          value={preferences.density}
          onChange={preferences.setDensity}
          options={DENSITY_OPTIONS}
          direction="row"
        />
        <div className="max-w-xs">
          <Select
            label="Date format"
            value={preferences.dateFormat}
            onChange={preferences.setDateFormat}
            options={DATE_FORMAT_OPTIONS}
          />
        </div>
      </Card>
    </div>
  );
}
