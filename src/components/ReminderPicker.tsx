import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { Button } from './Button';
import { formatDate } from '../utils/DateUtils';

export function ReminderPicker({ date, onChange }: { date: Date; onChange: (date: Date) => void }) {
  const [mode, setMode] = useState<'date' | 'time' | null>(null);
  return <View style={{ gap: 12 }}>
    <Button label={`Tanggal · ${date.toLocaleDateString('id-ID')}`} secondary onPress={() => setMode('date')} />
    <Button label={`Waktu · ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
      secondary onPress={() => setMode('time')} />
    {mode && <DateTimePicker value={date} mode={mode} locale="id-ID" is24Hour
      display={Platform.OS === 'ios' ? 'spinner' : 'default'} themeVariant="light"
      accessibilityLabel={formatDate(date)} onChange={(_, selected) => {
        if (Platform.OS === 'android') setMode(null);
        if (selected) onChange(selected);
      }} />}
  </View>;
}
