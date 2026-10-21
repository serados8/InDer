# Tugas P6 — Penyempurnaan MVP InDer

## MVP-nya apa?

**InDer — Instant Reminder** adalah aplikasi mobile untuk mahasiswa yang menyimpan catatan dan pengingat secara lokal. Lima user story P6: menyimpan/mengedit catatan, mencari catatan, memfilter status, memvalidasi pengingat, dan melihat pengingat terdekat. Acceptance criteria dan perubahan production terperinci ada di [USER-STORIES.md](USER-STORIES.md).

## Di mana unit test-nya?

Lima file baru berikut menguji aturan bisnis yang benar-benar digunakan aplikasi:

| File | Kasus utama | Jumlah test |
| --- | --- | --- |
| `tests/unit/note-input.test.ts` | Judul wajib, isi opsional, baris isi, Unicode | 4 |
| `tests/unit/note-search.test.ts` | Judul/isi, kapital, query kosong, pencocokan lintas kolom, simbol literal | 5 |
| `tests/unit/note-filter.test.ts` | Semua filter, kombinasi query, data kosong, tidak memutasi input | 5 |
| `tests/unit/reminder-rules.test.ts` | Batas waktu, invalid, status aktif, zona waktu | 5 |
| `tests/unit/upcoming-reminders.test.ts` | Seleksi jadwal, urutan timestamp, tie-break Id, catatan selesai | 5 |

Ada juga dua file unit test P5: `tests/note-validation.test.ts` dan `tests/reminder-validation.test.ts` dengan total 6 test. Jadi **30 unit test** dalam 7 file. `Setup.ts` hanya mentranspilasi TypeScript untuk Node; tidak mengganti fungsi bisnis dengan mock. `Fixtures.ts` menyediakan data uji tetap.

`tests/core.test.ts` terpisah sebagai integration test: SQL/repository nyata pada database sementara dan API notifikasi mock. Hasil total runner termasuk parent suite integrasi, sehingga tidak semuanya disebut unit test.

## Run semua unit test — ALL PASSED

```powershell
npm.cmd run test:unit
```

Hasil pada 22 Oktober 2026: **30 passed, 0 failed, 0 skipped**.

Jalankan seluruh suite termasuk integrasi:

```powershell
npm.cmd test
```

Hasil: **44 passed, 0 failed, 0 skipped**, termasuk parent suite. Output lengkap: [bukti/all-tests.txt](bukti/all-tests.txt).

```powershell
npm.cmd run test:integration
npm.cmd run typecheck
npm.cmd run lint
```

Lint pada sesi verifikasi dijalankan langsung dengan konfigurasi ESLint proyek: `node node_modules/eslint/bin/eslint.js src App.tsx tests` (exit 0). TypeScript juga exit 0. Tidak ada dependensi baru.

## Sudah dijalankan?

Ya, server Expo dijalankan pada port 8092 untuk smoke test dan endpoint status merespons **HTTP 200, packager-status:running**. Halaman web juga diperiksa melalui HTTP. Bundle **iOS dan web berhasil diekspor** ke `dist/`.

- [Log server](bukti/server.txt)
- [Hasil HTTP](bukti/server-status.txt)
- [Log bundling](bukti/bundle.txt)

Ini bukti bundling dan server berjalan, bukan bukti tampilan visual atau semua interaksi iPhone. Tidak ada browser terhubung pada sesi verifikasi. Server verifikasi dihentikan setelah pengambilan bukti.

Untuk demo ulang:

```powershell
npm.cmd install
npm.cmd start
```

Pindai QR dengan Kamera iPhone dan buka di Expo Go yang kompatibel SDK 57. Gunakan Wi-Fi yang sama dengan Windows. Untuk pratinjau browser: `npm.cmd run web`; notifikasi native diuji pada iPhone.

## Dua commit yang diminta

1. **MVP production code:** `aa893ef` — `feat(mvp): refine five user stories and centralize business rules`.
2. **MVP unit test:** commit dengan pesan `test(mvp): cover five business stories and record passing verification`.

```powershell
git log -2 --oneline
git show --stat aa893ef
git show --stat HEAD
```

Commit disimpan lokal; belum di-push oleh AI. File lokal `s` tidak dimasukkan karena bukan bagian tugas.

## Demo review singkat

1. Jelaskan MVP dan lima user story dari tabel acceptance criteria.
2. Buat catatan judul `Tugas RPL` dengan isi opsional; coba judul kosong untuk validasi.
3. Cari `rpl` lalu isi catatan; tunjukkan hasil dan keadaan kosong.
4. Tandai selesai, lalu bandingkan filter Semua/Selesai/Belum selesai/Memiliki reminder.
5. Coba waktu lampau dan waktu mendatang; lihat urutan pengingat di Home.
6. Buka kelima file unit test, jalankan `npm.cmd run test:unit`, lalu `npm.cmd test` hingga seluruh hasil hijau.
7. Tunjukkan dua commit dan jelaskan bug pencarian lintas kolom serta alasan pengurutan timestamp.

## Batas yang harus dijelaskan saat review

Pengiriman notifikasi pengingat catatan pada iPhone belum dikonfirmasi berhasil. Tombol uji 10 detik sebelumnya berhasil, tetapi tidak menggantikan acceptance test pengingat catatan. P6 tidak mengklaim memperbaiki bug perangkat tersebut. Navigasi baseline belum dimigrasikan ke Expo Router; lihat catatan pada user stories.

Mahasiswa tetap perlu menjalankan demo perangkat, membaca diff, dan mencatat review sendiri. Jangan mengklaim unit test sebagai bukti otomatis bahwa notifikasi benar-benar muncul di iOS.
