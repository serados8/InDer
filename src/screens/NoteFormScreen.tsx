import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput } from 'react-native';
import { Note } from '../models/Note';
import { styles } from '../constants/Theme';
import { Button } from '../components/Button';
import { validateTitle } from '../utils/ValidationUtils';

interface NoteFormScreenProps {
  note?: Note;
  busy: boolean;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export function NoteFormScreen({ note, busy, onSave, onCancel }: NoteFormScreenProps) {
  const [title, setTitle] = useState(note?.Title ?? '');
  const [content, setContent] = useState(note?.Content ?? '');
  const [error, setError] = useState('');
  function submit() {
    try { validateTitle(title); }
    catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Judul catatan tidak valid.');
      return;
    }
    setError('');
    onSave(title, content);
  }
  return <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text style={styles.title}>{note ? 'Edit catatan' : 'Catatan baru'}</Text>
      <Text style={styles.muted}>Simpan hal penting, lanjutkan harimu.</Text>
      <Text style={styles.label}>Judul</Text>
      <TextInput accessibilityLabel="Judul" autoFocus={!note} style={styles.input} value={title}
        onChangeText={value => { setTitle(value); setError(''); }} placeholder="Apa yang ingin kamu ingat?" editable={!busy} />
      {!!error && <Text accessibilityRole="alert" style={styles.muted}>{error}</Text>}
      <Text style={styles.label}>Isi catatan <Text style={styles.muted}>(opsional)</Text></Text>
      <TextInput accessibilityLabel="Isi catatan" multiline style={[styles.input, { minHeight: 240, textAlignVertical: 'top' }]}
        value={content} onChangeText={setContent} placeholder="Tulis detailnya di sini…" editable={!busy} />
      <Button label={busy ? 'Menyimpan…' : note ? 'Simpan Perubahan' : 'Simpan'} disabled={busy} onPress={submit} />
      <Button label="Batal" secondary disabled={busy} onPress={onCancel} />
    </ScrollView>
  </KeyboardAvoidingView>;
}
