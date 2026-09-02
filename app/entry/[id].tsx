import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { EntryInput } from '../../src/components/EntryInput';
import { CategoryBadge } from '../../src/components/CategoryBadge';
import { useEntry } from '../../src/hooks/useEntries';
import { categorize } from '../../src/types/entry';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

export default function EntryScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entry, loading, update, remove } = useEntry(id ?? '');
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setText(entry.body);
    }
  }, [entry]);

  const handleSave = useCallback(async () => {
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      await update(text.trim(), categorize(text));
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }, [text, saving, update]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Entry', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove();
          router.back();
        },
      },
    ]);
  }, [remove]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    notFound: {
      ...typography.caption,
      color: colors.textMuted,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    date: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    body: {
      ...typography.body,
      color: colors.text,
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      paddingVertical: spacing.md,
    },
    editButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editText: {
      ...typography.label,
      color: colors.accent,
    },
    deleteButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: 8,
    },
    deleteText: {
      ...typography.label,
      color: colors.textMuted,
    },
    editedNote: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.sm,
    },
    cancelButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    saveButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: 8,
    },
    saveText: {
      ...typography.label,
      color: colors.white,
    },
  }), [colors]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Entry not found</Text>
      </View>
    );
  }

  const created = new Date(entry.created_at).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const wasEdited = entry.updated_at !== entry.created_at;
  const editedAt = wasEdited
    ? new Date(entry.updated_at).toLocaleString(undefined, {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  if (editing) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <EntryInput value={text} onChangeText={setText} autoFocus />
        <View style={styles.actions}>
          <Pressable style={styles.cancelButton} onPress={() => { setEditing(false); setText(entry.body); }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.meta}>
        <Text style={styles.date}>{created}</Text>
        <CategoryBadge category={entry.category} />
      </View>
      <Text style={styles.body}>{entry.body}</Text>
      {editedAt && (
        <Text style={styles.editedNote}>Last edited {editedAt}</Text>
      )}
      <View style={styles.actions}>
        <Pressable style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
