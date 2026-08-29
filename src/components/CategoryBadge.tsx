import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import type { Category } from '../types/entry';

interface Props {
  category: Category;
}

export function CategoryBadge({ category }: Props) {
  const isReflection = category === 'reflection';

  return (
    <View style={[styles.badge, isReflection && styles.reflectionBadge]}>
      <Text style={[styles.text, isReflection && styles.reflectionText]}>
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
  },
  reflectionBadge: {
    backgroundColor: '#E8EDF2',
  },
  text: {
    ...typography.label,
    color: colors.observation,
  },
  reflectionText: {
    color: colors.reflection,
  },
});
