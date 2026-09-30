import { ScrollView, Text, View } from 'react-native';
import { NoteWithReminder } from '../models/Note';
import { styles } from '../constants/Theme';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/DateUtils';

interface NoteDetailScreenProps {
  note: NoteWithReminder;
  busy: boolean;
  onBack: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onReminder: () => void;
  onDeleteReminder: () => void;
  onDelete: () => void;
}

export function NoteDetailScreen(props: NoteDetailScreenProps) {
  const { note, busy } = props;
  return <ScrollView contentContainerStyle={styles.content}>
    <Button label="‹ Kembali" secondary onPress={props.onBack} disabled={busy} />
    <StatusBadge label={note.IsCompleted ? '✓ Selesai' : 'Belum selesai'} />
    <Text style={styles.title} selectable>{note.Title}</Text>
    <Text style={styles.body} selectable>{note.Content || 'Tidak ada isi catatan.'}</Text>
    <View style={styles.card}>
      <Text style={styles.muted}>Dibuat · {formatDate(note.CreatedAt)}</Text>
      <Text style={styles.muted}>Diperbarui · {formatDate(note.UpdatedAt)}</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.heading}>Pengingat</Text>
      <Text style={styles.muted}>{note.Reminder ? formatDate(note.Reminder.ReminderDateTime) : 'Belum ada pengingat.'}</Text>
      {note.Reminder && <StatusBadge reminder label={new Date(note.Reminder.ReminderDateTime).getTime() > Date.now()
        ? 'Terjadwal' : 'Waktu pengingat telah lewat'} />}
      <Button label={note.Reminder ? 'Edit Pengingat' : 'Atur Pengingat'} secondary disabled={busy} onPress={props.onReminder} />
      {!!note.Reminder && <Button label="Hapus Pengingat" danger disabled={busy} onPress={props.onDeleteReminder} />}
    </View>
    <Button label={note.IsCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'} disabled={busy} onPress={props.onComplete} />
    <Button label="Edit" secondary disabled={busy} onPress={props.onEdit} />
    <Button label="Hapus" danger disabled={busy} onPress={props.onDelete} />
  </ScrollView>;
}
