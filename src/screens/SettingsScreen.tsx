import { useEffect, useState } from 'react';
import { AppState, Linking, Platform, ScrollView, Text, View } from 'react-native';
import { NotificationService } from '../services/NotificationService';
import { Button } from '../components/Button';
import { styles } from '../constants/Theme';

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState('Memeriksa…');
  const [busy, setBusy] = useState(false);
  async function check(request = false) {
    setBusy(true);
    try { setStatus(await NotificationService.permission(request) ? 'Diizinkan' : 'Belum diizinkan'); }
    catch { setStatus('Status izin gagal diperiksa.'); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    void check();
    const listener = AppState.addEventListener('change', value => { if (value === 'active') void check(); });
    return () => listener.remove();
  }, []);
  return <ScrollView contentContainerStyle={styles.content}>
    <Button label="‹ Kembali" secondary onPress={onBack} />
    <Text style={styles.title}>Pengaturan</Text>
    <View style={styles.card}><Text style={styles.heading}>InDer · Pengingat Instan</Text>
      <Text style={styles.muted}>Versi 1.0.0</Text>
      <Text style={styles.body}>Teman sederhana untuk mencatat ide, tugas, dan hal penting selama kuliah.</Text></View>
    <View style={styles.card}><Text style={styles.heading}>Izin notifikasi</Text><Text style={styles.body}>{status}</Text>
      <Text style={styles.muted}>{Platform.OS === 'web' ? 'Pengingat lokal tersedia di aplikasi iPhone dan Android.'
        : 'Jika izin pernah ditolak, aktifkan notifikasi melalui pengaturan perangkat.'}</Text>
      <Button label="Minta Izin Notifikasi" disabled={busy || Platform.OS === 'web'} onPress={() => void check(true)} />
      {Platform.OS !== 'web' && <Button label="Buka Pengaturan Perangkat" secondary onPress={() => {
        void Linking.openSettings().catch(() => setStatus('Pengaturan perangkat gagal dibuka.'));
      }} />}
    </View>
    <View style={styles.card}><Text style={styles.heading}>Tersimpan di perangkatmu</Text>
      <Text style={styles.body}>Catatan dan pengingat disimpan secara lokal. Tanpa akun, server, atau sinkronisasi awan.</Text>
      <Text style={styles.muted}>Menghapus aplikasi juga dapat menghapus semua catatan.</Text></View>
  </ScrollView>;
}
