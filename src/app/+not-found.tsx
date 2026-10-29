import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { styles } from '../constants/Theme';

export default function NotFoundRoute() {
  return <View style={styles.content}><Text style={styles.heading}>Halaman tidak ditemukan.</Text>
    <Link href="/" style={[styles.body, { paddingVertical: 16 }]}>Kembali ke Catatan</Link>
  </View>;
}
