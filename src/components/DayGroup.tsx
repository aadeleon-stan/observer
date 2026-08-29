import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { colors } from '../theme/colors';

interface Props {
  date: string; // "YYYY-MM-DD"
}

export function DayGroup({ date }: Props) {
  const formatted = formatDate(date);

  return <Text style={styles.header}>{formatted}</Text>;
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  header: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
});
