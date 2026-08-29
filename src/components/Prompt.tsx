import React, { useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props {
  text: string;
}

export function Prompt({ text }: Props) {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xxl,
      paddingBottom: spacing.lg,
    },
    text: {
      ...typography.prompt,
      color: colors.textSecondary,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
