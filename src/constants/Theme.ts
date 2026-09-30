import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F7F8FA', surface: '#FFFFFF', ink: '#192C35', muted: '#677982',
  primary: '#176B5B', pale: '#E8F3EE', line: '#E2E9E6', amber: '#8B610B', amberPale: '#FFF3D8', danger: '#B53737',
};

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 18, paddingBottom: 36, width: '100%', maxWidth: 680, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 30, fontWeight: '700', color: colors.ink, letterSpacing: -1 },
  heading: { fontSize: 20, fontWeight: '700', color: colors.ink },
  body: { fontSize: 16, lineHeight: 25, color: colors.ink },
  muted: { fontSize: 14, lineHeight: 21, color: colors.muted },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.line, padding: 20, gap: 12 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: 14, padding: 16, minHeight: 52, fontSize: 16, color: colors.ink },
  button: { minHeight: 50, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 18,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  buttonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
