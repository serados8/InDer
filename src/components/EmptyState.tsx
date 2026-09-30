import { Text, View } from 'react-native';
import { styles } from '../constants/Theme';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <View style={[styles.card, { paddingVertical: 32, alignItems: 'center' }]}>
    <Text style={styles.heading}>{title}</Text><Text style={[styles.muted, { textAlign: 'center' }]}>{description}</Text>
  </View>;
}
