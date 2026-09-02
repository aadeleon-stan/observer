import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.accent,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Write',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>✎</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>☰</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⊙</Text>
          ),
        }}
      />
    </Tabs>
  );
}
