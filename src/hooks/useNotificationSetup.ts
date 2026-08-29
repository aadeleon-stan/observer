import { useEffect } from 'react';
import { useSettings } from '../settings/SettingsContext';

export function useNotificationSetup() {
  const { settings, loaded } = useSettings();

  useEffect(() => {
    if (!loaded) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const { setupNotificationHandler } = await import('../notifications/handler');
        const { requestNotificationPermissions } = await import('../notifications/permissions');
        const { rescheduleNotifications } = await import('../notifications/scheduler');

        cleanup = setupNotificationHandler();

        const granted = await requestNotificationPermissions();
        if (granted) {
          await rescheduleNotifications({
            enabled: settings.remindersEnabled,
            times: settings.reminderTimes,
            jitter: settings.jitterEnabled,
            suppressToday: false,
          });
        }
      } catch {
        // Notifications not available (e.g. Expo Go) — silently skip
      }
    })();

    return () => cleanup?.();
  }, [loaded, settings.remindersEnabled, settings.reminderTimes, settings.jitterEnabled]);
}
