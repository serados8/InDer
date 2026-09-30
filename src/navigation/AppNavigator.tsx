import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, BackHandler, Modal, Platform, Text, View } from 'react-native';
import { NoteWithReminder } from '../models/Note';
import { NoteService } from '../services/NoteService';
import { ReminderService } from '../services/ReminderService';
import { HomeScreen } from '../screens/HomeScreen';
import { NoteFormScreen } from '../screens/NoteFormScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';
import { ReminderScreen } from '../screens/ReminderScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Button } from '../components/Button';
import { colors, styles } from '../constants/Theme';

type Route = { name: 'home' | 'create' | 'settings' } | { name: 'detail' | 'edit' | 'reminder'; id: number };
interface Confirmation { title: string; action: () => Promise<void> }

export function AppNavigator() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [notes, setNotes] = useState<NoteWithReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const locked = useRef(false);
  const selected = 'id' in route ? notes.find(note => note.Id === route.id) : undefined;

  async function refresh() { setNotes(await NoteService.list()); }
  async function initialize() {
    setLoading(true);
    setError('');
    try { await refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Operasi database gagal.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    void initialize();
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') void refresh().catch(() => setError('Operasi database gagal. Silakan coba lagi.'));
    });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  function back() {
    if (locked.current) return;
    if ((route.name === 'edit' || route.name === 'reminder') && selected) setRoute({ name: 'detail', id: selected.Id });
    else setRoute({ name: 'home' });
  }
  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name === 'home') return false;
      back();
      return true;
    });
    return () => listener.remove();
  }, [route]);

  async function run(action: () => Promise<void>, success: string) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError('');
    try { await action(); await refresh(); setMessage(success); }
    catch (reason) {
      const text = reason instanceof Error ? reason.message : 'Operasi database gagal. Silakan coba lagi.';
      setError(text);
      if (Platform.OS !== 'web') Alert.alert('Belum berhasil', text);
    } finally { locked.current = false; setBusy(false); }
  }

  if (loading) return <View style={[styles.content, { flex: 1, justifyContent: 'center' }]}>
    <ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Membuka catatan…</Text>
  </View>;

  let screen;
  if (route.name === 'home') screen = <HomeScreen notes={notes} onCreate={() => setRoute({ name: 'create' })}
    onOpen={id => setRoute({ name: 'detail', id })} onSettings={() => setRoute({ name: 'settings' })} />;
  else if (route.name === 'settings') screen = <SettingsScreen onBack={back} />;
  else if (route.name === 'create' || (route.name === 'edit' && selected)) {
    screen = <NoteFormScreen key={route.name} note={route.name === 'edit' ? selected : undefined} busy={busy} onCancel={back}
      onSave={(title, content) => void run(async () => {
        const id = await NoteService.save(title, content, route.name === 'edit' ? selected?.Id : undefined);
        setRoute(route.name === 'create' ? { name: 'home' } : { name: 'detail', id });
      }, route.name === 'create' ? 'Catatan berhasil disimpan.' : 'Catatan berhasil diperbarui.')} />;
  } else if (route.name === 'reminder' && selected) {
    screen = <ReminderScreen note={selected} busy={busy} onCancel={back} onSave={date => void run(async () => {
      await ReminderService.save(selected.Id, date);
      setRoute({ name: 'detail', id: selected.Id });
    }, 'Pengingat berhasil disimpan.')} />;
  } else if (selected) {
    screen = <NoteDetailScreen note={selected} busy={busy} onBack={back}
      onEdit={() => setRoute({ name: 'edit', id: selected.Id })}
      onReminder={() => setRoute({ name: 'reminder', id: selected.Id })}
      onComplete={() => void run(() => NoteService.complete(selected.Id, !selected.IsCompleted), 'Status catatan berhasil diperbarui.')}
      onDeleteReminder={() => setConfirmation({ title: 'Hapus pengingat untuk catatan ini?', action: async () => {
        await run(() => ReminderService.delete(selected.Id), 'Pengingat berhasil dihapus.');
      } })}
      onDelete={() => setConfirmation({ title: 'Hapus catatan dan pengingatnya? Tindakan ini tidak dapat dibatalkan.', action: async () => {
        await run(async () => { await NoteService.delete(selected.Id); setRoute({ name: 'home' }); }, 'Catatan berhasil dihapus.');
      } })} />;
  } else screen = <View style={styles.content}><Text style={styles.heading}>Catatan tidak ditemukan.</Text>
    <Button label="Kembali" onPress={back} /></View>;

  return <View style={styles.page}>
    {!!error && <View style={{ padding: 16, backgroundColor: colors.amberPale, gap: 8 }}>
      <Text accessibilityRole="alert" style={styles.body}>{error}</Text>
      <Button label="Coba muat ulang" secondary disabled={busy} onPress={() => void initialize()} />
      <Button label="Tutup pesan" secondary onPress={() => setError('')} />
    </View>}
    {!!message && <Text accessibilityLiveRegion="polite" style={{ padding: 12, color: colors.primary,
      backgroundColor: colors.pale, textAlign: 'center' }}>{message}</Text>}
    {screen}
    <Modal visible={!!confirmation} transparent onRequestClose={() => setConfirmation(null)}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#192C3570' }}>
        <View style={styles.card}><Text style={styles.heading}>Konfirmasi hapus</Text>
          <Text style={styles.body}>{confirmation?.title}</Text>
          <Button label="Hapus" danger onPress={() => { const action = confirmation?.action; setConfirmation(null); void action?.(); }} />
          <Button label="Batal" secondary onPress={() => setConfirmation(null)} />
        </View>
      </View>
    </Modal>
  </View>;
}
