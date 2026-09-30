import { useState } from 'react';
import { FlatList, ScrollView, Text, View, Pressable } from 'react-native';
import { NoteFilter, NoteWithReminder } from '../models/Note';
import { filterNotes } from '../services/NoteService';
import { colors, styles } from '../constants/Theme';
import { Button } from '../components/Button';
import { SearchBar } from '../components/SearchBar';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../utils/DateUtils';

interface HomeScreenProps {
  notes: NoteWithReminder[];
  onOpen: (id: number) => void;
  onCreate: () => void;
  onSettings: () => void;
}

const filters: NoteFilter[] = ['Semua', 'Belum selesai', 'Selesai', 'Memiliki reminder'];

export function HomeScreen({ notes, onOpen, onCreate, onSettings }: HomeScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NoteFilter>('Semua');
  const upcoming = notes.filter(note => note.Reminder?.IsActive
    && new Date(note.Reminder.ReminderDateTime).getTime() > Date.now())
    .sort((a, b) => a.Reminder!.ReminderDateTime.localeCompare(b.Reminder!.ReminderDateTime));
  const visible = filterNotes(notes, query, filter);
  return <View style={styles.page}>
    <FlatList data={visible} keyExtractor={note => String(note.Id)} contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => <NoteCard note={item} onPress={() => onOpen(item.Id)} />}
      ListHeaderComponent={<View style={{ gap: 24, paddingBottom: 18 }}>
        <View style={styles.row}>
          <View><Text style={styles.title}>InDer<Text style={{ color: colors.primary }}>.</Text></Text>
            <Text style={styles.muted}>Catat cepat, ingat tepat.</Text></View>
          <Button label="Pengaturan" secondary onPress={onSettings} />
        </View>
        <View><Text style={[styles.muted, { marginBottom: 6 }]}>RUANG KECIL UNTUK IDE BESAR</Text>
          <Text style={styles.title}>Satu catatan,{ '\n' }lebih terencana.</Text></View>
        <View style={[styles.card, { backgroundColor: colors.pale, borderColor: '#D2E6DA' }]}>
          <View style={styles.row}><Text style={styles.label}>PENGINGAT MENDATANG</Text>
            <Text style={styles.label}>{upcoming.length}</Text></View>
          {upcoming.length ? upcoming.slice(0, 2).map(note =>
            <Pressable key={note.Id} accessibilityRole="button" onPress={() => onOpen(note.Id)} style={{ minHeight: 48, gap: 4 }}>
              <Text style={styles.heading} numberOfLines={1}>{note.Title}</Text>
              <Text style={styles.muted}>{formatDate(note.Reminder!.ReminderDateTime)}</Text>
            </Pressable>) : <Text style={styles.muted}>Belum ada pengingat. Atur pengingat dari detail catatan.</Text>}
        </View>
        <SearchBar value={query} onChange={setQuery} />
        <View style={styles.row}><Text style={styles.heading}>Catatan saya</Text>
          <Text style={styles.muted}>{visible.length} catatan</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {filters.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: filter === item }}
            onPress={() => setFilter(item)} style={{ minHeight: 44, paddingHorizontal: 16, justifyContent: 'center',
              borderRadius: 22, backgroundColor: filter === item ? colors.primary : colors.surface }}>
            <Text style={{ color: filter === item ? 'white' : colors.muted, fontWeight: '600' }}>{item}</Text>
          </Pressable>)}
        </ScrollView>
      </View>}
      ListEmptyComponent={<EmptyState title={notes.length ? 'Tidak ada catatan yang ditemukan.' : 'Belum ada catatan.'}
        description={notes.length ? 'Coba kata kunci atau filter lainnya.' : 'Ide, tugas, atau rencana hari ini. Mulai dengan satu catatan.'} />} />
    <View style={{ padding: 16, borderTopWidth: 1, borderColor: colors.line, backgroundColor: colors.surface }}>
      <Button label="＋ Tambah Catatan" onPress={onCreate} />
    </View>
  </View>;
}
