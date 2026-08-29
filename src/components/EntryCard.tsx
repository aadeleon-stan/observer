import React, { useMemo } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { CategoryBadge } from './CategoryBadge';
import type { Entry } from '../types/entry';

interface Props {
  entry: Entry;
  onPress: () => void;
}

export function EntryCard({ entry, onPress }: Props) {
  const { colors } = useTheme();
  const time = new Date(entry.created_at).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  const preview = entry.body.length > 120 ? entry.body.slice(0, 120) + '...' : entry.body;

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    preview: {
      ...typography.body,
      color: colors.text,
    },
    time: {
      ...typography.caption,
      color: colors.textMuted,
    },
  }), [colors]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.preview}>{preview}</Text>
      <CategoryBadge category={entry.category} />
      <Text style={styles.time}>{time}</Text>
    </Pressable>
  );
}
