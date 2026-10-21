# InDer — Penyempurnaan MVP P6

MVP: aplikasi mobile mahasiswa untuk catatan dan pengingat lokal, menggunakan Expo/React Native, TypeScript, SQLite, dan notifikasi lokal. Tanpa akun, backend, atau sinkronisasi awan. P6 menyempurnakan lima perilaku pada MVP yang sudah ada; bukan lima aplikasi atau fitur baru di luar lingkup.

| ID | User story | Acceptance criteria | Implementasi / bukti unit |
| --- | --- | --- | --- |
| US1 | Sebagai mahasiswa, saya ingin menyimpan dan mengedit catatan agar tugas tersimpan rapi. | Judul whitespace ditolak; isi boleh kosong; spasi luar dibuang tanpa merusak baris isi; Unicode ekuivalen dinormalisasi; aturan sama untuk create/edit. | `prepareNoteInput`, `NoteService.save`; `note-input.test.ts` |
| US2 | Sebagai mahasiswa, saya ingin mencari judul atau isi agar catatan cepat ditemukan. | Pencarian tidak peka kapital; spasi luar query diabaikan; Unicode ekuivalen cocok; query kosong menampilkan semua; kata harus cocok dalam salah satu kolom, bukan hasil menyambung judul dan isi; simbol `%`/`_` dianggap literal. | `matchesNoteSearch`; `note-search.test.ts` |
| US3 | Sebagai mahasiswa, saya ingin memfilter catatan berdasarkan status agar mudah memilih tugas. | Semua mencakup semua; selesai/belum selesai saling terpisah; memiliki reminder mencakup setiap catatan dengan record pengingat, termasuk yang waktunya lewat; pencarian dan filter memakai AND; urutan sumber dipertahankan dan input tidak dimutasi. | `matchesNoteFilter`, `filterNotes`; `note-filter.test.ts` |
| US4 | Sebagai mahasiswa, saya ingin mengatur pengingat pada waktu valid agar tidak menjadwalkan waktu lampau. | Tanggal invalid, lampau, dan tepat sekarang ditolak; waktu mendatang diterima; perbandingan konsisten antar zona waktu; hanya record aktif dengan waktu mendatang layak dijadwalkan kembali ketika catatan diedit/pemulihan gagal simpan. | `validateReminderDate`, `isUpcomingReminder`, service; `reminder-rules.test.ts` |
| US5 | Sebagai mahasiswa, saya ingin melihat pengingat terdekat agar tahu kegiatan berikutnya. | Hanya pengingat aktif dan mendatang muncul; urutan berdasarkan timestamp, bukan teks tanggal; waktu sama diurutkan menurut Id; array asal tidak berubah; catatan selesai tetap diingatkan sampai pengingat dihapus, sesuai kebijakan MVP. | `getUpcomingNotes`, Home; `upcoming-reminders.test.ts` |

## Perubahan production

Aturan murni dipisahkan dari SQLite/notifikasi agar bisa diuji tanpa perangkat. Service tetap mengoordinasikan penyimpanan dan pembatalan notifikasi; UI memakai aturan yang sama melalui service. Pencarian sebelumnya menyambung judul dan isi, sehingga frasa yang tidak ada di kedua kolom dapat cocok secara keliru. Pengurutan sebelumnya memakai teks tanggal, yang tidak selalu sejalan dengan waktu ketika offset zona waktu berbeda.

Tidak ada perubahan navigasi atau penambahan dependensi. Navigasi baseline masih memakai state React dan belum dimigrasikan ke Expo Router sebagaimana catatan P5.

## Batas bukti

Unit test menguji aturan bisnis murni. `tests/core.test.ts` merupakan integrasi SQLite dengan notifikasi mock, bukan uji pengiriman iPhone. Pengiriman pengingat catatan pada iPhone belum dikonfirmasi berhasil oleh mahasiswa; jangan menyamakan semua unit test lulus dengan semua skenario perangkat lulus.
