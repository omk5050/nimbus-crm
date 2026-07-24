import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PreferenceDateFormat, PreferenceDensity } from '@/types/settings.types';

interface PreferencesState {
  emailNotifications: boolean;
  taskReminders: boolean;
  weeklyDigest: boolean;
  density: PreferenceDensity;
  dateFormat: PreferenceDateFormat;

  setEmailNotifications: (value: boolean) => void;
  setTaskReminders: (value: boolean) => void;
  setWeeklyDigest: (value: boolean) => void;
  setDensity: (value: PreferenceDensity) => void;
  setDateFormat: (value: PreferenceDateFormat) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      taskReminders: true,
      weeklyDigest: false,
      density: 'comfortable',
      dateFormat: 'MDY',

      setEmailNotifications: (value) => set({ emailNotifications: value }),
      setTaskReminders: (value) => set({ taskReminders: value }),
      setWeeklyDigest: (value) => set({ weeklyDigest: value }),
      setDensity: (value) => set({ density: value }),
      setDateFormat: (value) => set({ dateFormat: value }),
    }),
    { name: 'nimbus-preferences' },
  ),
);
