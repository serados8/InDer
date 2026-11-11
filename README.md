# InDer — Instant Reminder

MVP aplikasi catatan pribadi mahasiswa: buat/edit/hapus catatan, status selesai, pencarian judul/isi, filter, dua pengingat terdekat, dan satu pengingat lokal per catatan. Data SQLite tersimpan di perangkat/browser. Tidak ada akun, backend data, atau sinkronisasi cloud.

## Akses demo P8

Demo publik: https://inder-instant-reminder-p8.rhibatulloh5.chatgpt.site

Web mendemonstrasikan alur catatan dan persistensi browser. Notifikasi lokal hanya tersedia di iPhone/Android; gunakan versi native untuk demo reminder. Browser membutuhkan OPFS dan SharedArrayBuffer; gunakan browser modern dalam konteks HTTPS. Data lokal browser terpisah dari data iPhone dan tidak dikirim ke server demo.

Video native P7: [InDer video demo.mp4](docs/pertemuan-7/InDer%20video%20demo.mp4).

## Fresh clone dan instalasi ulang

Prasyarat: Git, Node.js 22.19 atau lebih baru pada seri 22, npm. Proyek menggunakan Expo SDK 58 dan React Native 0.88.1. Gunakan lockfile yang disertakan.

```powershell
git clone --branch feat/p8-security-demo https://github.com/serados8/InDer.git InDer-p8
cd InDer-p8
npm.cmd ci
npm.cmd run verify
npm.cmd run test:unit
npm.cmd run security:scan
```

Branch P8 digunakan selama pull request belum digabung. Setelah merge, clone branch main. Di macOS/Linux gunakan `npm`/`npx` tanpa `.cmd`. Pada Windows, `.cmd` menghindari pembatasan npm.ps1 tanpa mengubah execution policy. `npm ci` menghapus node_modules pada folder clone itu dan menginstal persis sesuai lockfile; jangan menjalankannya pada folder lain yang sedang dipakai proses pengembangan.

## Run aplikasi

```powershell
npm.cmd start -- --clear
```

Komputer dan iPhone berada pada Wi-Fi yang sama. Pindai QR terminal dengan Kamera iPhone dan buka Expo Go yang mendukung SDK 58. Beri izin notifikasi saat diminta. Windows tidak menjalankan simulator iOS; gunakan perangkat fisik. Untuk browser pengembangan: `npm.cmd run web`.

## Build dan jalankan paket demo

```powershell
npm.cmd run build
npm.cmd run demo
```

Buka http://127.0.0.1:4173. Server hanya melayani artefak di dist, dengan header COOP/COEP untuk SQLite. Tidak memerlukan Metro/Expo Go untuk demo web hasil ekspor. Untuk port lain pada PowerShell: `$env:PORT='4174'`, kemudian `npm.cmd run demo`.

`npm run build` mengekspor iOS, Android, dan web; hasilnya bukan APK/IPA. `npm run build:demo` mengekspor web saja. Build native mandiri memerlukan konfigurasi EAS dan signing; belum disediakan sebagai APK/IPA pada P8.

## Deploy publik

Hosting demo menggunakan Sites dengan Worker yang menyajikan aset ekspor dan header COOP/COEP. Hosting statis Sites tidak menerapkan file _headers pada percobaan awal; generator Worker mengatasi hal itu. Tidak ada API penyimpanan data di Worker.

```powershell
npm.cmd run build:demo
node scripts/build-site-worker.mjs dist artifacts/site
```

Output: `artifacts/site/dist/server/index.js`. Untuk memublikasikan melalui Sites, gunakan project ID yang tercatat di [DEPLOYMENT.md](docs/pertemuan-8/DEPLOYMENT.md), salin manifest .openai/hosting.json tanpa bagian static ke checkout hosting, sinkronkan sumber melalui workflow Sites, simpan versi dengan arsip, lalu deploy versi tersebut. Dibutuhkan akses pemilik Sites; fresh clone sendiri tidak memberikan kredensial hosting. Tidak ada token yang disimpan di repository.

Alternatif hosting yang mendukung aset statis: upload isi dist, terapkan public/_headers dan fallback public/_redirects sesuai dukungan provider, lalu periksa header dan alur CRUD. Jangan menyatakan deploy berhasil hanya karena HTTP 200; SQLite dan penyimpanan harus berfungsi.

## Pull request dan verifikasi

Perubahan P8 berada di `feat/p8-security-demo`; target PR adalah `main`. Alur review: fresh clone branch → npm ci → verify → unit test → build → run demo → cek URL publik. Lihat [bukti P8](docs/pertemuan-8/README.md) untuk commit yang diuji dan tautan PR. Jangan commit node_modules, dist, .env, database pribadi, atau token.

| Perintah | Fungsi |
| --- | --- |
| `npm.cmd run verify` | Typecheck, lint, seluruh test; berhenti jika ada kegagalan |
| `npm.cmd run test:unit` | Unit aturan bisnis dan validasi |
| `npm.cmd run test:integration` | Layanan, repository, SQLite nyata dengan notifikasi simulasi |
| `npm.cmd run security:scan` | Heuristik pola rahasia pada file current tree |
| `npm.cmd audit` | Advisory dependensi; masih ada temuan moderate |
| `npx.cmd expo install --check` | Kompatibilitas paket SDK |
| `npx.cmd expo-doctor` | Diagnosis konfigurasi Expo |

Hasil awal P8: **37 unit test PASSED; 62 keseluruhan PASSED**, 0 gagal/skip. Angka total mencakup suite induk. Fresh clone memiliki log terpisah di docs/pertemuan-8/bukti. Audit setelah perbaikan: **10 moderate, 0 high/critical**; bukan security audit bersih.

## Arsitektur dan perilaku

Route Expo Router berada di src/app. UI di src/screens dan src/components, state/koordinasi di src/state, aturan bisnis di src/services, repository/schema di src/database. Alur: UI → Service → Repository → SQLite. Query input menggunakan parameter.

Database inder.db memakai foreign key dan batas satu reminder per catatan. Waktu disimpan ISO UTC dan ditampilkan waktu lokal. Edit pengingat mengganti jadwal lama; hapus catatan/pengingat membatalkan jadwal. Menandai selesai tidak otomatis membatalkan reminder. Pengingat lewat tetap dapat dibaca tetapi tidak masuk ringkasan mendatang.

SQLite dan penjadwal OS tidak satu transaksi atomik. Layanan mencoba memulihkan jadwal jika penyimpanan gagal; penghentian proses di tengah dua operasi tetap merupakan keterbatasan. API notifikasi disimulasikan pada test otomatis; banner harus diuji di perangkat. Menghapus aplikasi/site data dapat menghapus catatan. Database tidak dienkripsi oleh aplikasi; isi notifikasi dapat muncul di layar terkunci.

## Dokumen pengumpulan

- [Hasil security dan perubahan](docs/pertemuan-8/SECURITY.md)
- [Contoh log aman, penyebab, perbaikan](docs/pertemuan-8/SAFE_LOGS.md)
- [Bukti fresh clone, run, build, PR, deploy](docs/pertemuan-8/README.md)
- [Petunjuk menjalankan](HowToRun.md)
- [Checklist MVP P7](checklist_mvp.md) — catatan historis, hasil terbaru ada di P8.

Log aplikasi memakai kode tetap; tidak mencetak isi catatan, ID, token, atau raw Error. Tidak ada collector log eksternal. Temuan minimatch tersisa pada tooling Expo/ESLint dan dibahas di laporan security.
