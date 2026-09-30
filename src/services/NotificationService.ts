import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Note } from '../models/Note';

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
      ? await Notifications.requestPermissionsAsync()
      : await Notifications.getPermissionsAsync();
    return status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  },
  async cancel(noteId: number) {
    if (Platform.OS !== 'web') await Notifications.cancelScheduledNotificationAsync(`inder-note-${noteId}`);
  },
  async schedule(note: Note, date: Date) {
    await Notifications.scheduleNotificationAsync({
      identifier: `inder-note-${note.Id}`,
      content: {
        title: note.Title,
        body: note.Content.trim() || 'Saatnya memeriksa catatan ini di InDer.',
        sound: 'default', data: { NoteId: note.Id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: 'pengingat' },
    });
  },
};
