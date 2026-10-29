# Checklist MVP InDer — Pertemuan 7

Tanggal verifikasi otomatis: 29 Oktober 2026.

MVP: aplikasi catatan pribadi dengan satu pengingat lokal per catatan, pencarian, filter, status selesai, serta penyimpanan SQLite. Tidak mencakup akun, backend, cloud, atau publikasi App Store.

## Fitur dan acceptance criteria

| Fitur | Acceptance criteria | Bukti otomatis | Status perangkat final |
| --- | --- | --- | --- |
| Buat catatan | Judul wajib setelah trim; isi boleh kosong; data tersimpan | PASSED: note-input, note-validation, core | Perlu rekam |
| Detail dan edit | Judul/isi terbaru tersimpan; isi notifikasi mendatang mengikuti perubahan | PASSED: core | Perlu rekam |
| Hapus catatan | Data dan pengingat terkait terhapus; jadwal dibatalkan | PASSED: core; dialog konfirmasi perlu uji UI | Perlu rekam |
| Status selesai | Dapat dibalik; filter sesuai status; kegagalan tidak mengubah data | PASSED: note-filter, core | Perlu rekam |
| Pencarian | Judul/isi, kapitalisasi dan Unicode ditangani; hasil kosong valid | PASSED: note-search | Perlu rekam |
| Filter | Semua, belum selesai, selesai, memiliki pengingat dapat digabung dengan pencarian | PASSED: note-filter, core | Perlu rekam |
| Tambah pengingat | Waktu harus mendatang; izin diperlukan; maksimal satu per catatan | PASSED: reminder-rules, reminder-validation, core | Pengiriman dikonfirmasi mahasiswa; ulangi versi final |
| Edit pengingat | Jadwal lama diganti; pilihan jam mempertahankan tanggal | PASSED: core | Perlu rekam |
| Hapus pengingat | Jadwal dibatalkan; catatan tetap tersedia | PASSED: core | Perlu rekam |
| Ringkasan mendatang | Dua jadwal terdekat, hanya aktif dan mendatang, urutan stabil | PASSED: upcoming-reminders | Perlu rekam |
| Penyimpanan lokal | Data bertahan saat koneksi database dibuka ulang | PASSED: core dengan SQLite Node nyata | Tutup/buka aplikasi saat demo |
| Pengaturan notifikasi | Uji 10 detik terpisah dari jadwal catatan | PASSED: core untuk kontrak layanan | Izin, banner, tombol perlu cek final |
| Pemulihan kegagalan | Gagal simpan tidak merusak data/jadwal lama; gagal refresh tidak mengulang write | PASSED: core, mutation | Pesan/retry perlu cek UI |
| Loading, kosong, rute tidak valid | Ada indikator loading, pesan kosong, retry, dan jalan kembali | Implementasi tersedia; tidak ada automated UI test | Perlu cek manual |
| Navigasi dan integrasi | Route Home/form/detail/pengingat/pengaturan memakai Expo Router | Typecheck, lint, ekspor tiga platform PASSED | Perlu cek back/keyboard/scroll |

## Unit test: PASSED

Enam file unit test aturan bisnis di `tests/unit/`:

1. `note-input.test.ts`: normalisasi dan validasi input.
2. `note-search.test.ts`: aturan pencarian judul/isi.
3. `note-filter.test.ts`: kombinasi status, pengingat, dan pencarian.
4. `reminder-rules.test.ts`: status serta waktu pengingat.
5. `upcoming-reminders.test.ts`: urutan, batas hasil, tanpa mutasi input.
6. `mutation.test.ts`: pemisahan kegagalan write dan refresh, mencegah pengulangan write.

Tambahan validasi ada di `tests/note-validation.test.ts` dan `tests/reminder-validation.test.ts`. `npm run test:unit`: **34 passed, 0 failed, 0 skipped**. [Log unit](docs/pertemuan-7/bukti/unit-test.txt).

`npm test`: **57 passed, 0 failed, 0 skipped** termasuk integrasi layanan/repository dan suite induk. Integrasi menggunakan SQLite Node pada database sementara; notifikasi disimulasikan. [Log regresi, lint, typecheck](docs/pertemuan-7/bukti/regresi.txt).

## Runnable dan batas verifikasi

- [x] Ekspor bundle iOS, Android, web berhasil: [log build](docs/pertemuan-7/bukti/build.txt).
- [x] Server Metro dan HTTP web berhasil: [log smoke](docs/pertemuan-7/bukti/server-status.txt). Ini bukan bukti render atau alur UI.
- [x] Expo Doctor 21/21 pada pemeriksaan pengembangan.
- [x] Mahasiswa mengonfirmasi notifikasi pengingat catatan berhasil di iPhone sebelum migrasi navigasi final.
- [ ] Regresi visual dan alur lengkap versi final di iPhone.
- [ ] `demo.mp4` rekaman asli mahasiswa, mengikuti [panduan demo](docs/pertemuan-7/DEMO.md).

Akses otomatis ke Brave tidak diizinkan oleh alat Computer Use sehingga agent tidak melakukan pemeriksaan visual browser. Jangan mengubah status manual menjadi PASSED sebelum mahasiswa menjalankannya.

## Tanggung jawab mahasiswa

AI Agent mengintegrasikan Router, menangani kegagalan layanan, menambahkan regresi, menjalankan pemeriksaan, dan menyiapkan dokumentasi. Mahasiswa telah menguji pengingat di iPhone dan menyatakan berhasil. Review kode final, perubahan yang dilakukan sendiri, serta hasil demo akhir harus dicatat berdasarkan pekerjaan nyata mahasiswa; belum dapat diklaim oleh agent.
