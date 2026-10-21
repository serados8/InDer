# Tugas RPL Pertemuan 5 — InDer MVP Version 1

Paket ini mendokumentasikan dua iterasi peningkatan fitur pada aplikasi InDer yang sudah ada. Riwayat awal tetap dipertahankan; tidak ada klaim bahwa seluruh aplikasi dibuat dengan proses per fitur sejak awal. Jika dosen mensyaratkan proyek baru dari nol, jelaskan konteks baseline ini sebelum pengumpulan.

## Dua fitur inti

1. **Buat/edit catatan lokal** — [Brief → Plan → Build → Verify → Commit](iterasi-1.md).
2. **Atur pengingat catatan** — [Brief → Plan → Build → Verify → Commit](iterasi-2.md).

Fitur lain yang sudah ada tetap tersedia, tetapi bukan fokus dua iterasi ini. Tidak ada backend, login, atau cloud baru.

## Deliverable dan bukti

| Deliverable | Lokasi/status |
| --- | --- |
| Source MVP V1 | Root repository, `src/` |
| Git repository | Repository lokal yang sudah ada; belum di-push oleh AI pada tugas ini |
| Commit iterasi 1 | `ffd2687` — `feat(notes): validate title inline and add focused unit tests` |
| Commit iterasi 2 | Cari pesan `feat(reminders): validate scheduled time inline with boundary tests` di `git log` |
| Unit test | `tests/note-validation.test.ts`, `tests/reminder-validation.test.ts` |
| Integration test | `tests/core.test.ts`: repository SQL nyata, API notifikasi mock |
| Bukti terminal | Folder `bukti/` |
| Demo singkat | Skenario di bawah; rekaman harus dibuat mahasiswa |
| Review mahasiswa | Bagian kosong pada setiap dokumen iterasi, belum diisi oleh AI |

Hasil verifikasi pada 22 Oktober 2026: lint dan TypeScript lulus; test runner melaporkan 20 test lulus, 0 gagal (termasuk parent suite). Bundle iOS berhasil diekspor. Smoke test Metro menghasilkan `HTTP 200 packager-status:running`; lihat `bukti/server-status.txt`. Server verifikasi dihentikan setelah pemeriksaan, sehingga jalankan kembali `npm.cmd start` untuk demo.

## Menjalankan

```powershell
npm.cmd install
npm.cmd start
```

Pindai QR dari Kamera iPhone untuk membuka proyek di Expo Go yang kompatibel SDK 57. Windows dan iPhone perlu terhubung ke jaringan yang sama saat memuat proyek. Panduan lengkap ada di README root.

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
git log -5 --oneline
git show --stat ffd2687
```

Jika pembungkus `expo lint` lambat, pemeriksaan ESLint yang sama dapat dijalankan langsung: `node node_modules/eslint/bin/eslint.js src App.tsx tests`.

## Demo 3–4 menit

1. **0:00–0:30** — Buka aplikasi di iPhone. Jelaskan dua fitur inti dan penyimpanan lokal.
2. **0:30–1:15** — Tambah catatan: judul kosong ditolak dengan pesan inline; isi judul `Demo tugas RPL`, simpan, lalu edit isinya.
3. **1:15–1:45** — Buka ulang proyek dan tunjukkan catatan masih tersedia. Sebutkan perbedaan persistensi perangkat dan test SQLite Node.
4. **1:45–2:15** — Atur pengingat lampau untuk menunjukkan validasi. Pilih `1 Menit dari Sekarang`, simpan, dan tunjukkan status jadwal perangkat.
5. **2:15–3:15** — Sambil menunggu, tunjukkan file unit test, output `npm test`, dan dua commit. Jelaskan satu kasus batas waktu dan alasan perubahan.
6. **3:15–4:00** — Periksa notifikasi. Jika gagal, tampilkan kegagalan dengan jujur dan catat sebagai bug; jangan mengganti bukti pengingat catatan dengan tombol uji 10 detik.

## Yang dikerjakan AI Agent

- Memeriksa baseline dan memilih dua peningkatan fitur yang terbatas.
- Menulis brief, rencana, acceptance criteria, kode validasi formulir, dan unit test.
- Menjalankan pemeriksaan otomatis, merekam output, dan membuat commit terpisah setelah setiap iterasi.
- Menyediakan skenario demo dan pertanyaan review.

## Yang tetap menjadi tanggung jawab mahasiswa

- Baca diff setiap commit dan jelaskan fungsi yang berubah dengan kata-kata sendiri.
- Uji UI pada iPhone; simpan screenshot atau rekaman hasil nyata.
- Isi review dengan perubahan/masukan yang benar-benar dilakukan sendiri.
- Pastikan repositori yang dikumpulkan berisi dua commit ini dan bukti pengujian.
- Jelaskan bahwa unit test membuktikan aturan bisnis, integration test membuktikan alur data, dan uji perangkat membuktikan perilaku end-to-end.

## Status yang belum selesai

Pengiriman notifikasi pengingat catatan pada iPhone belum dikonfirmasi berhasil. Navigasi baseline masih menggunakan state React, belum mengikuti aturan Expo Router pada AGENTS.md terbaru; migrasi navigasi tidak termasuk dua iterasi validasi ini. Jangan menyatakan seluruh acceptance criteria atau seluruh pedoman repository sudah terpenuhi sebelum hal tersebut dituntaskan.
