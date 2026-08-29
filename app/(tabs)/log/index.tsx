import React, { useMemo } from 'react';
import { SectionList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAllEntries } from '../../../src/hooks/useEntries';
import { EntryCard } from '../../../src/components/EntryCard';
import { DayGroup } from '../../../src/components/DayGroup';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import type { Entry } from '../../../src/types/entry';

interface Section {
  date: string;
  data: Entry[];
}

export default function LogScreen() {
  const { colors } = useTheme();
  const { entries, loading } = useAllEntries();

  const sections = useMemo(() => groupByDate(entries), [entries]);

  const styles = useMemo(() => StyleSheet.create({
    list: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.lg,
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

  if (sections.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No entries yet</Text>
      </View>
    );
  }

  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section }) => <DayGroup date={section.date} />}
      renderItem={({ item }) => (
        <EntryCard
          entry={item}
          onPress={() => router.push(`/entry/${item.id}`)}
        />
      )}
      stickySectionHeadersEnabled={false}
    />
  );
}

function groupByDate(entries: Entry[]): Section[] {
  const map = new Map<string, Entry[]>();
  for (const entry of entries) {
    const date = new Date(entry.created_at).toLocaleDateString('sv-SE');
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(entry);
  }
  return Array.from(map.entries()).map(([date, data]) => ({ date, data }));
}
