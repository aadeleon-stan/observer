import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS, loadSettings, saveSettings } from './settingsStorage';

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  loaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  loaded: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };

      // Auto-grow reminderTimes when reminderCount increases
      if (patch.reminderCount !== undefined && next.reminderTimes.length < next.reminderCount) {
        const defaultTimes = ['09:00', '11:00', '13:00', '16:00', '19:00'];
        const times = [...next.reminderTimes];
        while (times.length < next.reminderCount) {
          times.push(defaultTimes[times.length] ?? '12:00');
        }
        next.reminderTimes = times;
      }

      // Trim reminderTimes when reminderCount decreases
      if (next.reminderTimes.length > next.reminderCount) {
        next.reminderTimes = next.reminderTimes.slice(0, next.reminderCount);
      }

      saveSettings(next);
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
