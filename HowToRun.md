# Menjalankan InDer

InDer adalah MVP catatan pribadi dengan pengingat lokal. Data tersimpan di SQLite perangkat, tanpa akun atau backend.

## Persiapan

- Node.js 22.19 atau versi 22 yang lebih baru, npm, dan Git.
- iPhone dengan Expo Go yang mendukung Expo SDK 57.
- Komputer dan iPhone pada Wi-Fi yang sama. Internet diperlukan saat instalasi dependensi.

## Instalasi dan menjalankan

Buka terminal pada folder repository:

```powershell
npm.cmd ci
npm.cmd start -- --clear
```

Pindai QR terminal menggunakan Kamera iPhone dan buka di Expo Go. Izinkan notifikasi saat diminta. Setelah perubahan navigasi ke Expo Router, gunakan `--clear` pada pemuatan pertama. Database tetap bernama `inder.db`; jangan menghapus data Expo Go bila ingin mempertahankan catatan.

Perintah `.cmd` menghindari pembatasan `npm.ps1` di PowerShell. Di macOS/Linux gunakan `npm` tanpa `.cmd`. Windows tidak dapat menjalankan simulator iOS; gunakan iPhone fisik. Jika QR tidak terhubung, periksa Wi-Fi dan izin firewall Node.js pada jaringan privat.

## Verifikasi

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:unit
npm.cmd test
npm.cmd run build
npx.cmd expo-doctor
```

Hasil pada 29 Oktober 2026: unit test **34 PASSED**, seluruh test **57 PASSED, 0 gagal**, lint dan typecheck lulus, ekspor iOS/Android/web berhasil, Expo Doctor 21/21. Angka 57 adalah hitungan test runner termasuk suite induk, bukan 57 alur UI. Log tersedia di `docs/pertemuan-7/bukti/`.

Ekspor menghasilkan `dist/`, bukan IPA/APK. Metro tetap diperlukan untuk memuat proyek pengembangan melalui Expo Go. Untuk pratinjau catatan di browser gunakan `npm.cmd run web`; pengingat native harus diuji pada perangkat. SQLite web membutuhkan dukungan OPFS dan SharedArrayBuffer serta header COOP/COEP dari konfigurasi Metro.

## Uji pengingat di iPhone

1. Buat catatan berjudul jelas, buka detail, lalu atur pengingat **1 Menit dari Sekarang** dan simpan.
2. Kembali ke layar utama iPhone tanpa menghentikan paksa Expo Go. Tunggu notifikasi dan cocokkan judul/isinya.
3. Jika perlu, buka Pengaturan aplikasi dan jalankan **Uji Notifikasi 10 Detik**. Periksa izin Expo Go, Fokus, suara, dan banner pada iPhone.
4. Uji perubahan waktu dan pembatalan sesuai [panduan demo](docs/pertemuan-7/DEMO.md).

Mahasiswa telah mengonfirmasi pengingat catatan berhasil di iPhone sebelum migrasi navigasi final. Ulangi alur pada versi final saat merekam. Pengujian otomatis menggunakan simulasi API notifikasi; itu tidak membuktikan banner iOS muncul.

Menandai catatan selesai tidak membatalkan pengingat. Hapus pengingat secara eksplisit untuk membatalkannya. Pengingat lewat tetap tersimpan, tetapi tidak muncul dalam ringkasan pengingat mendatang. Data tetap lokal; menghapus aplikasi/data Expo Go dapat menghapus catatan.

## Pengumpulan

Sertakan kode, file ini, `checklist_mvp.md`, log pengujian, dan rekaman asli `demo.mp4`. Mahasiswa memilih merekam demo lengkap di iPhone; berkas video belum disertakan oleh agent.
