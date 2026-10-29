# Rekaman demo lengkap di iPhone

Rekam versi final setelah menjalankan `npm.cmd start -- --clear`. Gunakan data contoh tanpa informasi pribadi. Target 6–8 menit; boleh menyunting jeda tunggu dengan penanda waktu, tetapi jangan mengganti bukti notifikasi dengan ilustrasi.

1. **Pembukaan:** sebutkan InDer, catatan dan pengingat lokal untuk mahasiswa, tanpa akun/backend.
2. **Input:** tampilkan halaman utama/keadaan kosong jika tersedia. Coba simpan judul kosong dan tunjukkan validasi. Buat `Tugas RPL P7`, isi `Siapkan demo aplikasi`. Buat satu catatan tambahan tanpa isi.
3. **Edit dan pencarian:** edit isi, buka detail, cari sebagian judul lalu isi dengan kapitalisasi berbeda. Cari kata yang tidak ada untuk menunjukkan hasil kosong.
4. **Status dan filter:** tandai selesai; tunjukkan filter Selesai dan Belum selesai; kembalikan status. Jelaskan bahwa selesai tidak otomatis membatalkan pengingat.
5. **Pengingat nyata:** pada catatan pertama pilih 1 Menit dari Sekarang. Simpan, tampilkan detail, filter Memiliki reminder dan ringkasan Home. Kembali ke layar utama iPhone dan rekam notifikasi yang muncul dengan judul yang sesuai.
6. **Edit jadwal:** buat jadwal mendatang, ubah ke waktu yang lebih lambat. Tunjukkan hanya jadwal baru di detail/antrean. Untuk bukti pengiriman lengkap, rekam melewati waktu lama dan waktu baru; boleh lakukan sebagai klip tambahan.
7. **Pembatalan:** hapus pengingat, pastikan catatan tetap ada. Untuk bukti pembatalan native, tunggu melewati waktu yang tadinya dijadwalkan tanpa notifikasi. Uji Batal lalu Hapus pada dialog penghapusan catatan kedua.
8. **Persistensi dan offline:** setelah bundle termuat, matikan internet, buat/edit catatan; nyalakan kembali koneksi pengembangan bila diperlukan. Tutup dan buka aplikasi, pastikan data bertahan. Jangan hapus data Expo Go.
9. **Pengaturan:** tunjukkan izin dan Uji Notifikasi 10 Detik. Periksa keyboard, scroll, dan tombol kembali pada semua layar. Coba waktu lampau dan tunjukkan penolakan.
10. **Penutup:** jelaskan apa yang dikerjakan AI, kode yang kamu review/ubah sendiri, alasan penanganan kegagalan, dan hasil verifikasi. Jangan mengaku mengubah kode jika hanya mereview.

Untuk bukti unit test dosen, lampirkan log di folder `bukti/` atau tambahkan rekaman terminal komputer menjalankan `npm.cmd run test:unit` dan `npm.cmd test` sampai hasil **ALL PASSED** (34 unit; 57 keseluruhan termasuk suite induk). Rekaman terminal dapat digabung dengan demo iPhone.

Simpan hasil akhir sebagai `demo.mp4` di root proyek. Jika iPhone mengekspor MOV, konversikan benar-benar ke MP4 melalui aplikasi editor; jangan sekadar mengganti ekstensi. Putar kembali seluruh video untuk memastikan gambar, suara, notifikasi, serta hasil test terbaca. Perbarui kolom manual di `checklist_mvp.md` sesuai hasil nyata. Video belum dibuat oleh agent karena mahasiswa memilih merekam langsung di iPhone.
