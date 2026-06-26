# 🔗 OG Link Generator 

Upload gambar → isi detail → dapat link → share ke Facebook dengan preview besar!

---

## LANGKAH 1 — Daftar Cloudinary (Penyimpanan Gambar)

1. Buka **https://cloudinary.com** → klik **Sign Up Free**
2. Daftar menggunakan email atau Google
3. Verifikasi email → login
4. Di halaman Dashboard, catat 3 nilai ini:
   - **Cloud Name** → contoh: `dxyz123abc`
   - **API Key** → contoh: `123456789012345`
   - **API Secret** → contoh: `abcDEFghiJKL` (klik "Reveal" untuk melihat)

---

## LANGKAH 2 — Daftar Upstash (Database Redis Gratis)

1. Buka **https://console.upstash.com**
2. Klik **Sign Up** → daftar dengan GitHub atau email
3. Setelah login, klik **"Create Database"**
4. Isi:
   - **Name**: `og-links`
   - **Type**: Regional
   - **Region**: pilih yang terdekat (misal: Singapore)
5. Klik **Create**
6. Di halaman database, scroll ke bagian **REST API**
7. Catat 2 nilai ini:
   - **UPSTASH_REDIS_REST_URL** → `https://xxx.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN** → token panjang

---

## LANGKAH 3 — Upload Kode ke GitHub

1. Buka **https://github.com** → login atau daftar
2. Klik tombol **"+"** → **New repository**
3. Nama repo: `og-redirector`
4. Set ke **Public** → klik **Create repository**
5. Di halaman repo yang baru dibuat, klik **"uploading an existing file"**
6. Drag & drop semua file dari folder `og-redirector` ini
7. Klik **Commit changes**

---

## LANGKAH 4 — Deploy ke Vercel

1. Buka **https://vercel.com** → login dengan GitHub
2. Klik **"Add New Project"**
3. Pilih repo **`og-redirector`** → klik **Import**
4. Biarkan semua pengaturan default
5. Klik **Deploy**
6. Tunggu selesai — catat URL yang diberikan, contoh: `https://og-redirector.vercel.app`

---

## LANGKAH 5 — Tambah Environment Variables di Vercel

1. Di Vercel, buka project kamu → klik tab **Settings**
2. Klik **Environment Variables** di menu kiri
3. Tambahkan satu per satu (klik Add → isi Name & Value → Save):

| Name | Value |
|------|-------|
| `CLOUDINARY_CLOUD_NAME` | cloud name dari Langkah 1 |
| `CLOUDINARY_API_KEY` | API key dari Langkah 1 |
| `CLOUDINARY_API_SECRET` | API secret dari Langkah 1 |
| `UPSTASH_REDIS_REST_URL` | URL dari Langkah 2 |
| `UPSTASH_REDIS_REST_TOKEN` | Token dari Langkah 2 |
| `NEXT_PUBLIC_APP_URL` | URL Vercel kamu, contoh: `https://og-redirector.vercel.app` |

---

## LANGKAH 6 — Redeploy

1. Di Vercel → klik tab **Deployments**
2. Klik titik tiga (**...**) pada deployment terakhir
3. Klik **Redeploy** → konfirmasi
4. Tunggu selesai ✅

---

## Cara Pakai Aplikasi

1. Buka URL Vercel kamu
2. **Upload gambar** (otomatis di-crop ke 1200×630)
3. Isi form:
   - **Judul** — teks yang tampil di preview Facebook
   - **Deskripsi** — teks di bawah judul (opsional)
   - **URL Tujuan** — link yang dibuka saat orang klik preview
   - **Nama Situs** — contoh: `BREAKINGNEWS.COM`
4. Klik **Generate Link**
5. Salin link yang muncul

## Cara Share ke Facebook

1. Buka **https://developers.facebook.com/tools/debug**
2. Paste link → klik **Debug** (wajib, untuk refresh cache Facebook)
3. Buka Facebook → buat postingan baru
4. Paste link → tunggu preview besar muncul
5. Hapus teks link jika mau → klik **Posting** ✅

---

> Link berlaku selama **90 hari** sejak dibuat.
