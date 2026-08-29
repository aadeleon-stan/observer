import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_TITLE, NOTIFICATION_BODY } from '../constants/config';

export interface NotificationOptions {
  enabled: boolean;
  times: string[]; // HH:MM strings
  jitter: boolean;
  suppressToday: boolean;
}

/**
 * Cancel all pending notifications and reschedule based on options.
 * Accepts either a NotificationOptions object or a boolean for legacy compat.
 */
export async function rescheduleNotifications(options: NotificationOptions | boolean = false) {
  if (Platform.OS === 'web') return;

  // Legacy boolean support
  if (typeof options === 'boolean') {
    options = {
      enabled: true,
      times: ['09:00', '13:00', '19:00'],
      jitter: false,
      suppressToday: options,
    };
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!options.enabled) return;

  for (const time of options.times) {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minuteStr, 10);

    if (options.jitter) {
      // Add random jitter of ±5 minutes, clamped to 0–59
      const jitterMinutes = Math.floor(Math.random() * 11) - 5;
      minute = Math.max(0, Math.min(59, minute + jitterMinutes));
    }

    if (options.suppressToday) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const triggerMinutes = hour * 60 + minute;
      // Skip if this time has already passed or is within the next minute
      if (triggerMinutes <= currentMinutes + 1) continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }
}
