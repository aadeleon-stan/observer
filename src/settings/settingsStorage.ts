import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'observer_settings';

export interface AppSettings {
  themeMode: 'light' | 'dark' | 'auto';
  remindersEnabled: boolean;
  reminderCount: number;
  reminderTimes: string[]; // HH:MM strings in local time
  jitterEnabled: boolean;
  suppressAfterWrite: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'auto',
  remindersEnabled: true,
  reminderCount: 3,
  reminderTimes: ['09:00', '13:00', '19:00'],
  jitterEnabled: true,
  suppressAfterWrite: true,
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const saved = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
