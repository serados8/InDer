import { TextInput } from 'react-native';
import { colors, styles } from '../constants/Theme';

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <TextInput style={styles.input} placeholder="Cari judul atau isi catatan…" accessibilityLabel="Cari catatan"
    placeholderTextColor={colors.muted} value={value} onChangeText={onChange} returnKeyType="search" clearButtonMode="while-editing" />;
}
