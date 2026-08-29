import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_HOURS, NOTIFICATION_TITLE, NOTIFICATION_BODY } from '../constants/config';

/**
 * Cancel all pending notifications and reschedule.
 * If `suppressToday` is true, only schedule for tomorrow onward.
 */
export async function rescheduleNotifications(suppressToday = false) {
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const hour of NOTIFICATION_HOURS) {
    const trigger = buildDailyTrigger(hour, suppressToday);
    if (!trigger) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
      },
      trigger,
    });
  }
}

function buildDailyTrigger(
  hour: number,
  suppressToday: boolean,
): Notifications.SchedulableNotificationTriggerInput | null {
  if (suppressToday) {
    // Only schedule starting tomorrow — use a date-based trigger for the first occurrence
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hour, 0, 0, 0);

    return {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    };
  }

  return {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute: 0,
  };
}
