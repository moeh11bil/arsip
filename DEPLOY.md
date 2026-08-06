# Panduan Deploy & Operasional EduArch dengan PM2

Panduan ini khusus untuk menjalankan dan merawat aplikasi **EduArch** di server menggunakan **PM2** + **Nginx**.

Contoh lokasi aplikasi di server (path bisa beda di tiap server):

```
/www/wwwroot/arsip.alikhlaskarawang.my.id
```

> Semua perintah di bawah dijalankan dari folder aplikasi tersebut, kecuali disebutkan lain.

---

## 1. Cara Jalankan Pertama Kali (Start)

### Langkah 1 — Pastikan hasil build tersedia

PM2 menjalankan file hasil build, bukan source code:

```
.output/server/index.mjs
```

Kalau folder `.output` belum ada atau ingin update kode, build dulu:

```bash
# install dependency (kalau package.json berubah)
npm ci

# build (PASTIKAN env tersedia, lihat bagian 5)
npm run build
```

Hasilnya akan ada di folder `.output/`.

### Langkah 2 — Jalankan lewat file konfigurasi (PENTING)

> ⚠️ **JANGAN pakai `pm2 start eduarch`** — itu akan dicari sebagai *nama script/file* (`Script not found`).
> Nama `eduarch` itu hanya *nama proses*, diatur di dalam `ecosystem.config.cjs`.

Jalankan dengan **file konfigurasi**:

```bash
pm2 start ecosystem.config.cjs
```

Perintah ini membaca `ecosystem.config.cjs` yang berisi: nama proses `eduarch`, script `./.output/server/index.mjs`, mode cluster, port 3000, dan lokasi log.

Cek hasilnya:

```bash
pm2 status
# atau
pm2 list
```

Proses `eduarch` harus muncul dengan status **online**.

### Langkah 3 — Simpan daftar proses (PENTING!)

```bash
pm2 save
```

Ini menyimpan snapshot daftar proses ke file dump PM2 (`~/.pm2/dump.pm2`). Wajib dilakukan setelah start, karena dipakai untuk mengembalikan proses saat server reboot.

### Langkah 4 — Aktifkan auto-start saat reboot (sekali saja)

```bash
pm2 startup systemd
```

Perintah ini membuat service systemd yang menjalankan PM2 otomatis saat server hidup lagi. Ikuti instruksi yang muncul di layar (biasanya tinggal salin perintah `sudo env PATH=...`).

> **Rumus patennya: `pm2 start ...` → `pm2 save` → `pm2 startup systemd`**
> `pm2 save` SENDIRI TANPA `startup` tidak cukup, dan sebaliknya. Keduanya wajib.

---

## 2. Skenario: Server Di-restart / Mati Mendadak

### Kasus A — Semua PM2 tidak jalan setelah reboot

```bash
# cek proses
pm2 status

# kalau daftarnya kosong, kembalikan dari snapshot:
pm2 resurrect

# pastikan jalan lagi
pm2 status
```

`pm2 resurrect` mengembalikan semua proses yang tersimpan lewat `pm2 save` sebelumnya.

**Kalau masih tidak jalan setelah reboot, kemungkinan penyebabnya:**
1. `pm2 save` belum pernah dijalankan → jalan ulang langkah 3 di bagian 1.
2. `pm2 startup systemd` belum dijalankan atau belum di-`sudo` sesuai instruksi.
3. PM2 jalan tapi prosesnya langsung `errored`/`stopped` → cek log, lihat bagian 6.

### Kasus B — Hanya `eduarch` yang tidak jalan, app lain jalan

```bash
pm2 status                       # lihat status eduarch
pm2 logs eduarch --lines 50      # lihat log terakhir, cari errornya
pm2 restart eduarch              # restart manual
```

Kalau `restart` terus gagal (status `errored`, `stopped`, atau `online` tapi website tidak terbuka):
- cek error log: `pm2 logs eduarch --err`
- cek apakah port 3000 kebagian app lain: `ss -tlnp | grep 3000`
- lihat bagian 6 (Troubleshooting)

---

## 3. Update / Deploy Versi Baru

```bash
cd /www/wwwroot/arsip.alikhlaskarawang.my.id

# 1. Ambil kode terbaru
git pull            # atau upload manual dari panel

# 2. Install dependency baru kalau ada
npm ci

# 3. Build ulang
npm run build

# 4. Restart proses PM2
pm2 restart eduarch

# 5. Cek
pm2 status
curl -I http://localhost:3000
```

> Kalau ada perubahan schema database (file `prisma/schema.prisma`):
> ```bash
> npx prisma migrate deploy
> # atau
> npx prisma db push
> ```

Kalau lognya sudah penuh/besar, bisa dibersihkan sebelum restart:

```bash
pm2 flush eduarch
pm2 restart eduarch
```

`flush` menghapus log lama. Jangan flush sebelum yakin sudah tidak perlu melihat error sebelumnya.

---

## 4. Cheat Sheet Perintah PM2

