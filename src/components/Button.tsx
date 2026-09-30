import { Pressable, Text } from 'react-native';
import { colors, styles } from '../constants/Theme';

interface ButtonProps { label: string; onPress: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean }

export function Button({ label, onPress, secondary, danger, disabled }: ButtonProps) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && { backgroundColor: colors.pale },
      danger && { backgroundColor: '#FBECEC' }, { opacity: disabled || pressed ? 0.55 : 1 }]}>
    <Text style={[styles.buttonText, secondary && { color: colors.primary }, danger && { color: colors.danger }]}>{label}</Text>
  </Pressable>;
}
