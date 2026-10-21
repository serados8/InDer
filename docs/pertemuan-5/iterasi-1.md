# Iterasi 1 — Buat dan edit catatan lokal

## Brief

Pengguna perlu membuat catatan dengan judul wajib dan isi opsional. Baseline `409a288` sudah memiliki CRUD dan SQLite. Iterasi ini memperbaiki validasi formulir yang sebelumnya baru muncul melalui penanganan error global. Ini peningkatan fitur yang sudah ada, bukan implementasi dari nol.

## Plan

1. Pakai validator judul yang sama di UI dan service.
2. Tampilkan error di dekat kolom judul, pertahankan isi formulir, dan jangan panggil penyimpanan untuk judul kosong.
3. Tambahkan unit test validator tanpa React Native, database, atau mock notifikasi.
4. Jalankan lint, typecheck, unit test, dan integrasi SQLite sebelum commit.

## Acceptance criteria

| ID | Kriteria | Bukti |
| --- | --- | --- |
| N1 | Judul kosong/whitespace ditolak dengan pesan Indonesia | `tests/note-validation.test.ts` |
| N2 | Judul valid diterima, termasuk apostrof/emoji | `tests/note-validation.test.ts` |
| N3 | Catatan tersimpan di SQLite dan bertahan saat database dibuka ulang | `tests/core.test.ts` |
| N4 | Edit memperbarui judul/isi; status selesai dapat dibalik | `tests/core.test.ts` |
| N5 | Error tampil di dekat judul, isi tidak hilang, judul valid dapat disimpan | Uji manual mahasiswa; belum diklaim lulus |

## Build

AI Agent menambahkan validasi sebelum submit di `NoteFormScreen`, pesan inline, penghapusan pesan saat judul diperbaiki, dan file unit test khusus. Validasi service tetap dipertahankan agar aturan tidak bergantung pada UI.

## Verify

Hasil terminal iterasi ini disimpan di `bukti/iterasi-1.txt`. Pengujian integrasi menggunakan SQLite nyata melalui adapter Node; pengujian itu tidak menguji rendering UI iPhone.

## Commit

Pesan yang direncanakan: `feat(notes): validate title inline and add focused unit tests`.
Lihat hash aktual dengan `git log --oneline` setelah commit dibuat.

## Review mahasiswa — isi setelah benar-benar dilakukan

- File/fungsi yang saya baca: …
- Masukan atau perubahan yang saya lakukan sendiri: …
- Alasan perubahan: …
- Hasil uji manual N5 dan lokasi screenshot/video: …
- Hal yang masih belum saya pahami: …

Jangan mengisi bagian ini seolah-olah pekerjaan AI dilakukan mahasiswa. Jika belum mengubah kode sendiri, tulis keadaan sebenarnya dan diskusikan temuan review.
