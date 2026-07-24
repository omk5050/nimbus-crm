import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme.store';

/**
 * Mounted once at the app root. Keeps the `.dark` class on <html> in sync
 * with the theme store, re-evaluating the OS preference live whenever the
 * user has selected "system" rather than an explicit light/dark choice.
 */
export function useThemeSync(): void {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      root.classList.toggle('dark', resolved === 'dark');
    };

    applyTheme();

    if (theme === 'system') {
      media.addEventListener('change', applyTheme);
      return () => media.removeEventListener('change', applyTheme);
    }
  }, [theme]);
}
