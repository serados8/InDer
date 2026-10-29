import { router } from 'expo-router';
import { NoteBoundary } from '../../../components/DataBoundary';
import { NoteFormScreen } from '../../../screens/NoteFormScreen';
import { useAppState } from '../../../state/AppStateProvider';
import { NoteService } from '../../../services/NoteService';

export default function EditRoute() {
  const { busy, run } = useAppState();
  return <NoteBoundary>{note => <NoteFormScreen key={note.Id} note={note} busy={busy}
    onCancel={() => router.dismissTo({ pathname: '/notes/[id]', params: { id: note.Id } })}
    onSave={(title, content) => void (async () => {
      if (await run(() => NoteService.save(title, content, note.Id), 'Catatan berhasil diperbarui.')) {
        router.dismissTo({ pathname: '/notes/[id]', params: { id: note.Id } });
      }
    })()} />}</NoteBoundary>;
}
