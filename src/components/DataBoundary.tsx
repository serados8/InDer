import { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppState } from '../state/AppStateProvider';
import { NoteWithReminder } from '../models/Note';
import { colors, styles } from '../constants/Theme';
import { Button } from './Button';

export function DataBoundary({ children }: { children: ReactNode }) {
  const { loading, loadError, retry } = useAppState();
  if (loading) return <View style={[styles.content, { flex: 1, justifyContent: 'center' }]}>
    <ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Membuka catatan…</Text>
  </View>;
  if (loadError) return <View style={styles.content}><Text style={styles.heading}>Catatan belum dapat dimuat.</Text>
    <Text style={styles.muted}>Data tetap tersimpan. Coba buka kembali database.</Text>
    <Button label="Coba Muat Ulang" onPress={() => void retry()} /></View>;
  return children;
}

export function NoteBoundary({ children }: { children: (note: NoteWithReminder) => ReactNode }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useAppState();
  const note = notes.find(item => item.Id === Number(id));
  return <DataBoundary>{note ? children(note) : <View style={styles.content}>
    <Text style={styles.heading}>Catatan tidak ditemukan.</Text>
    <Button label="Kembali ke Catatan" onPress={() => router.replace('/')} />
  </View>}</DataBoundary>;
}
