import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props {
  date: string; // "YYYY-MM-DD"
}

export function DayGroup({ date }: Props) {
  const { colors } = useTheme();
  const formatted = formatDate(date);

  const styles = useMemo(() => StyleSheet.create({
    header: {
      ...typography.caption,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingVertical: spacing.sm,
      marginTop: spacing.md,
    },
  }), [colors]);

  return <Text style={styles.header}>{formatted}</Text>;
}

function formatDate(dateStr: string): string {
  const today = new Date().toLocaleDateString('sv-SE');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
