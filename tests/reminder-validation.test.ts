{
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { validateReminderDate } = require('../src/utils/ValidationUtils.ts');
  const now = Date.parse('2026-10-22T03:00:00.000Z');
  const message = 'Waktu pengingat harus lebih dari waktu sekarang.';

  test('R1: tanggal tidak valid ditolak', () => {
    assert.throws(() => validateReminderDate(new Date('invalid'), now), { message });
  });

  test('R2: waktu lampau dan tepat sekarang ditolak', () => {
    assert.throws(() => validateReminderDate(new Date(now - 1), now), { message });
    assert.throws(() => validateReminderDate(new Date(now), now), { message });
  });

  test('R3: waktu mendatang diterima tanpa mengubah tanggal input', () => {
    const future = new Date(now + 60000);
    assert.doesNotThrow(() => validateReminderDate(future, now));
    assert.equal(future.getTime(), now + 60000);
  });

  test('R4: zona waktu berbeda dengan momen yang sama menghasilkan validasi yang sama', () => {
    assert.throws(() => validateReminderDate(new Date('2026-10-22T10:00:00+07:00'), now), { message });
    assert.doesNotThrow(() => validateReminderDate(new Date('2026-10-22T10:01:00+07:00'), now));
  });
}
