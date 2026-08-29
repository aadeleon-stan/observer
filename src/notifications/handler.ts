import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export function setupNotificationHandler() {
  // Set handler for foreground notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    }),
  });

  // Handle notification taps — navigate to write screen
  const subscription = Notifications.addNotificationResponseReceivedListener(() => {
    router.navigate('/(tabs)');
  });

  return () => subscription.remove();
}
