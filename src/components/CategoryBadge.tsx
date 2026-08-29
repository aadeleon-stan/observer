import React, { useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import type { Category } from '../types/entry';

interface Props {
  category: Category;
}

export function CategoryBadge({ category }: Props) {
  const { colors, isDark } = useTheme();
  const isReflection = category === 'reflection';

  const styles = useMemo(() => StyleSheet.create({
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: colors.surfaceMuted,
    },
    reflectionBadge: {
      backgroundColor: isDark ? '#2A3340' : '#E8EDF2',
    },
    text: {
      ...typography.label,
      color: colors.observation,
    },
    reflectionText: {
      color: colors.reflection,
    },
  }), [colors, isDark]);

  return (
    <View style={[styles.badge, isReflection && styles.reflectionBadge]}>
      <Text style={[styles.text, isReflection && styles.reflectionText]}>
        {category}
      </Text>
    </View>
  );
}
