import { Text } from 'react-native';
import { colors } from '../constants/Theme';

export function StatusBadge({ label, reminder = false }: { label: string; reminder?: boolean }) {
  return <Text style={{ alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    fontSize: 12, fontWeight: '600', backgroundColor: reminder ? colors.amberPale : colors.pale,
    color: reminder ? colors.amber : colors.primary }}>{label}</Text>;
}
