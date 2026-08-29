import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props {
  text: string;
}

export function Prompt({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  text: {
    ...typography.prompt,
  },
});
