import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface WebTimePickerProps {
  value: string; // "HH:MM"
  onChange: (time: string) => void;
}

export default function WebTimePicker({ value, onChange }: WebTimePickerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: 18,
          padding: 8,
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          color: colors.text,
          fontFamily: 'inherit',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
