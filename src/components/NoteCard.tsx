import { Pressable, Text, View } from 'react-native';
import { NoteWithReminder } from '../models/Note';
import { colors, styles } from '../constants/Theme';
import { formatDate } from '../utils/DateUtils';
import { StatusBadge } from './StatusBadge';

export function NoteCard({ note, onPress }: { note: NoteWithReminder; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Buka catatan ${note.Title}`} onPress={onPress}
    style={[styles.card, note.IsCompleted && { backgroundColor: '#F0F8F3' }]}>
    <View style={styles.row}>
      <Text style={[styles.heading, { flex: 1 }, note.IsCompleted && { color: colors.primary }]} numberOfLines={2}>{note.Title}</Text>
      <Text style={{ color: colors.muted, fontSize: 24 }}>›</Text>
    </View>
    {!!note.Content && <Text numberOfLines={2} style={styles.muted}>{note.Content}</Text>}
    <StatusBadge label={note.IsCompleted ? '✓ Selesai' : 'Belum selesai'} />
    {note.Reminder && <StatusBadge reminder label={`${new Date(note.Reminder.ReminderDateTime).getTime() <= Date.now()
      ? 'Terlewat' : 'Pengingat'} · ${formatDate(note.Reminder.ReminderDateTime)}`} />}
  </Pressable>;
}
