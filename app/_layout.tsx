import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from '../src/db/provider';
import { SettingsProvider } from '../src/settings/SettingsContext';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { useNotificationSetup } from '../src/hooks/useNotificationSetup';

export { ErrorBoundary } from 'expo-router';

function RootInner() {
  const { colors, isDark } = useTheme();
  useNotificationSetup();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="entry/[id]"
          options={{
            headerShown: true,
            title: '',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerTintColor: colors.accent,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <DatabaseProvider>
          <RootInner />
        </DatabaseProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
