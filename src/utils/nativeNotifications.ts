/**
 * Native OS System Notification utilities (Windows Action Center, macOS Notification Center, Linux).
 */

export async function requestDesktopNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  return Notification.requestPermission();
}

export function isDesktopNotificationGranted(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
}

export function sendDesktopNotification(title: string, body: string, icon?: string) {
  if (!isDesktopNotificationGranted()) return;

  try {
    const notification = new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      tag: `nimbus-notif-${Date.now()}`,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (e) {
    console.debug('Failed to display native system notification:', e);
  }
}
