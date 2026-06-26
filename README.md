🔗 OG Link Generator
Upload gambar → isi detail → dapat link → share ke Facebook dengan preview besar!
---
LANGKAH 1 — Daftar Cloudinary (Penyimpanan Gambar)
Buka https://cloudinary.com → klik Sign Up Free
Daftar menggunakan email atau Google
Verifikasi email → login
Di halaman Dashboard, catat 3 nilai ini:
Cloud Name → contoh: `dxyz123abc`
API Key → contoh: `123456789012345`
API Secret → contoh: `abcDEFghiJKL` (klik "Reveal" untuk melihat)
---
LANGKAH 2 — Daftar Upstash (Database Redis Gratis)
Buka https://console.upstash.com
Klik Sign Up → daftar dengan GitHub atau email
Setelah login, klik "Create Database"
Isi:
Name: `og-links`
Type: Regional
Region: pilih yang terdekat (misal: Singapore)
Klik Create
Di halaman database, scroll ke bagian REST API
Catat 2 nilai ini:
UPSTASH_REDIS_REST_URL → `https://xxx.upstash.io`
UPSTASH_REDIS_REST_TOKEN → token panjang
---
LANGKAH 3 — Upload Kode ke GitHub
Buka https://github.com → login atau daftar
Klik tombol "+" → New repository
Nama repo: `og-redirector`
Set ke Public → klik Create repository
Di halaman repo yang baru dibuat, klik "uploading an existing file"
Drag & drop semua file dari folder `og-redirector` ini
Klik Commit changes
---
LANGKAH 4 — Deploy ke Vercel
Buka https://vercel.com → login dengan GitHub
Klik "Add New Project"
Pilih repo `og-redirector` → klik Import
Biarkan semua pengaturan default
Klik Deploy
Tunggu selesai — catat URL yang diberikan, contoh: `https://og-redirector.vercel.app`
---
LANGKAH 5 — Tambah Environment Variables di Vercel
Di Vercel, buka project kamu → klik tab Settings
Klik Environment Variables di menu kiri
Tambahkan satu per satu (klik Add → isi Name & Value → Save):
Name	Value
`CLOUDINARY_CLOUD_NAME`	cloud name dari Langkah 1
`CLOUDINARY_API_KEY`	API key dari Langkah 1
`CLOUDINARY_API_SECRET`	API secret dari Langkah 1
`UPSTASH_REDIS_REST_URL`	URL dari Langkah 2
`UPSTASH_REDIS_REST_TOKEN`	Token dari Langkah 2
`NEXT_PUBLIC_APP_URL`	URL Vercel kamu, contoh: `https://og-redirector.vercel.app`
---
LANGKAH 6 — Redeploy
Di Vercel → klik tab Deployments
Klik titik tiga (...) pada deployment terakhir
Klik Redeploy → konfirmasi
Tunggu selesai ✅
---
Cara Pakai Aplikasi
Buka URL Vercel kamu
Upload gambar (otomatis di-crop ke 1200×630)
Isi form:
Judul — teks yang tampil di preview Facebook
Deskripsi — teks di bawah judul (opsional)
URL Tujuan — link yang dibuka saat orang klik preview
Nama Situs — contoh: `BREAKINGNEWS.COM`
Klik Generate Link
Salin link yang muncul
Cara Share ke Facebook
Buka https://developers.facebook.com/tools/debug
Paste link → klik Debug (wajib, untuk refresh cache Facebook)
Buka Facebook → buat postingan baru
Paste link → tunggu preview besar muncul
Hapus teks link jika mau → klik Posting ✅
---
> Link berlaku selama **90 hari** sejak dibuat.
