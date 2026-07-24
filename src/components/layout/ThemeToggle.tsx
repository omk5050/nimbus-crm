import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';
import type { ThemePreference } from '@/store/theme.store';
import { IconButton } from '@/components/buttons/IconButton';

const NEXT: Record<ThemePreference, ThemePreference> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const ICON: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABEL: Record<ThemePreference, string> = {
  light: 'Light theme — switch to dark',
  dark: 'Dark theme — switch to system',
  system: 'System theme — switch to light',
};

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const Icon = ICON[theme];

  return (
    <IconButton
      icon={<Icon size={18} />}
      label={LABEL[theme]}
      onClick={() => setTheme(NEXT[theme])}
    />
  );
}
