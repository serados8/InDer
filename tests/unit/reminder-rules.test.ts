{
  require('./Setup.ts');
  const { test } = require('node:test');
  const assert = require('node:assert/strict');
  const { validateReminderDate } = require('../../src/utils/ValidationUtils.ts');
  const { isUpcomingReminder } = require('../../src/services/ReminderRules.ts');
  const { makeReminder, referenceTime: now } = require('./Fixtures.ts');

  test('US4: invalid, lampau, dan tepat sekarang ditolak', () => {
    for (const date of [new Date('invalid'), new Date(now - 1), new Date(now)]) {
      assert.throws(() => validateReminderDate(date, now), /lebih dari waktu sekarang/);
    }
  });
  test('US4: satu milidetik di masa depan valid', () => {
    assert.doesNotThrow(() => validateReminderDate(new Date(now + 1), now));
  });
  test('US4: tanpa pengingat, nonaktif, tanggal invalid, dan kedaluwarsa tidak dijadwalkan ulang', () => {
    assert.equal(isUpcomingReminder(null, now), false);
    assert.equal(isUpcomingReminder(makeReminder({ IsActive: false }), now), false);
    assert.equal(isUpcomingReminder(makeReminder({ ReminderDateTime: 'invalid' }), now), false);
    assert.equal(isUpcomingReminder(makeReminder({ ReminderDateTime: new Date(now).toISOString() }), now), false);
  });
  test('US4: pengingat aktif di masa depan layak dijadwalkan', () => {
    assert.equal(isUpcomingReminder(makeReminder(), now), true);
  });
  test('US4: tanggal ISO dengan zona waktu berbeda tetap dibandingkan sebagai waktu absolut', () => {
    assert.equal(isUpcomingReminder(makeReminder({ ReminderDateTime: '2026-10-22T10:01:00+07:00' }), now), true);
    assert.equal(isUpcomingReminder(makeReminder({ ReminderDateTime: '2026-10-22T10:00:00+07:00' }), now), false);
  });
}
