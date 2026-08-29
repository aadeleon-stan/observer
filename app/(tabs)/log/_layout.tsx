import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/colors';

export default function LogLayout() {
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
