import { useEffect, useState } from 'react';
import { AppState, Linking, Platform, ScrollView, Text, View } from 'react-native';
import { NotificationService } from '../services/NotificationService';
import { Button } from '../components/Button';
import { styles } from '../constants/Theme';

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState('Memeriksa…');
  const [busy, setBusy] = useState(true);
  const [details, setDetails] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');
  async function check(request = false) {
    try {
      const allowed = await NotificationService.permission(request);
      const diagnostics = await NotificationService.diagnostics();
      setStatus(allowed ? 'Diizinkan' : 'Belum diizinkan');
      setDetails(diagnostics);
    }
    catch { setStatus('Status izin gagal diperiksa.'); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    void Promise.all([NotificationService.permission(), NotificationService.diagnostics()])
      .then(([allowed, diagnostics]) => {
        setStatus(allowed ? 'Diizinkan' : 'Belum diizinkan');
        setDetails(diagnostics);
      })
      .catch(() => setStatus('Status izin gagal diperiksa.'))
      .finally(() => setBusy(false));
    const received = NotificationService.onReceived(() => {
      setTestMessage('Notifikasi diterima aplikasi. Jika banner tidak terlihat, periksa pengaturan banner dan Fokus iPhone.');
      void check();
    });
    const listener = AppState.addEventListener('change', value => { if (value === 'active') void check(); });
    return () => { listener.remove(); received.remove(); };
  }, []);
  async function testNotification() {
    setBusy(true);
    try {
      await NotificationService.test();
      setTestMessage('Uji dijadwalkan 10 detik lagi. Kembali ke layar utama iPhone dan tunggu tanpa menutup paksa Expo Go.');
      setDetails(await NotificationService.diagnostics());
    } catch (error) {
      setTestMessage(error instanceof Error ? error.message : 'Uji notifikasi gagal.');
    } finally { setBusy(false); }
  }
  return <ScrollView contentContainerStyle={styles.content}>
    <Button label="‹ Kembali" secondary onPress={onBack} />
    <Text style={styles.title}>Pengaturan</Text>
    <View style={styles.card}><Text style={styles.heading}>InDer · Pengingat Instan</Text>
      <Text style={styles.muted}>Versi 1.0.0</Text>
      <Text style={styles.body}>Teman sederhana untuk mencatat ide, tugas, dan hal penting selama kuliah.</Text></View>
    <View style={styles.card}><Text style={styles.heading}>Izin notifikasi</Text><Text style={styles.body}>{status}</Text>
      {details.map(detail => <Text key={detail} style={styles.muted}>{detail}</Text>)}
      <Text style={styles.muted}>{Platform.OS === 'web' ? 'Pengingat lokal tersedia di aplikasi iPhone dan Android.'
        : 'Jika izin pernah ditolak, aktifkan notifikasi melalui pengaturan perangkat.'}</Text>
      <Button label="Minta Izin Notifikasi" disabled={busy || Platform.OS === 'web'}
        onPress={() => { setBusy(true); void check(true); }} />
      <Button label="Uji Notifikasi 10 Detik" secondary disabled={busy || Platform.OS === 'web'}
        onPress={() => void testNotification()} />
      {!!testMessage && <Text accessibilityLiveRegion="polite" style={styles.muted}>{testMessage}</Text>}
      {Platform.OS !== 'web' && <Button label="Buka Pengaturan Perangkat" secondary onPress={() => {
        void Linking.openSettings().catch(() => setStatus('Pengaturan perangkat gagal dibuka.'));
      }} />}
    </View>
    <View style={styles.card}><Text style={styles.heading}>Tersimpan di perangkatmu</Text>
      <Text style={styles.body}>Catatan dan pengingat disimpan secara lokal. Tanpa akun, server, atau sinkronisasi awan.</Text>
      <Text style={styles.muted}>Menghapus aplikasi juga dapat menghapus semua catatan.</Text></View>
  </ScrollView>;
}
