import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { styles } from './src/constants/Theme';

export default function App() {
  return <SafeAreaProvider><SafeAreaView style={styles.page}>
    <StatusBar style="dark" /><AppNavigator />
  </SafeAreaView></SafeAreaProvider>;
}
