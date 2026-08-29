import { useEffect } from 'react';

export function useNotificationSetup() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const { setupNotificationHandler } = await import('../notifications/handler');
        const { requestNotificationPermissions } = await import('../notifications/permissions');
        const { rescheduleNotifications } = await import('../notifications/scheduler');

        cleanup = setupNotificationHandler();

        const granted = await requestNotificationPermissions();
        if (granted) {
          await rescheduleNotifications(false);
        }
      } catch {
        // Notifications not available (e.g. Expo Go) — silently skip
      }
    })();

    return () => cleanup?.();
  }, []);
}
