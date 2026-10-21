import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { NoteWithReminder } from '../models/Note';
import { styles } from '../constants/Theme';
import { Button } from '../components/Button';
import { ReminderPicker } from '../components/ReminderPicker';
import { formatDate } from '../utils/DateUtils';
import { useNow } from '../hooks/useNow';
import { validateReminderDate } from '../utils/ValidationUtils';

interface ReminderScreenProps { note: NoteWithReminder; busy: boolean; onSave: (date: Date) => void; onCancel: () => void }

export function ReminderScreen({ note, busy, onSave, onCancel }: ReminderScreenProps) {
  const now = useNow();
  const [error, setError] = useState('');
  const [date, setDate] = useState(() => {
    const initial = note.Reminder ? new Date(note.Reminder.ReminderDateTime) : new Date(Date.now() + 3600000);
    initial.setSeconds(0, 0);
    return initial;
  });
  function changeDate(value: Date) {
    setDate(value);
    setError('');
  }
  function submit() {
    try { validateReminderDate(date); }
    catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Waktu pengingat tidak valid.');
      return;
    }
    setError('');
    onSave(date);
  }
  return <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Atur pengingat</Text>
    <Text style={styles.muted}>UNTUK CATATAN</Text><Text style={styles.heading}>{note.Title}</Text>
    <Text style={styles.body}>Kapan kamu ingin diingatkan?</Text>
    <ReminderPicker date={date} onChange={changeDate} />
    <Button label="1 Menit dari Sekarang" secondary disabled={busy}
      onPress={() => changeDate(new Date(Date.now() + 60000))} />
    <Text style={styles.muted}>{formatDate(date)} · waktu perangkat</Text>
    <Text style={styles.muted}>{date.getTime() > now
      ? `Pengingat berbunyi sekitar ${Math.ceil((date.getTime() - now) / 60000)} menit lagi.`
      : 'Waktu sudah lewat. Pilih waktu mendatang.'}</Text>
    {!!error && <Text accessibilityRole="alert" style={styles.muted}>{error}</Text>}
    <Button label={busy ? 'Menyimpan…' : 'Simpan Pengingat'} disabled={busy} onPress={submit} />
    <Button label="Batal" secondary disabled={busy} onPress={onCancel} />
  </ScrollView>;
}
