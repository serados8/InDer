import { router } from 'expo-router';
import { NoteBoundary } from '../../../components/DataBoundary';
import { ReminderScreen } from '../../../screens/ReminderScreen';
import { useAppState } from '../../../state/AppStateProvider';
import { ReminderService } from '../../../services/ReminderService';

export default function ReminderRoute() {
  const { busy, run } = useAppState();
  return <NoteBoundary>{note => <ReminderScreen key={note.Id} note={note} busy={busy}
    onCancel={() => router.dismissTo({ pathname: '/notes/[id]', params: { id: note.Id } })}
    onSave={date => void (async () => {
      if (await run(() => ReminderService.save(note.Id, date), 'Pengingat berhasil disimpan.')) {
        router.dismissTo({ pathname: '/notes/[id]', params: { id: note.Id } });
      }
    })()} />}</NoteBoundary>;
}
