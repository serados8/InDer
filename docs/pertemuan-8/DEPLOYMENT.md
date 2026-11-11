# Deployment publik InDer P8

URL: https://inder-instant-reminder-p8.rhibatulloh5.chatgpt.site

Provider: Sites. Audience: public (pengguna meminta URL publik). Project ID: `appgprj_6af4bb65527c81918da261bbcc52acda`.

Manifest checkout hosting:

```json
{"project_id":"appgprj_6af4bb65527c81918da261bbcc52acda"}
```

Build aplikasi dengan `npm run build:demo`, lalu jalankan `node scripts/build-site-worker.mjs dist artifacts/site`. Salin hasil Worker ke `dist/server/index.js` pada checkout hosting dan manifest ke `.openai/hosting.json`. Workflow Sites menyinkronkan commit sumber, memaketkan arsip, menyimpan versi, lalu deploy. Kredensial disediakan oleh tool Sites saat diperlukan; jangan menyimpannya di Git atau dokumen.

Versi statis pertama terbit tetapi header COOP/COEP tidak diterapkan; diganti Worker yang mengirim header pada HTML, JS, WASM, dan respons error. Worker hanya menyajikan aset build, tidak menerima atau menyimpan catatan pengguna. File native HBC, sourcemap, database, dan dotfile tidak dimasukkan oleh generator.

Status dan identitas deployment final dicatat pada `bukti/deployment.json`. Verifikasi HTTP dan browser dicatat di laporan P8. Akses mobile native melalui Expo Go tetap tersedia; URL publik tidak mendukung notifikasi native.
