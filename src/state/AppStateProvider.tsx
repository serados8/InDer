import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Modal, Text, View } from 'react-native';
import { NoteWithReminder } from '../models/Note';
import { NoteService } from '../services/NoteService';
import { performMutation } from '../services/MutationService';
import { Button } from '../components/Button';
import { colors, styles } from '../constants/Theme';

interface Confirmation { title: string; action: () => Promise<void> }
interface AppStateValue {
  notes: NoteWithReminder[];
  loading: boolean;
  busy: boolean;
  loadError: boolean;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  run: (action: () => Promise<unknown>, success: string) => Promise<boolean>;
  confirm: (title: string, action: () => Promise<void>) => void;
}

const AppContext = createContext<AppStateValue | null>(null);

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('Data aplikasi belum tersedia.');
  return context;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<NoteWithReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const locked = useRef(false);
  const revision = useRef(0);

  const refresh = useCallback(async () => {
    const request = ++revision.current;
    try {
      const storedNotes = await NoteService.list();
      if (request === revision.current) {
        setNotes(storedNotes);
        setLoadError(false);
      }
    } catch (reason) {
      if (request === revision.current) setLoadError(true);
      throw reason;
    }
  }, []);

  useEffect(() => {
    let active = true;
    void NoteService.list().then(storedNotes => { if (active) setNotes(storedNotes); })
      .catch(reason => {
        if (active) {
          setLoadError(true);
          setError(reason instanceof Error ? reason.message : 'Database gagal dibuka.');
        }
      }).finally(() => { if (active) setLoading(false); });
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && !locked.current) {
        void refresh().catch(() => setError('Catatan gagal dimuat. Silakan coba lagi.'));
      }
    });
    return () => { active = false; subscription.remove(); };
  }, [refresh]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  async function run(action: () => Promise<unknown>, success: string) {
    if (locked.current) return false;
    locked.current = true;
    revision.current++;
    setBusy(true);
    setError('');
    setMessage('');
    const result = await performMutation(action, refresh);
    if (result.Saved) {
      setMessage(success);
      if (result.RefreshFailed) setError('Perubahan sudah disimpan, tetapi daftar gagal dimuat. Muat ulang; jangan simpan ulang.');
    } else setError(result.Error);
    locked.current = false;
    setBusy(false);
    return result.Saved;
  }

  async function retry() {
    if (locked.current) return;
    setLoading(true);
    setError('');
    try { await refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Catatan gagal dimuat.'); }
    finally { setLoading(false); }
  }

  return <AppContext.Provider value={{ notes, loading, busy, loadError, refresh, retry, run,
    confirm: (title, action) => { if (!locked.current) setConfirmation({ title, action }); } }}>
    <View style={styles.page}>
      {!!error && <View style={{ padding: 12, gap: 8, backgroundColor: colors.amberPale }}>
        <Text accessibilityRole="alert" style={styles.body}>{error}</Text>
        {loadError && <Button label="Coba Muat Ulang" secondary disabled={busy || loading} onPress={() => void retry()} />}
        <Button label="Tutup Pesan" secondary onPress={() => setError('')} />
      </View>}
      {!!message && <Text accessibilityLiveRegion="polite" style={{ padding: 12, backgroundColor: colors.pale,
        color: colors.primary, textAlign: 'center' }}>{message}</Text>}
      {children}
      <Modal visible={!!confirmation} transparent onRequestClose={() => setConfirmation(null)}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#192C3570' }}>
          <View style={styles.card}>
            <Text style={styles.heading}>Konfirmasi hapus</Text><Text style={styles.body}>{confirmation?.title}</Text>
            <Button label="Hapus" danger onPress={() => {
              const action = confirmation?.action;
              setConfirmation(null);
              void action?.().catch(() => setError('Penghapusan gagal. Silakan coba lagi.'));
            }} />
            <Button label="Batal" secondary onPress={() => setConfirmation(null)} />
          </View>
        </View>
      </Modal>
    </View>
  </AppContext.Provider>;
}
