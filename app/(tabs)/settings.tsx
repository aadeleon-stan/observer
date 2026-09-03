import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Switch, Pressable, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import WebTimePicker from '../../src/components/WebTimePicker';

let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}
import { useSettings } from '../../src/settings/SettingsContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

type ThemeMode = 'light' | 'dark' | 'auto';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const timeRowRefs = useRef<(View | null)[]>([]);

  const handleThemeChange = useCallback((mode: ThemeMode) => {
    updateSettings({ themeMode: mode });
  }, [updateSettings]);

  const handleReminderCountChange = useCallback((delta: number) => {
    const next = Math.max(1, Math.min(5, settings.reminderCount + delta));
    updateSettings({ reminderCount: next });
  }, [settings.reminderCount, updateSettings]);

  const handleTimeChange = useCallback((_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setEditingTimeIndex(null);
    }
    if (!date || editingTimeIndex === null) return;
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const newTimes = [...settings.reminderTimes];
    newTimes[editingTimeIndex] = `${hh}:${mm}`;
    updateSettings({ reminderTimes: newTimes });
  }, [editingTimeIndex, settings.reminderTimes, updateSettings]);

  const dismissPicker = useCallback(() => {
    setEditingTimeIndex(null);
  }, []);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 8,
      marginBottom: spacing.xs,
    },
    rowLabel: {
      ...typography.body,
      color: colors.text,
      fontSize: 15,
    },
    radioGroup: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      overflow: 'hidden',
    },
    radioRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    radioSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginHorizontal: spacing.md,
    },
    radioLabel: {
      ...typography.body,
      color: colors.text,
      fontSize: 15,
    },
    radioCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.textMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioCircleSelected: {
      borderColor: colors.accent,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.accent,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    stepperButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepperButtonDisabled: {
      opacity: 0.4,
    },
    stepperText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    stepperValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      minWidth: 20,
      textAlign: 'center',
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 8,
      marginBottom: spacing.xs,
    },
    timeLabel: {
      ...typography.body,
      color: colors.textSecondary,
      fontSize: 14,
    },
    timeValue: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.accent,
    },
    tooltip: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    doneButton: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingVertical: spacing.sm + 2,
      alignItems: 'center',
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    doneText: {
      ...typography.label,
      color: colors.white,
    },
  }), [colors, isDark]);

  function formatTime(time: string): string {
    const [hh, mm] = time.split(':');
    const h = parseInt(hh, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${mm} ${ampm}`;
  }

  function timeToDate(time: string): Date {
    const [hh, mm] = time.split(':');
    const d = new Date();
    d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    return d;
  }

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Automatic', value: 'auto' },
  ];

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      onScroll={(e) => { scrollOffset.current = e.nativeEvent.contentOffset.y; }}
      scrollEventThrottle={16}
    >
      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.radioGroup}>
          {themeOptions.map((opt, i) => (
            <React.Fragment key={opt.value}>
              {i > 0 && <View style={styles.radioSeparator} />}
              <Pressable
                style={styles.radioRow}
                onPress={() => handleThemeChange(opt.value)}
              >
                <Text style={styles.radioLabel}>{opt.label}</Text>
                <View style={[styles.radioCircle, settings.themeMode === opt.value && styles.radioCircleSelected]}>
                  {settings.themeMode === opt.value && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
        {settings.themeMode === 'auto' && (
          <Text style={styles.tooltip}>Light from 6 AM to 7 PM, dark otherwise</Text>
        )}
      </View>

      {/* Reminders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>REMINDERS</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Set reminders</Text>
          <Switch
            value={settings.remindersEnabled}
            onValueChange={(v) => updateSettings({ remindersEnabled: v })}
            trackColor={{ true: colors.accent, false: colors.surfaceMuted }}
            thumbColor={colors.text}
          />
        </View>

        {settings.remindersEnabled && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Daily reminders</Text>
            <View style={styles.stepper}>
              <Pressable
                style={[styles.stepperButton, settings.reminderCount <= 1 && styles.stepperButtonDisabled]}
                onPress={() => handleReminderCountChange(-1)}
                disabled={settings.reminderCount <= 1}
              >
                <Text style={styles.stepperText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{settings.reminderCount}</Text>
              <Pressable
                style={[styles.stepperButton, settings.reminderCount >= 5 && styles.stepperButtonDisabled]}
                onPress={() => handleReminderCountChange(1)}
                disabled={settings.reminderCount >= 5}
              >
                <Text style={styles.stepperText}>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Reminder Times */}
      {settings.remindersEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REMINDER TIMES</Text>
          {settings.reminderTimes.slice(0, settings.reminderCount).map((time, i) => (
            <React.Fragment key={i}>
              <Pressable
                ref={(ref) => { timeRowRefs.current[i] = ref as unknown as View; }}
                style={styles.timeRow}
                onPress={() => {
                  const opening = editingTimeIndex !== i;
                  setEditingTimeIndex(opening ? i : null);
                  if (opening) {
                    setTimeout(() => {
                      timeRowRefs.current[i]?.measure((_x, _y, _w, _h, _px, pageY) => {
                        const contentY = pageY + scrollOffset.current;
                        scrollRef.current?.scrollTo({ y: contentY - spacing.xxl * 2, animated: true });
                      });
                    }, 100);
                  }
                }}
              >
                <Text style={styles.timeLabel}>Reminder {i + 1}</Text>
                <Text style={styles.timeValue}>{formatTime(time)}</Text>
              </Pressable>
              {editingTimeIndex === i && (
                <View>
                  {Platform.OS === 'web' ? (
                    <WebTimePicker
                      value={settings.reminderTimes[i] ?? '12:00'}
                      onChange={(time) => {
                        const newTimes = [...settings.reminderTimes];
                        newTimes[i] = time;
                        updateSettings({ reminderTimes: newTimes });
                      }}
                    />
                  ) : (
                    <>
                      <DateTimePicker
                        value={timeToDate(settings.reminderTimes[i] ?? '12:00')}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleTimeChange}
                        themeVariant={isDark ? 'dark' : 'light'}
                      />
                      {Platform.OS === 'ios' && (
                        <Pressable style={styles.doneButton} onPress={dismissPicker}>
                          <Text style={styles.doneText}>Done</Text>
                        </Pressable>
                      )}
                    </>
                  )}
                </View>
              )}
            </React.Fragment>
          ))}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Add timing jitter</Text>
            <Switch
              value={settings.jitterEnabled}
              onValueChange={(v) => updateSettings({ jitterEnabled: v })}
              trackColor={{ true: colors.accent, false: colors.surfaceMuted }}
              thumbColor={colors.text}
            />
          </View>
          {settings.jitterEnabled && (
            <Text style={styles.tooltip}>Randomly shifts each reminder by up to 5 minutes</Text>
          )}
        </View>
      )}

      {/* After Writing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AFTER WRITING</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Suppress further reminders</Text>
          <Switch
            value={settings.suppressAfterWrite}
            onValueChange={(v) => updateSettings({ suppressAfterWrite: v })}
            trackColor={{ true: colors.accent, false: colors.surfaceMuted }}
            thumbColor={colors.text}
          />
        </View>
        {settings.suppressAfterWrite && (
          <Text style={[styles.tooltip, { marginBottom: spacing.sm }]}>Remaining reminders for the day are cancelled after you save an entry</Text>
        )}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Show writing streak</Text>
          <Switch
            value={settings.showStreak}
            onValueChange={(v) => updateSettings({ showStreak: v })}
            trackColor={{ true: colors.accent, false: colors.surfaceMuted }}
            thumbColor={colors.text}
          />
        </View>
      </View>
    </ScrollView>
  );
}
