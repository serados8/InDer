# Hasil uji security dan perubahan P8

Tanggal: 12 November 2026. Lingkup: kode aplikasi, aturan bisnis, repository SQLite, log mutasi, dependency tree, serta server paket demo. Ini pengujian terarah, bukan sertifikasi keamanan atau penetration test menyeluruh.

## Hasil dan bukti

| Pemeriksaan | Hasil | Bukti |
| --- | --- | --- |
| SQL injection pada judul, isi, dan ID | PASSED; payload tersimpan literal, tabel tetap utuh, ID berisi ekspresi SQL tidak memilih catatan lain | `tests/core.test.ts` |
| Log data sensitif dan log injection | PASSED; error berisi isi privat/token/newline tidak masuk log | `tests/unit/safe-log.test.ts` |
| Allowlist kode log | PASSED; kode asing dan key prototype ditolak | `tests/unit/safe-log.test.ts` |
| Kegagalan logger | PASSED; tidak menggagalkan hasil penyimpanan/pemulihan | `tests/unit/safe-log.test.ts` |
| Traversal URL dan dotfile | PASSED; path mentah/encoded, backslash, `.env` ditolak | `tests/demo-server.test.ts` |
| Metode HTTP, MIME WASM, header isolasi | PASSED; hanya GET/HEAD, MIME WASM benar, COOP/COEP/nosniff aktif | `tests/demo-server.test.ts` |
| Validasi, izin ditolak, rollback pengingat | PASSED dalam regresi; API notifikasi disimulasikan | `tests/core.test.ts` dan unit tests |
| Seluruh regresi | 62 PASSED, 0 failed, 0 skipped; termasuk suite induk | `bukti/regression.txt` |
| Audit dependensi awal | 43 temuan: 3 low, 35 moderate, 5 high, 0 critical | `bukti/audit-before.json` |
| Audit setelah perbaikan | 10 moderate, 0 low/high/critical | `bukti/audit-after.json` |

Hitungan audit mencakup paket yang terdampak secara transitif, bukan jumlah eksploit independen. Audit akhir belum bersih; jangan menulis "semua security passed". `npm audit` tetap exit 1 karena temuan moderate.

## Perubahan dan alasan

1. Mempertahankan upgrade SDK 58 yang sudah ada di working tree, lalu menjalankan `npx expo install --fix` untuk patch kompatibel. Expo menjadi 58.0.24, React Native 0.88.1. Installer juga menambahkan plugin expo-status-bar.
2. Pin override Zod 4.6.6 untuk menutup GHSA-mrhx-c7xc-m3w5. Pemakai yang ditemukan adalah eslint-plugin-react-hooks/zod-validation-error dan keduanya menyatakan dukungan Zod 4. Lint, test, dan build dijalankan ulang.
3. Menambahkan logger dengan kode statis; tidak menerima objek Error atau isi catatan. Ini menyediakan diagnosis tanpa membocorkan data pribadi melalui console.
4. Menambahkan test input SQL berbahaya pada repository sebenarnya. Query yang sudah memakai parameter dipertahankan.
5. Menyediakan server demo yang hanya melayani folder hasil ekspor; memblokir traversal, dotfile, ekstensi asing, dan symlink yang keluar dari root. Test traversal tidak mencakup seluruh kemungkinan race filesystem; gunakan folder artefak yang dipercaya.
6. Mengabaikan `.env`, workspace clone, dan artefak hasil build agar tidak ikut commit. Scanner credential bersifat heuristik; tidak membuktikan seluruh riwayat bebas rahasia.

## Temuan yang tersisa

Minimatch 10.2.6 terkena GHSA-g3hv-75wg-m249 (amplifikasi pola glob). Jalur yang ditemukan melalui `@expo/fingerprint` dan tooling TypeScript/ESLint. Catatan pengguna tidak diteruskan ke pola glob dalam aplikasi ini. Perbaikan upstream berada di 11.0.1, di luar rentang mayor yang diminta pemakai. Tidak dilakukan pemaksaan upgrade mayor global; tindak lanjut adalah upgrade pemakai saat versi kompatibel tersedia dan ulangi fresh install/lint/build. Risiko tooling masih ada bila memproses pola dari sumber tidak dipercaya; jangan memasukkan pola pengguna ke tooling tersebut.

SQLite tidak dienkripsi oleh aplikasi. Perlindungan bergantung pada sandbox dan keamanan perangkat/browser. Judul/isi pengingat dapat terlihat di layar terkunci sesuai pengaturan pengguna. Demo publik tidak mengunggah catatan ke backend; data tersimpan per origin/browser. Penghapusan site data menghapus catatan. Tidak ada login atau otorisasi antar pengguna karena tidak ada data server bersama.

React Native Text menampilkan isi sebagai teks, bukan HTML. Test SQL menyimpan payload `<script>` secara literal tetapi bukan pengujian XSS browser menyeluruh. Tidak ada `dangerouslySetInnerHTML`, eval, atau WebView pada kode aplikasi yang direview.

Referensi: [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [Minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249), [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/).
