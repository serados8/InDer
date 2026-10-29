import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppStateProvider, useAppState } from '../state/AppStateProvider';
import { styles } from '../constants/Theme';

function Routes() {
  const { busy } = useAppState();
  return <Stack screenOptions={{ headerShown: false, animation: 'none', gestureEnabled: !busy }} />;
}

export default function RootLayout() {
  return <SafeAreaProvider><SafeAreaView style={styles.page}>
    <StatusBar style="dark" />
    <AppStateProvider><Routes /></AppStateProvider>
  </SafeAreaView></SafeAreaProvider>;
}