| Perintah | Fungsi |
|---|---|
| `pm2 start ecosystem.config.cjs` | Jalankan app sesuai konfigurasi |
| `pm2 status` / `pm2 list` | Lihat daftar & status semua proses |
| `pm2 logs eduarch` | Lihat log realtime app eduarch |
| `pm2 logs eduarch --lines 100` | Lihat 100 baris log terakhir |
| `pm2 logs eduarch --err` | Lihat hanya error log |
| `pm2 restart eduarch` | Restart app eduarch |
| `pm2 stop eduarch` | Stop app eduarch |
| `pm2 delete eduarch` | Hapus app dari daftar PM2 |
| `pm2 monit` | Monitor CPU/memori secara visual |
| `pm2 save` | Simpan daftar proses (wajib setelah start) |
| `pm2 resurrect` | Pulihkan proses dari snapshot setelah reboot |
| `pm2 startup systemd` | Aktifkan auto-start PM2 saat reboot |
| `pm2 flush eduarch` | Bersihkan log eduarch |
| `pm2 reload ecosystem.config.cjs` | Restart tanpa downtime (kalau ada proses lain di config) |

---

## 5. Environment Variables (Env)

App membaca env berikut (didefinisikan di `nuxt.config.ts` → `runtimeConfig`):

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Koneksi MySQL, contoh `mysql://user:pass@localhost:3306/eduarch` |
| `JWT_SECRET` | Secret untuk token login, wajib diisi |
| `STORAGE_PATH` | Folder penyimpanan file, contoh `/www/wwwroot/arsip.alikhlaskarawang.my.id/storage` |
| `PORT` | Port aplikasi (default 3000) |

Cara menyediakan env ada 3 pilihan, cukup pakai salah satu yang paling cocok:

**Pilihan A — file `.env` di folder aplikasi (paling disarankan).**
Salin `.env.example` → `.env`, isi nilainya. Nitro otomatis membacanya saat runtime dari folder tempat app dijalankan.

**Pilihan B — isi langsung di `ecosystem.config.cjs`** (nilai hardcode, contoh seperti di PRD):

```js
env: {
  NODE_ENV: 'production',
  DATABASE_URL: 'mysql://eduarch:password@localhost:3306/eduarch',
  JWT_SECRET: 'isi_secret_kuat',
  STORAGE_PATH: '/www/wwwroot/arsip.alikhlaskarawang.my.id/storage',
}
```

**Pilihan C — export di shell sebelum start:**

```bash
export DATABASE_URL="mysql://eduarch:password@localhost:3306/eduarch"
export JWT_SECRET="isi_secret_kuat"
pm2 start ecosystem.config.cjs
```

> ⚠️ **Penting:** `DATABASE_URL`, `JWT_SECRET`, dan `STORAGE_PATH` wajib tersedia **saat `npm run build`** DAN **saat runtime**.
> Nilai di `ecosystem.config.cjs` mengambil dari `process.env`, jadi kalau env belum diset di shell, nilainya bisa jadi `undefined` dan app error `DATABASE_URL not found`. Kalau mengalami ini, pakai Pilihan A atau B.

---

## 6. Troubleshooting

### ❌ `[PM2][ERROR] Script not found: .../eduarch`

Perintah salah. `eduarch` bukan file. Jalankan dengan file konfigurasi:

```bash
pm2 start ecosystem.config.cjs
```

### ❌ `[PM2][ERROR] Process or Namespace eduarch not found`

App belum pernah di-start (daftar PM2 kosong setelah reboot). Pulihkan atau start ulang:

```bash
pm2 resurrect      # kalau pernah pm2 save
# atau
pm2 start ecosystem.config.cjs
pm2 save
```

### ❌ App `online` tapi website tidak terbuka

1. Cek port: `ss -tlnp | grep 3000` — pastikan ada proses node yang listen.
2. Cek langsung dari server: `curl -I http://localhost:3000`
3. Kalau dari luar tidak terbuka tapi curl lokal OK → cek Nginx (bagian 7).

### ❌ App `errored` / `stopped` setelah start

```bash
pm2 logs eduarch --err --lines 100
```

Error yang umum:
- **`DATABASE_URL not found` / Prisma error** → env belum diset (bagian 5).
- **`EADDRINUSE` / port 3000 already in use** → app lain memakai port 3000. Cari: `ss -tlnp | grep 3000`, lalu ganti `port` di `ecosystem.config.cjs` dan update Nginx `proxy_pass` ke port baru.
- **`EACCES` saat akses storage** → permission folder storage. Fix:

  ```bash
  chown -R www-data:www-data storage
  chmod -R 755 storage
  ```

- **`Cannot find module ...`** → build belum ada / tidak lengkap. Jalankan `npm run build` lagi.

### ❌ Log error `ENOENT ... /var/log/pm2`

Folder log belum ada. Buat dulu:

```bash
mkdir -p /var/log/pm2
```

### ❌ Database schema tidak cocok

```bash
npx prisma migrate deploy
# atau
npx prisma db push
pm2 restart eduarch
```

---

## 7. Nginx Reverse Proxy (ringkasan)

PM2 melayani di port **3000** (localhost). Nginx bertugas sebagai pintu dari internet. Konfigurasi lengkap ada di `PRD.md` bagian **14.6–14.7**.

Inti konfigurasinya:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Setelah ubah konfigurasi Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. Checklist Cepat Setelah Server Reboot

```
1. pm2 status                 → semua online?
2. curl -I http://localhost:3000   → ada respon?
3. cek website dari browser
```

Kalau ada yang tidak jalan:

```
4. pm2 resurrect
5. pm2 start ecosystem.config.cjs   (kalau eduarch tidak muncul)
6. pm2 save
7. pm2 status / pm2 logs eduarch --err
```

---

## Referensi

- Setup lengkap dari nol (Nginx + SSL + backup): **PRD.md bagian 14**
- Dokumentasi PM2: https://pm2.keymetrics.io/docs/
- Dokumentasi deploy Nuxt: https://nuxt.com/docs/getting-started/deployment
