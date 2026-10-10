export function formatDate(value: string | Date) {
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function mergePickerDate(current: Date, selected: Date, mode: 'date' | 'time') {
  const next = new Date(current);
  if (mode === 'date') next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
  else next.setHours(selected.getHours(), selected.getMinutes());
  next.setSeconds(0, 0);
  return next;
}
