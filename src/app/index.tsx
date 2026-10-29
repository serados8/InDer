import { router } from 'expo-router';
import { HomeScreen } from '../screens/HomeScreen';
import { useAppState } from '../state/AppStateProvider';
import { DataBoundary } from '../components/DataBoundary';

export default function HomeRoute() {
  const { notes } = useAppState();
  return <DataBoundary><HomeScreen notes={notes} onCreate={() => router.push('/create')}
    onOpen={id => router.push({ pathname: '/notes/[id]', params: { id } })}
    onSettings={() => router.push('/settings')} /></DataBoundary>;
}
