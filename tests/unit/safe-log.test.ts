require('./Setup.ts');
const { test: securityTest } = require('node:test');
const securityAssert = require('node:assert/strict');
const { formatSafeLog, safeLog } = require('../../src/services/SafeLog.ts');
const { performMutation: secureMutation } = require('../../src/services/MutationService.ts');

securityTest('log kegagalan tidak mengandung isi error, catatan, token, atau baris injeksi', async () => {
  const lines: string[] = [];
  const original = console.warn;
  console.warn = line => lines.push(String(line));
  try {
    await secureMutation(async () => { throw new Error('PRIVATE_NOTE token=secret\nFORGED_EVENT'); }, async () => {});
    await secureMutation(async () => {}, async () => { throw new Error('PRIVATE_DATABASE_PATH'); });
  } finally { console.warn = original; }
  securityAssert.equal(lines.length, 2);
  for (const line of lines) {
    securityAssert.doesNotMatch(line, /PRIVATE|secret|FORGED|\n/);
    securityAssert.deepEqual(Object.keys(JSON.parse(line)).sort(), ['action', 'event', 'level']);
  }
});

securityTest('kode log di luar allowlist ditolak termasuk properti prototype', () => {
  securityAssert.throws(() => formatSafeLog('user input\nforged'));
  securityAssert.throws(() => formatSafeLog('__proto__'));
  securityAssert.throws(() => formatSafeLog('toString'));
});

securityTest('kegagalan output log tidak menggagalkan penanganan mutasi', async () => {
  const original = console.warn;
  console.warn = () => { throw new Error('sink unavailable'); };
  try {
    securityAssert.doesNotThrow(() => safeLog('MUTATION_FAILED'));
    const result = await secureMutation(async () => {}, async () => { throw new Error('read failed'); });
    securityAssert.deepEqual(result, { Saved: true, RefreshFailed: true });
  } finally { console.warn = original; }
});
