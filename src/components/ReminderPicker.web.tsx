export function ReminderPicker({ date, onChange }: { date: Date; onChange: (date: Date) => void }) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  return <input aria-label="Tanggal dan waktu pengingat" type="datetime-local" value={local}
    style={{ padding: 16, borderRadius: 12, border: '1px solid #E2E9E6', fontSize: 16 }}
    onChange={event => { const next = new Date(event.target.value); if (Number.isFinite(next.getTime())) onChange(next); }} />;
}
