import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Note } from '../models/Note';
import { validateReminderDate } from '../utils/ValidationUtils';

async function scheduleVerified(request: Notifications.NotificationRequestInput, date: Date) {
  validateReminderDate(date);
  const identifier = await Notifications.scheduleNotificationAsync(request);
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (date.getTime() > Date.now() && !scheduled.some(item => item.identifier === identifier)) {
    throw new Error('Jadwal notifikasi tidak ditemukan pada perangkat. Coba simpan pengingat lagi.');
  }
}

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
    }),
  });
}

export const NotificationService = {
  async permission(request = false): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('pengingat', {
        name: 'Pengingat catatan', importance: Notifications.AndroidImportance.HIGH,
      });
    }
    const status = request
      ? await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } })
      : await Notifications.getPermissionsAsync();
    return status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  },
  async cancel(noteId: number) {
    if (Platform.OS !== 'web') await Notifications.cancelScheduledNotificationAsync(`inder-note-${noteId}`);
  },
  async schedule(note: Note, date: Date) {
    await scheduleVerified({
      identifier: `inder-note-${note.Id}`,
      content: {
        title: note.Title,
        body: note.Content.trim() || 'Saatnya memeriksa catatan ini di InDer.',
        sound: 'default', data: { NoteId: note.Id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date,
        ...(Platform.OS === 'android' ? { channelId: 'pengingat' } : {}) },
    }, date);
  },
  async diagnostics() {
    if (Platform.OS === 'web') return ['Notifikasi lokal tersedia di iPhone dan Android.'];
    const status = await Notifications.getPermissionsAsync();
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const lines = [`Pengingat dalam antrean perangkat: ${scheduled.filter(item => item.identifier.startsWith('inder-note-')).length}`];
    if (status.ios) {
      const describe = (value: boolean | null) => value === null ? 'Tidak diketahui' : value ? 'Aktif' : 'Nonaktif';
      if (status.ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        lines.push('Izin sementara: notifikasi dapat masuk tanpa banner atau suara.');
      }
      lines.push(`Banner: ${describe(status.ios.allowsAlert)}`, `Suara: ${describe(status.ios.allowsSound)}`,
        `Layar terkunci: ${describe(status.ios.allowsDisplayOnLockScreen)}`);
    }
    return lines;
  },
  async isScheduled(noteId: number) {
    if (Platform.OS === 'web') return false;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.some(item => item.identifier === `inder-note-${noteId}`);
  },
  onReceived(callback: () => void) {
    if (Platform.OS === 'web') return { remove() {} };
    return Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.identifier.startsWith('inder-')) callback();
    });
  },
  async test() {
    if (!await NotificationService.permission(true)) throw new Error('Izin notifikasi diperlukan untuk menjalankan uji.');
    await Notifications.cancelScheduledNotificationAsync('inder-test');
    const date = new Date(Date.now() + 10000);
    await scheduleVerified({
      identifier: 'inder-test',
      content: { title: 'Uji pengingat InDer', body: 'Notifikasi lokal berhasil diterima.', sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date,
        ...(Platform.OS === 'android' ? { channelId: 'pengingat' } : {}) },
    }, date);
  },
};
