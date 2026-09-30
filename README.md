# InDer — Instant Reminder

InDer adalah aplikasi catatan dan pengingat sederhana untuk mahasiswa, dibuat untuk proyek individu Rekayasa Perangkat Lunak. Semua catatan disimpan di perangkat, tanpa akun atau server.

## Fitur

- Buat, edit, dan hapus catatan dengan konfirmasi.
- Tandai selesai atau belum selesai, dengan tampilan hijau untuk catatan selesai.
- Satu pengingat per catatan: buat, ubah, dan hapus notifikasi lokal.
- Cari judul atau isi langsung di halaman utama.
- Filter Semua, Belum selesai, Selesai, dan Memiliki reminder.
- Ringkasan dua pengingat terdekat, status izin, dan pengaturan aplikasi.
- Validasi, pesan keberhasilan, pesan kesalahan, dan keadaan kosong berbahasa Indonesia.

## Teknologi dan struktur

React Native 0.86, TypeScript, Expo SDK 57, Expo SQLite, Expo Notifications, date/time picker bawaan perangkat, dan safe area. Navigasi sederhana memakai state React; tidak memerlukan pustaka navigasi tambahan.

```text
App.tsx
src/
  components/     Tombol, kartu, badge, pencarian, dan pemilih waktu
  constants/      Warna dan gaya bersama
  database/       Inisialisasi, skema, dan repository SQLite
  models/         Note dan Reminder (satu definisi masing-masing)
  navigation/     Navigasi dan koordinasi tindakan pengguna
  screens/        Home, formulir catatan, detail, pengingat, pengaturan
  services/       Aturan catatan, pengingat, dan notifikasi
  utils/          Format tanggal dan validasi
tests/            Uji integrasi layanan dan SQLite
```

Alur: **UI → Service → Repository → SQLite**. Formulir buat dan edit menggunakan satu komponen. Pencarian menyatu dengan Home agar input lebih cepat. Tidak ada data contoh yang otomatis ditambahkan.

## Persyaratan

- Windows dengan Node.js 22.19 atau lebih baru dan npm.
- iPhone fisik dengan Expo Go yang mendukung SDK 57.
- Komputer dan iPhone berada pada Wi-Fi yang sama untuk memuat kode saat pengembangan.
- Internet saat memasang dependensi dan Expo Go. Fitur catatan tidak memerlukan internet setelah aplikasi dimuat.

## Instalasi dan menjalankan di Windows

```powershell
cd "C:\Users\Muhammad Ridho H\Desktop\InDer"
npm install
npx expo start
```

Jika PowerShell memblokir `npm.ps1`, gunakan `npm.cmd install` dan `npx.cmd expo start`, atau Command Prompt. Tidak perlu mengubah execution policy Windows.

1. Pasang dan buka Expo Go di iPhone.
2. Jalankan perintah di atas pada Windows.
3. Pindai QR dari terminal memakai Kamera iPhone, lalu pilih buka di Expo Go.
4. Berikan izin notifikasi saat menyimpan pengingat pertama.
5. Jika koneksi gagal, periksa Wi-Fi dan akses Node.js pada firewall jaringan privat.

`npm run ios` mencoba membuka simulator iOS dan membutuhkan macOS; pada Windows gunakan QR dan iPhone fisik. `npm run android` memerlukan perangkat/emulator Android yang tersedia. Tidak diperlukan akun Expo untuk alur LAN biasa.

| Perintah | Kegunaan |
| --- | --- |
| `npm start` | Server pengembangan dan QR Expo |
| `npm run android` | Buka pada Android |
| `npm run ios` | Buka simulator iOS pada macOS |
| `npm run web` | Pratinjau browser |
| `npm run typecheck` | Periksa TypeScript |
| `npm test` | Uji layanan, SQL, persistensi, dan kontrak notifikasi |
| `npm run build` | Ekspor bundle iOS, Android, dan web ke `dist/` |

Build mengekspor JavaScript/aset untuk verifikasi; tidak membuat IPA/APK dan tidak memublikasikan aplikasi. Expo Go tetap membutuhkan Metro untuk memuat proyek pengembangan. Aplikasi mandiri dapat berjalan tanpa Metro, tetapi pembuatan dan distribusinya di luar lingkup proyek ini.

## SQLite

Database `inder.db` dibuka sekali. Migrasi awal memakai `PRAGMA user_version = 1`, foreign keys, dan WAL. Query dengan input pengguna memakai parameter. Tanggal disimpan sebagai ISO 8601 UTC dan ditampilkan memakai waktu lokal perangkat.

`Notes` berisi Id, Title, Content, CreatedAt, UpdatedAt, IsCompleted. `Reminders` berisi Id, NoteId, ReminderDateTime, IsActive, CreatedAt. `NoteId` unik dan menjadi foreign key dengan `ON DELETE CASCADE`, sehingga satu catatan memiliki nol atau satu pengingat. Boolean disimpan sebagai 0/1, lalu dikonversi pada repository.

