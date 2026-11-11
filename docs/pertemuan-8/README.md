# Pengumpulan P8

MVP: InDer — catatan lokal dan pengingat mahasiswa. Web publik mendemonstrasikan catatan; reminder lokal diuji pada perangkat native.

## Deliverable

1. [Hasil security dan catatan perubahan](SECURITY.md).
2. [README instalasi fresh clone, run, build, deploy](../../README.md).
3. [Contoh log aman dan penanganan error](SAFE_LOGS.md).
4. [Deployment publik](DEPLOYMENT.md), log pengujian di `bukti/`, dan branch `feat/p8-security-demo` untuk review PR.

## Bukti yang dapat direproduksi

```powershell
git clone --branch feat/p8-security-demo https://github.com/serados8/InDer.git InDer-p8
cd InDer-p8
npm.cmd ci
npm.cmd run verify
npm.cmd run test:unit
npm.cmd run security:scan
npm.cmd run build
npm.cmd run demo
```

Fresh clone berarti folder Git baru dari remote, tanpa menyalin node_modules dari workspace lama. Cache unduhan npm boleh digunakan; paket tetap dipasang ulang melalui npm ci. Bukti final mencatat SHA commit dan exit code tiap tahap. Build ekspor tidak sama dengan IPA/APK. HTTP smoke check tidak sama dengan pengujian UI.

## Review mahasiswa

AI Agent melakukan audit dependensi, pembaruan patch SDK, logger aman, pengujian SQL/log/server demo, dokumentasi, fresh clone, serta persiapan PR dan deploy. Mahasiswa perlu mereview diff PR, memahami temuan minimatch yang belum ditutup, dan mencoba URL publik serta aplikasi native. Perubahan atau review yang dilakukan sendiri oleh mahasiswa harus dicatat berdasarkan pekerjaan nyata.

Video native sudah tersedia di `docs/pertemuan-7/InDer video demo.mp4` dari unggahan pengguna. Rekaman itu bukan bukti otomatis versi SDK 58/P8; jika dosen meminta demo versi terbaru, rekam ulang.
