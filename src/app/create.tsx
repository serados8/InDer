import { router } from 'expo-router';
import { NoteFormScreen } from '../screens/NoteFormScreen';
import { useAppState } from '../state/AppStateProvider';
import { NoteService } from '../services/NoteService';
import { DataBoundary } from '../components/DataBoundary';

export default function CreateRoute() {
  const { busy, run } = useAppState();
  return <DataBoundary><NoteFormScreen busy={busy} onCancel={() => router.dismissTo('/')}
    onSave={(title, content) => void (async () => {
      if (await run(() => NoteService.save(title, content), 'Catatan berhasil disimpan.')) router.dismissTo('/');
    })()} /></DataBoundary>;
}
