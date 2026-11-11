# Contoh log aman, penyebab, dan perbaikan

Contoh berikut sintetis, menggunakan format logger yang benar-benar dipanggil `performMutation` saat gagal. Tidak berisi data catatan pengguna, ID catatan, stack trace, path database, token, atau kredensial.

```json
{"event":"MUTATION_FAILED","level":"warn","action":"show_error_and_retry"}
{"event":"REFRESH_FAILED","level":"warn","action":"reload_without_repeating_write"}
```

| Log/gejala | Kemungkinan penyebab | Tindakan perbaikan |
| --- | --- | --- |
| MUTATION_FAILED | Write SQLite gagal, jadwal OS gagal, atau operasi layanan ditolak | Baca pesan aplikasi, pastikan izin jika terkait reminder, lalu ulangi operasi setelah penyebab teratasi. Jangan mencetak raw error untuk diagnosis. |
| REFRESH_FAILED | Write sudah selesai, pembacaan daftar berikutnya gagal | Klik Coba Muat Ulang. Jangan mengulang penyimpanan karena dapat membuat duplikat. |
| DEMO_SERVER_FAILED | Port demo sudah dipakai | Pilih port lain melalui `PORT`, kemudian jalankan ulang. Pesan server tidak mencetak path lokal atau raw error. |
| SharedArrayBuffer/SQLite web gagal dimuat | Header COOP/COEP tidak tersedia atau browser tidak mendukung OPFS | Gunakan HTTPS publik atau localhost, pastikan header deployment, gunakan browser yang mendukung. |
| Notifikasi web tidak tersedia | Demo web tidak memakai penjadwal native | Uji reminder melalui Expo Go/build native pada iPhone/Android. |
| npm ci gagal | Manifest dan lockfile berbeda, koneksi registry gagal, atau cache tidak dapat ditulis | Gunakan commit dan Node yang didokumentasikan; untuk pembaruan paket gunakan expo install lalu commit lockfile. Jangan menghapus lockfile agar instalasi "lulus". |

Kode event menunjukkan tahap kegagalan, bukan diagnosis pasti. Perbaikan harus mengikuti pesan layanan dan reproduksi terkontrol. Log otomatis yang dilampirkan adalah hasil test dengan data sintetis. Tidak ada remote analytics/log collector.

Verifikasi: `npm.cmd run test:unit` menjalankan test bahwa error berisi `PRIVATE_NOTE`, token sintetis, newline, dan path sintetis tidak muncul pada log; logger yang gagal juga tidak mengganggu mutasi.