Pencarian dan filter dijalankan pada data yang dibaca dari SQLite; sesuai skala proyek kecil. Data bertahan saat aplikasi ditutup. Menghapus aplikasi/data Expo Go dapat menghapus database. Tidak ada pencadangan awan.

## Notifikasi lokal

Notifikasi menggunakan ID stabil `inder-note-<Id>` sehingga pembatalan tetap dapat dilakukan setelah aplikasi dibuka ulang, tanpa kolom tambahan. Edit pengingat membatalkan jadwal lama sebelum menjadwalkan yang baru. Menghapus pengingat atau catatan membatalkan notifikasi terkait. Edit isi catatan memperbarui isi notifikasi yang masih akan datang.

Izin diminta hanya ketika diperlukan atau melalui Pengaturan. Jika ditolak, catatan tetap dapat digunakan. Pengingat baru tidak disimpan bila penjadwalan gagal. Jika penyimpanan database gagal, layanan mencoba membatalkan jadwal baru dan memulihkan jadwal sebelumnya. SQLite dan penjadwal OS merupakan sistem terpisah; penghentian paksa tepat di antara dua operasi tidak dapat dijamin atomik.

Pengingat yang waktunya lewat tetap terlihat dalam detail dan filter; badge menampilkan waktu telah lewat. Home hanya membaca dan menampilkan pengingat mendatang. Menyelesaikan catatan tidak membatalkan pengingat. Gunakan Hapus Pengingat untuk membatalkannya.

Notifikasi ditangani sistem operasi setelah dijadwalkan, termasuk saat aplikasi berada di latar belakang. Focus/Do Not Disturb dan pengaturan perangkat dapat memengaruhi tampilan. Uji pengiriman pada iPhone fisik. Tidak ada token push, server push, atau sinkronisasi.

Pratinjau web menggunakan SQLite browser melalui WASM. Metro dikonfigurasi dengan header COOP/COEP yang diperlukan. Browser harus mendukung SharedArrayBuffer dan penyimpanan OPFS. Notifikasi lokal native tidak tersedia pada web; gunakan iPhone untuk menguji pengingat. Ekspor web harus disajikan dengan header yang sama, bukan dibuka sebagai file HTML langsung.

## Pengujian dan kriteria keberhasilan

`npm test` menjalankan layanan dan query repository yang sebenarnya melalui adapter SQLite Node pada file sementara. API notifikasi diganti simulasi untuk menguji isi, urutan pembatalan, dan kegagalan. Pengujian ini tidak membuktikan notifikasi benar-benar muncul di iOS.

Uji penerimaan pada iPhone:

1. Buat catatan dengan judul kosong: tampilkan validasi. Buat judul valid tanpa isi: berhasil.
2. Edit judul dan isi: detail serta UpdatedAt berubah.
3. Tandai selesai lalu belum selesai; periksa tampilan dan kedua filter.
4. Cari judul dan isi, termasuk huruf besar/kecil; kata tidak cocok menampilkan keadaan kosong.
5. Atur pengingat beberapa menit ke depan dan izinkan notifikasi. Pastikan judul/isi benar saat notifikasi muncul.
6. Edit pengingat; pastikan hanya jadwal baru yang muncul.
7. Hapus pengingat; pastikan notifikasi tidak muncul.
8. Hapus catatan yang mempunyai pengingat; coba Batal terlebih dahulu, kemudian Hapus. Pastikan keduanya hilang.
9. Tutup dan buka ulang aplikasi; catatan dan pengingat tetap tersedia.
10. Tolak izin notifikasi; catatan tetap berfungsi, pengingat menampilkan penjelasan izin.
11. Coba waktu lampau; simpan ditolak.
12. Periksa filter Memiliki reminder dan ringkasan pengingat terdekat.
13. Setelah aplikasi dimuat, matikan internet; buat/edit/cari catatan tetap bekerja.
14. Periksa ukuran layar iPhone kecil, keyboard, scroll, dan pengaturan ukuran teks.

## Batas lingkup

Tidak ada autentikasi, registrasi, backend, cloud database, sinkronisasi, integrasi kalender, kolaborasi, berbagi catatan, AI, suara, pengenalan gambar, chat, sosial, dashboard analitik, grafik, atau publikasi App Store.

## Referensi

Verifikasi pengembangan: TypeScript lulus, 10 skenario integrasi lulus, ekspor iOS/Android/web berhasil, dan Metro berhasil dimulai. Pemeriksaan visual dan pengiriman notifikasi pada iPhone belum dijalankan di lingkungan pengembangan ini. `npm audit` masih melaporkan advisory tingkat sedang dalam dependensi transitif Expo, termasuk `xcode → uuid`; versi SDK dijaga kompatibel tanpa pemaksaan pembaruan mayor.

- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo Notifications dan dukungan notifikasi lokal Expo Go](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Go](https://expo.dev/go)
