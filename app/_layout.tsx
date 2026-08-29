import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from '../src/db/provider';
import { useNotificationSetup } from '../src/hooks/useNotificationSetup';
import { colors } from '../src/theme/colors';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  useNotificationSetup();

  return (
    <DatabaseProvider>
      <StatusBar style="dark" />
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
    </DatabaseProvider>
  );
}
