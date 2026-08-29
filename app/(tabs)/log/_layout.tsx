import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function LogLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.accent,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Log' }} />
      <Stack.Screen name="[date]" options={{ title: '' }} />
    </Stack>
  );
}
