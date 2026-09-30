export function validateTitle(title: string) {
  if (!title.trim()) throw new Error('Judul catatan wajib diisi.');
}

export function validateReminderDate(date: Date) {
  if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
    throw new Error('Waktu pengingat harus lebih dari waktu sekarang.');
  }
}
