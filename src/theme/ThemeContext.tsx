import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { lightColors, darkColors, type ColorPalette } from './colors';
import { useSettings } from '../settings/SettingsContext';

interface ThemeContextValue {
  colors: ColorPalette;
  isDark: boolean;
  mode: 'light' | 'dark' | 'auto';
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: 'auto',
});

function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 19;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [autoIsDark, setAutoIsDark] = useState(isNightTime);

  useEffect(() => {
    if (settings.themeMode !== 'auto') return;

    setAutoIsDark(isNightTime());
    const interval = setInterval(() => {
      setAutoIsDark(isNightTime());
    }, 60_000);

    return () => clearInterval(interval);
  }, [settings.themeMode]);

  const value = useMemo<ThemeContextValue>(() => {
    let isDark: boolean;
    if (settings.themeMode === 'dark') isDark = true;
    else if (settings.themeMode === 'light') isDark = false;
    else isDark = autoIsDark;

    return {
      colors: isDark ? darkColors : lightColors,
      isDark,
      mode: settings.themeMode,
    };
  }, [settings.themeMode, autoIsDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
