import { router } from 'expo-router';
import { NoteBoundary } from '../../../components/DataBoundary';
import { NoteDetailScreen } from '../../../screens/NoteDetailScreen';
import { useAppState } from '../../../state/AppStateProvider';
import { NoteService } from '../../../services/NoteService';
import { ReminderService } from '../../../services/ReminderService';

export default function DetailRoute() {
  const { busy, run, confirm } = useAppState();
  return <NoteBoundary>{note => <NoteDetailScreen note={note} busy={busy}
    onBack={() => router.dismissTo('/')}
    onEdit={() => router.push({ pathname: '/notes/[id]/edit', params: { id: note.Id } })}
    onReminder={() => router.push({ pathname: '/notes/[id]/reminder', params: { id: note.Id } })}
    onComplete={() => void run(() => NoteService.complete(note.Id, !note.IsCompleted), 'Status catatan berhasil diperbarui.')}
    onDeleteReminder={() => confirm('Hapus pengingat untuk catatan ini?', async () => {
      await run(() => ReminderService.delete(note.Id), 'Pengingat berhasil dihapus.');
    })}
    onDelete={() => confirm('Hapus catatan dan pengingatnya? Tindakan ini tidak dapat dibatalkan.', async () => {
      if (await run(() => NoteService.delete(note.Id), 'Catatan berhasil dihapus.')) router.dismissTo('/');
    })} />}</NoteBoundary>;
}
