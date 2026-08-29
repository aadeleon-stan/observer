import React, { useState, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet, KeyboardAvoidingView, Keyboard, Platform, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Prompt } from '../../src/components/Prompt';
import { EntryInput } from '../../src/components/EntryInput';
import { SaveConfirmation } from '../../src/components/SaveConfirmation';
import { useDailyGoal } from '../../src/hooks/useDailyGoal';
import { createEntry } from '../../src/db/entries';
import { categorize } from '../../src/types/entry';
import { PROMPT_TEXT } from '../../src/constants/prompts';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

export default function WriteScreen() {
  const db = useSQLiteContext();
  const { hasWrittenToday, recheckGoal } = useDailyGoal();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const canSave = text.trim().length > 0 && !saving;

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const category = categorize(text);
      await createEntry(db, text.trim(), category, PROMPT_TEXT);
      setText('');
      Keyboard.dismiss();
      setShowSaved(true);
      await recheckGoal();
      try {
        const { rescheduleNotifications } = await import('../../src/notifications/scheduler');
        await rescheduleNotifications(true);
      } catch {
        // Notifications not available in Expo Go
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [canSave, text, db, recheckGoal]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Prompt text={PROMPT_TEXT} />
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <EntryInput value={text} onChangeText={setText} />
      </Pressable>
      <View style={styles.bottomBar}>
        {hasWrittenToday && (
          <Text style={styles.doneText}>You've written today</Text>
        )}
        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
            Save
          </Text>
        </Pressable>
      </View>
      <SaveConfirmation visible={showSaved} onDone={() => setShowSaved(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  doneText: {
    ...typography.caption,
    color: colors.success,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  saveButtonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  saveText: {
    ...typography.label,
    color: colors.white,
  },
  saveTextDisabled: {
    color: colors.textMuted,
  },
});
