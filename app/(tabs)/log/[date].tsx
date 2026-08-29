import React, { useMemo } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useEntriesByDate } from '../../../src/hooks/useEntries';
import { EntryCard } from '../../../src/components/EntryCard';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';

export default function DateScreen() {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const { entries, loading } = useEntriesByDate(date ?? '');

  const title = formatTitle(date ?? '');

  const styles = useMemo(() => StyleSheet.create({
    list: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    empty: {
      ...typography.caption,
      color: colors.textMuted,
    },
  }), [colors]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title }} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => router.push(`/entry/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.empty}>No entries for this day</Text>
          </View>
        }
      />
    </>
  );
}

function formatTitle(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
