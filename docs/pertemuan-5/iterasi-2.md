# Iterasi 2 — Atur pengingat catatan

## Brief

Pengguna memilih waktu pengingat untuk sebuah catatan. Waktu wajib valid dan lebih dari waktu sekarang. Baseline sudah memiliki penyimpanan dan notifikasi lokal. Iterasi ini memperbaiki umpan balik validasi sebelum penyimpanan serta menguji batas waktu secara deterministik.

## Plan

1. Gunakan validator service juga pada formulir pengingat.
2. Pertahankan nilai input ketika validasi gagal; hapus pesan ketika pengguna mengganti waktu.
3. Tambahkan parameter waktu acuan opsional pada validator untuk unit test tanpa bergantung pada jam komputer.
4. Verifikasi nilai invalid, lampau, tepat sekarang, mendatang, dan representasi zona waktu.
5. Jalankan lint, typecheck, seluruh test, ekspor bundle iOS, dan smoke test server Expo sebelum commit.

## Acceptance criteria

| ID | Kriteria | Bukti |
| --- | --- | --- |
| R1 | Tanggal invalid ditolak | `tests/reminder-validation.test.ts` |
| R2 | Waktu lampau dan tepat sekarang ditolak | `tests/reminder-validation.test.ts` |
| R3 | Waktu mendatang diterima tanpa mutasi input | `tests/reminder-validation.test.ts` |
| R4 | Zona waktu diperlakukan sebagai momen yang konsisten | `tests/reminder-validation.test.ts` |
| R5 | Buat/edit/hapus pengingat menjaga SQLite dan pembatalan jadwal | `tests/core.test.ts`, notifikasi memakai mock |
| R6 | Pesan inline muncul; jadwal satu menit berhasil disimpan dan notifikasi tiba di iPhone | Uji manual mahasiswa; BELUM terkonfirmasi |

## Build

AI Agent mengubah `ReminderScreen` untuk memvalidasi sebelum submit, menggunakan aturan bersama dari `ValidationUtils`, dan menambah unit test khusus. Nilai `now` default tetap menggunakan jam saat fungsi dipanggil; test dapat menyuntikkan waktu tetap. Validasi di service tetap menjadi lapisan perlindungan sebelum penjadwalan.

## Verify

Lihat `bukti/iterasi-2.txt`, `bukti/bundle-ios.txt`, dan `bukti/server-expo.txt`. Ekspor bundle dan status server membuktikan kode dapat dibundel dan Metro berjalan; keduanya tidak membuktikan UI atau pengiriman notifikasi pada iPhone.

Laporan pengguna sebelumnya: tombol uji 10 detik berhasil, sedangkan pengingat catatan gagal. Perubahan validasi pada iterasi ini tidak diklaim menyelesaikan penyebab pengiriman tersebut. Acceptance criterion R6 tetap terbuka sampai diuji ulang di perangkat.

## Commit

Pesan yang direncanakan: `feat(reminders): validate scheduled time inline with boundary tests`.
Hash aktual tersedia melalui `git log --oneline`.

## Review mahasiswa — isi setelah dilakukan

- Jelaskan mengapa waktu sama dengan sekarang ditolak: …
- Jelaskan perbedaan test notifikasi mock dan pengiriman nyata: …
- Kode yang saya review/ubah sendiri dan alasannya: …
- Waktu pengingat yang saya pilih dan waktu notifikasi diterima: …
- Hasil R6, perangkat/versi iOS/Expo Go, lokasi screenshot/video: …
- Temuan yang belum selesai: …
