import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { categorize } from '../types/entry';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
}

export function EntryInput({ value, onChangeText, autoFocus = false }: Props) {
  const category = categorize(value);
  const charCount = value.length;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Write what you notice..."
        placeholderTextColor={colors.textMuted}
        multiline
        autoFocus={autoFocus}
        textAlignVertical="top"
      />
      <View style={styles.footer}>
        <Text style={[styles.category, category === 'reflection' && styles.reflection]}>
          {category}
        </Text>
        <Text style={styles.count}>{charCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  input: {
    ...typography.body,
    flex: 1,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  category: {
    ...typography.label,
    color: colors.observation,
  },
  reflection: {
    color: colors.reflection,
  },
  count: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
