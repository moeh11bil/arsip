# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem Arsip Digital Sekolah — EduArch

**Versi Dokumen:** 2.0
**Tanggal:** 7 Juli 2026
**Status:** Draft
**Stack Teknologi:** Nuxt.js 3 • TailwindCSS v4 • Prisma • MySQL/MariaDB
**Lisensi Stack:** 100% Open Source / Gratis

---

## 📋 DAFTAR ISI

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Pernyataan Masalah](#2-pernyataan-masalah)
3. [Tujuan & Sasaran](#3-tujuan--sasaran)
4. [Target Pengguna](#4-target-pengguna)
5. [Ruang Lingkup Dokumen](#5-ruang-lingkup-dokumen)
6. [Fitur & Persyaratan](#6-fitur--persyaratan)
7. [User Stories](#7-user-stories)
8. [Persyaratan Non-Fungsional](#8-persyaratan-non-fungsional)
9. [Arsitektur Teknis](#9-arsitektur-teknis)
10. [Setup & Instalasi](#10-setup--instalasi)
11. [Struktur Folder](#11-struktur-folder)
12. [Database Schema (Prisma)](#12-database-schema-prisma)
13. [Contoh Implementasi](#13-contoh-implementasi)
14. [Deployment (Tanpa Docker)](#14-deployment-tanpa-docker)
15. [Roadmap Implementasi](#15-roadmap-implementasi)
16. [Metrik Kesuksesan](#16-metrik-kesuksesan)
17. [Risiko & Mitigasi](#17-risiko--mitigasi)
18. [Glossary](#18-glossary)
19. [Lampiran](#19-lampiran)

---

## 1. RINGKASAN EKSEKUTIF

**EduArch** adalah platform sistem arsip digital berbasis web yang dirancang untuk mendigitalisasi, mengelola, menyimpan, dan mencari dokumen-dokumen sekolah secara efisien, aman, dan terstruktur. Sistem ini dibangun dengan stack modern yang **100% gratis dan open-source**, mudah di-deploy tanpa Docker, serta dioptimalkan untuk kebutuhan sekolah di Indonesia.

### 1.1 Prinsip Utama

| Prinsip | Deskripsi |
|---------|-----------|
| 💰 **Gratis Total** | Seluruh stack menggunakan software open-source / free tier |
| 🐳 **No Docker** | Deployment langsung di VPS dengan PM2 + Nginx |
| 🚀 **Modern Stack** | Nuxt 3 + TailwindCSS v4 + Prisma + MySQL |
| 🏫 **School-First** | Dirancang khusus untuk kebutuhan sekolah Indonesia |
| 🔒 **Aman & Patuh** | Sesuai UU PDP, standar ANRI, dan akreditasi BAN-S/M |

### 1.2 Stack Teknologi (100% Gratis)

| Layer | Teknologi | Lisensi |
|-------|-----------|---------|
| Frontend Framework | **Nuxt.js 3** (Vue 3) | MIT |
| CSS Framework | **TailwindCSS v4** | MIT |
| Backend Runtime | **Node.js 20 LTS** | MIT |
| ORM | **Prisma** | Apache 2.0 |
| Database | **MariaDB 11** | GPL v2 |
| Search Engine | **Meilisearch** | MIT |
| OCR | **Tesseract.js** | Apache 2.0 |
| File Storage | **Local FS** / **MinIO** | AGPL v3 |
| Process Manager | **PM2** | Apache 2.0 |
| Reverse Proxy | **Nginx** | BSD |
| SSL | **Let's Encrypt** | Gratis |
| Icon | **Iconify** | Apache 2.0 |
| Validation | **Zod** | MIT |
| State Management | **Pinia** | MIT |

---

## 2. PERNYATAAN MASALAH

### 2.1 Masalah yang Dihadapi Sekolah

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Dokumen fisik mudah rusak, hilang, atau dimakan rayap | Data historis sekolah terancam hilang |
| 2 | Pencarian dokumen manual memakan waktu lama (jam/hari) | Menurunkan produktivitas staf administrasi |
| 3 | Duplikasi dokumen yang tidak terkendali | Inkonsistensi data dan pemborosan ruang |
| 4 | Tidak ada kontrol akses yang memadai | Risiko kebocoran data sensitif (nilai, data pribadi siswa) |
| 5 | Tidak ada backup terpusat | Risiko kehilangan data saat bencana |
| 6 | Kepatuhan regulasi (UU PDP, standar akreditasi) sulit dibuktikan | Risiko sanksi hukum dan penurunan peringkat akreditasi |

---

## 3. TUJUAN & SASARAN

### 3.1 Tujuan Utama

Membangun sistem arsip digital yang **aman, mudah digunakan, dan sesuai regulasi** untuk mengelola seluruh dokumen sekolah dalam satu platform terpadu dengan biaya operasional seminimal mungkin.

### 3.2 Sasaran Terukur (OKR)

| Objective | Key Result | Target |
|-----------|-----------|--------|
| Meningkatkan efisiensi pencarian dokumen | Waktu rata-rata pencarian dokumen | Dari 30 menit → **< 30 detik** |
| Mengurangi risiko kehilangan dokumen | Persentase dokumen yang terdigitalisasi | **100%** dokumen aktif dalam 12 bulan |
| Menjamin keamanan data | Jumlah insiden kebocoran data | **0 insiden** |
| Mendukung akreditasi sekolah | Kelengkapan dokumen digital saat audit | **100% available** |
| Mengurangi penggunaan kertas | Pengurangan konsumsi kertas administrasi | **70%** dalam tahun pertama |

---

## 4. TARGET PENGGUNA

### 4.1 Persona Pengguna

| Persona | Peran | Kebutuhan Utama |
|---------|-------|-----------------|
| **Kepala Sekolah** | Pengambil keputusan, penanda tangan | Dashboard ringkasan, approval workflow, laporan |
| **Staf Administrasi / TU** | Operator harian sistem | Upload, klasifikasi, pencarian cepat, pengelolaan arsip |
| **Guru** | Pengakses dokumen akademik | Akses nilai, RPP, silabus, sertifikat pelatihan |
| **Siswa/Orang Tua** | Pengakses terbatas | Transkrip, sertifikat, surat keterangan |
| **Auditor/Akreditasi** | Pemeriksa dokumen eksternal | Akses baca (read-only) terkontrol dengan link berbagi |
| **Admin IT** | Pengelola teknis | Manajemen user, konfigurasi sistem, monitoring |

---

## 5. RUANG LINGKUP DOKUMEN

### 5.1 Kategori Arsip yang Dikelola

```
📁 Arsip Sekolah
├── 📂 Dokumen Akademik
│   ├── Rapor & Transkrip Nilai
│   ├── Ijazah & SKL
│   ├── Silabus & RPP/Modul Ajar
│   ├── Jadwal Pelajaran
│   └── Daftar Hadir Siswa
│
├── 📂 Dokumen Kesiswaan
│   ├── Formulir Pendaftaran
│   ├── Akta Kelahiran & KK Siswa
│   ├── Surat Keterangan Pindah
│   └── Data Prestasi & Ekstrakurikuler
│
├── 📂 Dokumen Kepegawaian
│   ├── SK Pengangkatan
│   ├── Sertifikat Pendidik
│   ├── Daftar Gaji & Tunjangan
│   ├── Penilaian Kinerja
│   └── Data Pribadi Guru/Staff
│
├── 📂 Dokumen Administratif
│   ├── Surat Masuk & Surat Keluar
│   ├── Nota Dinas & Memo Internal
│   ├── MoU & Kerja Sama
│   └── Peraturan & Kebijakan Sekolah
│
├── 📂 Dokumen Keuangan
│   ├── RAPBS
│   ├── Laporan BOS
│   ├── Kwitansi & Faktur
│   └── Laporan Audit
│
├── 📂 Dokumen Legalitas
│   ├── Akta Pendirian / Izin Operasional
│   ├── Dokumen Akreditasi
│   └── Sertifikat Tanah/Bangunan
│
└── 📂 Media & Dokumentasi
    ├── Foto Kegiatan
    ├── Video
    └── Dokumentasi Acara
```

---

## 6. FITUR & PERSYARATAN

### 6.1 Fitur Inti (MVP — Minimum Viable Product)

#### F-01: Manajemen Dokumen

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F-01.1 | Upload Dokumen | P0 | Upload file (PDF, JPG, PNG, DOCX, XLSX) drag-and-drop atau browse. Batch upload hingga 50 file sekaligus |
| F-01.2 | OCR (Optical Character Recognition) | P0 | Ekstraksi teks otomatis dari dokumen scan menggunakan **Tesseract.js** (gratis) |
| F-01.3 | Klasifikasi Otomatis | P1 | Auto-tagging kategori berdasarkan konten dokumen |
| F-01.4 | Metadata & Tagging | P0 | Input metadata: tanggal dokumen, kategori, penerbit, nomor surat, kata kunci |
| F-01.5 | Versioning | P1 | Penyimpanan versi dokumen, riwayat perubahan |
| F-01.6 | Preview Inline | P0 | Preview dokumen tanpa perlu download (PDF viewer, image viewer) |

#### F-02: Pencarian & Temu Kembali (Retrieval)

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F-02.1 | Pencarian Full-Text | P0 | Pencarian berdasarkan isi dokumen (setelah OCR) — **MySQL FULLTEXT** untuk skala kecil, **Meilisearch** untuk skala besar |
| F-02.2 | Pencarian Metadata | P0 | Filter berdasarkan kategori, tanggal, penulis, nomor surat |
| F-02.3 | Advanced Search | P1 | Pencarian kombinasi dengan operator AND/OR/NOT |
| F-02.4 | Pencarian Cepat (Quick Search) | P0 | Search bar global dengan auto-suggest |

#### F-03: Manajemen Akses & Keamanan

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F-03.1 | Role-Based Access Control (RBAC) | P0 | Kontrol akses berdasarkan peran: Admin, TU, Guru, Siswa, Auditor |
| F-03.2 | Enkripsi Data | P0 | Enkripsi AES-256 untuk data at-rest, TLS 1.3 untuk data in-transit |
| F-03.3 | Audit Trail / Activity Log | P0 | Pencatatan semua aktivitas: siapa, kapan, apa yang dilakukan pada dokumen |
| F-03.4 | Watermark Digital | P1 | Watermark otomatis saat dokumen di-download/di-print |
| F-03.5 | Two-Factor Authentication (2FA) | P1 | Autentikasi dua faktor untuk login (TOTP gratis) |

#### F-04: Surat Masuk & Keluar

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F-04.1 | Registrasi Surat Masuk | P0 | Input nomor surat, tanggal, pengirim, perihal, scan surat |
| F-04.2 | Registrasi Surat Keluar | P0 | Input nomor surat, tujuan, perihal, template surat |
| F-04.3 | Disposisi Digital | P1 | Forward surat ke pejabat terkait dengan instruksi disposisi |
| F-04.4 | Notifikasi Surat Baru | P1 | Push notification / email saat ada surat baru atau disposisi |

#### F-05: Retensi & Pemusnahan Arsip

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F-05.1 | Jadwal Retensi Otomatis | P1 | Pengaturan masa retensi per kategori dokumen (misal: rapor = 10 tahun) |
| F-05.2 | Notifikasi Expired | P1 | Alert saat dokumen mendekati akhir masa retensi |
| F-05.3 | Pemusnahan Terkontrol | P2 | Proses pemusnahan dengan approval workflow dan berita acara digital |

### 6.2 Fitur Lanjutan (Post-MVP)

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F-06.1 | Tanda Tangan Elektronik | P2 | Integrasi e-signature menggunakan **OpenXchange** atau **documenso** (open source) |
| F-06.2 | Template Dokumen | P2 | Template surat, SK, sertifikat yang bisa dikustomisasi |
| F-06.3 | Integrasi Dapodik | P2 | Sinkronisasi data dengan sistem Dapodik Kemendikbud |
| F-06.4 | Dashboard Analitik | P1 | Statistik jumlah arsip, tren upload, dokumen paling diakses |
| F-06.5 | Mobile App (PWA) | P2 | Progressive Web App untuk akses di lapangan (gratis, tanpa app store) |
| F-06.6 | Kolaborasi | P2 | Komentar, anotasi pada dokumen |
| F-06.7 | AI Auto-Classification | P2 | Klasifikasi dokumen otomatis menggunakan **Ollama** (LLM lokal, gratis) |
| F-06.8 | Integrasi Email | P2 | Arsip email otomatis dari akun email resmi sekolah |

---

## 7. USER STORIES

### 7.1 Contoh User Stories

> **US-01:** Sebagai **Staf TU**, saya ingin **mengunggah surat masuk dan memberikan metadata** agar **surat bisa ditemukan dengan cepat di kemudian hari**.
>
> *Acceptance Criteria:*
> - Bisa upload file PDF/JPG maksimal 50MB per file
> - Form metadata wajib: nomor surat, tanggal, pengirim, perihal
> - Setelah upload, dokumen langsung muncul di pencarian

> **US-02:** Sebagai **Guru**, saya ingin **mencari RPP tahun lalu berdasarkan kelas dan mata pelajaran** agar **bisa menggunakannya sebagai referensi**.
>
> *Acceptance Criteria:*
> - Bisa filter berdasarkan kategori "RPP", tahun ajaran, kelas, mapel
> - Hasil pencarian muncul dalam < 2 detik
> - Bisa preview dokumen sebelum download

> **US-03:** Sebagai **Kepala Sekolah**, saya ingin **mendisposisikan surat masuk secara digital** agar **prosesnya lebih cepat dan terlacak**.
>
> *Acceptance Criteria:*
> - Bisa forward surat ke satu/beberapa penerima
> - Bisa menambahkan instruksi disposisi
> - Penerima mendapat notifikasi
> - Status disposisi terlacak (belum dibaca, sedang diproses, selesai)

> **US-04:** Sebagai **Admin IT**, saya ingin **melihat log aktivitas seluruh pengguna** agar **bisa mendeteksi akses yang tidak sah**.
>
> *Acceptance Criteria:*
> - Log mencatat: user, waktu, aksi (view/download/upload/delete), dokumen yang diakses
> - Bisa filter log berdasarkan user, rentang waktu, jenis aksi
> - Log tidak bisa dihapus oleh siapapun

> **US-05:** Sebagai **Auditor Akreditasi**, saya ingin **mengakses dokumen tertentu melalui link terbatas** agar **bisa memverifikasi kelengkapan dokumen tanpa akun permanen**.
>
> *Acceptance Criteria:*
> - Admin bisa generate link berbagi dengan expiry date
> - Link hanya bisa view, tidak bisa download (opsional)
> - Akses melalui link tercatat di audit trail

---

## 8. PERSYARATAN NON-FUNGSIONAL

### 8.1 Kinerja (Performance)

| Parameter | Target |
|-----------|--------|
| Waktu loading halaman | < 3 detik |
| Waktu pencarian dokumen | < 2 detik (untuk 100.000+ dokumen) |
| Waktu upload per dokumen | < 10 detik untuk file 10MB |
| Concurrent users | Minimal 200 pengguna bersamaan |

### 8.2 Ketersediaan (Availability)

| Parameter | Target |
|-----------|--------|
| Uptime SLA | 99.9% |
| RPO (Recovery Point Objective) | < 1 jam |
| RTO (Recovery Time Objective) | < 4 jam |
| Backup otomatis | Harian (incremental), Mingguan (full) |

### 8.3 Keamanan (Security)

- Enkripsi data: AES-256 (at-rest), TLS 1.3 (in-transit)
- Autentikasi: Password + opsional 2FA (TOTP)
- Session timeout: 30 menit tidak aktif
- Password policy: minimal 12 karakter, kompleksitas tinggi
- Protection: Anti-SQL injection, XSS, CSRF
- Penetration testing: minimal 2x per tahun (gunakan **OWASP ZAP** — gratis)

### 8.4 Skalabilitas

- Arsitektur monolith modular (mudah di-scale vertikal)
- Mendukung pertumbuhan hingga 5TB data dalam 5 tahun
- CDN opsional via **Cloudflare Free Tier**

### 8.5 Kepatuhan Regulasi

- **UU No. 27 Tahun 2022** tentang Pelindungan Data Pribadi (UU PDP)
- **PP No. 71 Tahun 2019** tentang Penyelenggaraan Sistem dan Transaksi Elektronik
- **Peraturan ANRI** tentang Pengelolaan Arsip Digital
- **Standar ISO 27001** (Information Security Management)
- **Standar Akreditasi BAN-S/M** untuk kelengkapan dokumen

---

## 9. ARSITEKTUR TEKNIS

### 9.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐             │
│  │ Web App  │  │ PWA      │  │ Admin     │             │
│  │ (Nuxt 3) │  │ (Mobile) │  │ Dashboard │             │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘             │
│       └──────────────┼───────────────┘                  │
└──────────────────────┼──────────────────────────────────┘
                       │ HTTPS / TLS 1.3
┌──────────────────────┼──────────────────────────────────┐
│               NGINX REVERSE PROXY                        │
│         SSL Termination, Rate Limiting, Gzip             │
└──────────────────────┼──────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────┐
│            NUXT SERVER (Node.js + PM2)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Server API   │  │ Server Utils │  │ Middleware   │  │
│  │ /api/*       │  │ (helpers)    │  │ (auth, RBAC) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         └──────────────────┼─────────────────┘          │
│  ┌─────────────────────────▼─────────────────────────┐  │
│  │              SERVICES LAYER                        │  │
│  │  • DocumentService  • AuthService  • SuratService │  │
│  │  • SearchService    • StorageService • OCRService │  │
│  └─────────────────────────┬─────────────────────────┘  │
│  ┌─────────────────────────▼─────────────────────────┐  │
│  │              PRISMA ORM                            │  │
│  └─────────────────────────┬─────────────────────────┘  │
└────────────────────────────┼────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────┐
│                      DATA LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  MariaDB 11  │  │ Local FS /   │  │ Meilisearch  │  │
│  │  (Metadata)  │  │ MinIO        │  │ (Search)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────────────────────┐    │
│  │ Tesseract.js │  │ Ollama (opsional, AI local)  │    │
│  │ (OCR)        │  │                              │    │
│  └──────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Stack Teknologi Lengkap (Gratis)

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| Frontend Framework | **Nuxt.js 3** | Fullstack Vue.js framework dengan SSR/SSG |
| CSS Framework | **TailwindCSS v4** | Utility-first CSS framework |
| Backend Runtime | **Node.js 20 LTS** | Runtime JavaScript |
| ORM | **Prisma** | Type-safe database toolkit |
| Database | **MariaDB 11** | Relational database (fork MySQL) |
| Search Engine | **Meilisearch** | Full-text search engine (alternatif Elasticsearch) |
| OCR | **Tesseract.js** | Optical Character Recognition |
| File Storage | **Local FS** / **MinIO** | Penyimpanan file |
| Process Manager | **PM2** | Process manager & monitor |
| Reverse Proxy | **Nginx** | Web server & reverse proxy |
| SSL | **Certbot (Let's Encrypt)** | SSL/TLS certificate gratis |
| Validation | **Zod** | TypeScript-first schema validation |
| State Management | **Pinia** | Vue.js store |
| HTTP Client | **ofetch / $fetch** | Built-in Nuxt fetch |
| Icon | **Nuxt Icon (Iconify)** | 200.000+ icon gratis |
| Date Handling | **date-fns** | Lightweight date library |
| AI (opsional) | **Ollama** | Local LLM untuk klasifikasi otomatis |

---

## 10. SETUP & INSTALASI

### 10.1 Prasyarat Sistem

```bash
# OS: Ubuntu 22.04 / 24.04 LTS atau Debian 12
# RAM minimal: 4GB (rekomendasi 8GB)
# Storage: 50GB+ SSD

# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependency dasar
sudo apt install -y curl git build-essential python3
```

### 10.2 Install Node.js 20 LTS (via NodeSource)

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi
node -v   # v20.x.x
npm -v    # 10.x.x

# Install PM2 global
sudo npm install -g pm2
```

### 10.3 Install MariaDB 11

```bash
# Install MariaDB
sudo apt install -y mariadb-server mariadb-client

# Start & enable
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure installation
sudo mysql_secure_installation

# Buat database & user
sudo mysql -u root -p
```

```sql
-- Di dalam MySQL prompt
CREATE DATABASE eduarch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'eduarch'@'localhost' IDENTIFIED BY 'password_kuat_disini';
GRANT ALL PRIVILEGES ON eduarch.* TO 'eduarch'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 10.4 Install Meilisearch (Opsional, untuk Search Skala Besar)

```bash
# Install Meilisearch (curl one-liner)
curl -L https://install.meilisearch.com | sh

# Jalankan
./meilisearch --master-key='master_key_rahasia'

# Atau install sebagai systemd service
sudo nano /etc/systemd/system/meilisearch.service
```

```ini
# /etc/systemd/system/meilisearch.service
[Unit]
Description=Meilisearch
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/meilisearch
ExecStart=/opt/meilisearch/meilisearch --master-key=master_key_rahasia
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable meilisearch
sudo systemctl start meilisearch
```

### 10.5 Install Tesseract OCR (System-level, untuk performa lebih baik)

```bash
sudo apt install -y tesseract-ocr tesseract-ocr-ind tesseract-ocr-eng
```

### 10.6 Buat Project Nuxt 3 Terbaru

```bash
# Inisialisasi project Nuxt 3 dengan nuxi
npx nuxi@latest init eduarch

# Masuk ke folder project
cd eduarch

# Install dependencies
npm install
```

### 10.7 Install & Konfigurasi TailwindCSS v4 (Terbaru)

TailwindCSS v4 memperkenalkan **CSS-first configuration** — tidak lagi memerlukan `tailwind.config.js` secara wajib. Konfigurasi dilakukan langsung di file CSS menggunakan `@theme`.

```bash
# Install module Nuxt untuk TailwindCSS v4
npm install @nuxtjs/tailwindcss@latest

# Install plugin tambahan (opsional)
npm install @tailwindcss/forms @tailwindcss/typography
```

#### File: `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],

  tailwindcss: {
    // Konfigurasi module TailwindCSS v4
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts', // opsional, bisa dihapus jika pakai CSS-first
    exposeConfig: false,
    viewer: true, // Enable /_tailwind viewer di development
  },

  runtimeConfig: {
    // Private (server-only)
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    storagePath: process.env.STORAGE_PATH || './storage',
    meilisearchUrl: process.env.MEILISEARCH_URL,
    meilisearchKey: process.env.MEILISEARCH_KEY,

    // Public (client-side)
    public: {
      appName: 'EduArch',
      appVersion: '1.0.0',
      maxUploadSize: 50 * 1024 * 1024, // 50MB
    },
  },

  app: {
    head: {
      title: 'EduArch - Sistem Arsip Digital Sekolah',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistem Arsip Digital untuk Sekolah' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },
})
```

#### File: `assets/css/main.css` (TailwindCSS v4 — CSS-First Config)

```css
/* assets/css/main.css */
@import "tailwindcss";

/* === TailwindCSS v4: CSS-First Configuration === */
/* Tidak perlu tailwind.config.js lagi! */

@theme {
  /* Custom Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;

  --color-school-blue: #1e40af;
  --color-school-green: #059669;
  --color-school-gold: #d97706;

  /* Custom Font */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Custom Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Custom Animation */
  --animate-fade-in: fade-in 0.3s ease-in-out;

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}

/* === Plugin Tambahan === */
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

/* === Global Styles === */
body {
  font-family: var(--font-sans);
  background-color: var(--color-gray-50);
}
```

> 💡 **Catatan TailwindCSS v4:**
> - Konfigurasi tema dipindah dari `tailwind.config.js` ke CSS menggunakan `@theme`
> - Plugin di-load dengan `@plugin` bukan `plugins: []`
> - File `tailwind.config.ts` masih bisa digunakan jika preferensi, tapi tidak wajib
> - Performa build 10x lebih cepat berkat engine Oxide baru

### 10.8 Install Prisma & Dependencies Lainnya

```bash
# Install Prisma
npm install prisma --save-dev
npm install @prisma/client

# Install dependencies tambahan
npm install zod date-fns bcryptjs jsonwebtoken tesseract.js
npm install @aws-sdk/client-s3  # Jika pakai S3/MinIO

# Install dev dependencies
npm install -D @types/bcryptjs @types/jsonwebtoken @types/node
```

### 10.9 Inisialisasi Prisma

```bash
# Generate Prisma schema
npx prisma init --datasource-provider mysql
```

#### File: `.env`

```bash
# Database
DATABASE_URL="mysql://eduarch:password_kuat_disini@localhost:3306/eduarch"

# JWT
JWT_SECRET="ganti_dengan_random_string_yang_panjang_dan_aman"

# Storage
STORAGE_PATH="./storage"

# Meilisearch (opsional)
MEILISEARCH_URL="http://localhost:7700"
MEILISEARCH_KEY="master_key_rahasia"

# App
NODE_ENV="development"
PORT=3000
```

### 10.10 Jalankan Development Server

```bash
# Jalankan development server
npm run dev

# Akses di browser
# http://localhost:3000
```

---

## 11. STRUKTUR FOLDER

```
eduarch/
├── .nuxt/                      # Auto-generated (jangan di-edit)
├── .output/                    # Build output
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # SQL migrations
│   └── seed.ts                 # Data seeder
│
├── server/
│   ├── api/                    # Server API routes
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   ├── documents/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   └── [id]/
│   │   │       ├── download.get.ts
│   │   │       └── preview.get.ts
│   │   ├── surat/
│   │   │   ├── masuk/
│   │   │   └── keluar/
│   │   ├── search/
│   │   │   └── index.get.ts
│   │   └── admin/
│   │       ├── users/
│   │       └── audit-logs/
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── rbac.ts
│   │
│   ├── plugins/
│   │   └── prisma.ts
│   │
│   ├── utils/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   ├── ocr.ts
│   │   └── validators.ts
│   │
│   └── services/
│       ├── document.service.ts
│       ├── surat.service.ts
│       ├── search.service.ts
│       └── audit.service.ts
│
├── app/
│   ├── app.vue
│   ├── assets/
│   │   └── css/
│   │       └── main.css        # TailwindCSS v4 config
│   │
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── documents/
│   │   ├── surat/
│   │   └── layout/
│   │
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useDocuments.ts
│   │   ├── useSearch.ts
│   │   └── usePermission.ts
│   │
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── auth.vue
│   │   └── admin.vue
│   │
│   ├── pages/
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── documents/
│   │   ├── surat/
│   │   ├── users/
│   │   └── audit-logs.vue
│   │
│   ├── plugins/
│   │   └── toast.ts
│   │
│   └── middleware/
│       ├── auth.ts
│       └── role.ts
│
├── public/
│   ├── favicon.ico
│   └── uploads/
│
├── storage/                    # File storage (git-ignored)
├── nuxt.config.ts
├── tailwind.config.ts          # Opsional (TailwindCSS v4)
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── ecosystem.config.js         # PM2 config
└── README.md
```

---

## 12. DATABASE SCHEMA (PRISMA)

### File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTHENTICATION
// ============================================

enum UserRole {
  SUPER_ADMIN
  ADMIN
  KEPALA_SEKOLAH
  TU
  GURU
  SISWA
  AUDITOR
}

model User {
  id            String    @id @default(cuid())
  nip           String?   @unique
  nis           String?   @unique
  email         String    @unique
  passwordHash  String
  namaLengkap   String
  role          UserRole
  avatar        String?
  isActive      Boolean   @default(true)
  emailVerified Boolean   @default(false)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  documents     Document[]      @relation("DocumentCreator")
  documentsUpdated Document[]   @relation("DocumentUpdater")
  uploads       DocumentUpload[]
  auditLogs     AuditLog[]
  disposisiFrom Disposisi[]     @relation("DisposisiFrom")
  disposisiTo   Disposisi[]     @relation("DisposisiTo")
  sessions      Session[]
  suratCreated  Surat[]         @relation("SuratCreator")
  versionsCreated DocumentVersion[] @relation("VersionCreator")

  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

// ============================================
// DOKUMEN (CORE)
// ============================================

enum DocumentCategory {
  AKADEMIK
  KESISWAAN
  KEPEGAWAIAN
  ADMINISTRATIF
  KEUANGAN
  LEGALITAS
  MEDIA
  LAINNYA
}

enum DocumentStatus {
  DRAFT
  ACTIVE
  ARCHIVED
  EXPIRED
  DESTROYED
}

enum AccessLevel {
  PUBLIC
  INTERNAL
  RESTRICTED
  CONFIDENTIAL
  SECRET
}

model Document {
  id              String          @id @default(cuid())
  kodeDokumen     String          @unique
  judul           String
  deskripsi       String?         @db.Text
  kategori        DocumentCategory
  subKategori     String?
  status          DocumentStatus  @default(ACTIVE)
  accessLevel     AccessLevel     @default(INTERNAL)

  nomorSurat      String?
  tanggalSurat    DateTime?
  pengirim        String?
  perihal         String?

  tanggalDokumen  DateTime
  masaRetensiThn  Int             @default(5)
  expiredAt       DateTime?

  fileSize        Int
  mimeType        String
  pageCount       Int?
  checksum        String?

  ocrText         String?         @db.Text
  isOcrProcessed  Boolean         @default(false)

  viewCount       Int             @default(0)
  downloadCount   Int             @default(0)

  createdById     String
  updatedById     String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  deletedAt       DateTime?

  createdBy       User            @relation("DocumentCreator", fields: [createdById], references: [id])
  updatedBy       User?           @relation("DocumentUpdater", fields: [updatedById], references: [id])
  uploads         DocumentUpload[]
  tags            DocumentTag[]
  versions        DocumentVersion[]
  accesses        DocumentAccess[]
  disposisi       Disposisi[]
  surat           Surat?

  @@index([kategori])
  @@index([status])
  @@index([accessLevel])
  @@index([tanggalDokumen])
  @@index([kodeDokumen])
  @@index([createdById])
  @@index([deletedAt])
  @@map("documents")
}

model DocumentUpload {
  id          String   @id @default(cuid())
  documentId  String
  fileName    String
  filePath    String
  fileSize    Int
  mimeType    String
  version     Int      @default(1)
  uploadedById String
  createdAt   DateTime @default(now())

  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  uploadedBy User     @relation(fields: [uploadedById], references: [id])

  @@index([documentId])
  @@map("document_uploads")
}

model DocumentVersion {
  id          String   @id @default(cuid())
  documentId  String
  version     Int
  fileName    String
  filePath    String
  fileSize    Int
  changeNote  String?  @db.Text
  createdById String
  createdAt   DateTime @default(now())

  document  Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  createdBy User     @relation("VersionCreator", fields: [createdById], references: [id])

  @@unique([documentId, version])
  @@index([documentId])
  @@map("document_versions")
}

model DocumentTag {
  id         String @id @default(cuid())
  documentId String
  tag        String

  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@unique([documentId, tag])
  @@index([tag])
  @@map("document_tags")
}

model DocumentAccess {
  id          String   @id @default(cuid())
  documentId  String
  userId      String?
  action      String
  ipAddress   String?
  userAgent   String?
  accessedAt  DateTime @default(now())

  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@index([documentId])
  @@index([userId])
  @@index([accessedAt])
  @@map("document_accesses")
}

// ============================================
// SURAT MASUK & KELUAR
// ============================================

enum SuratType {
  MASUK
  KELUAR
}

enum SuratPriority {
  BIASA
  SEGERA
  SANGAT_SEGERA
}

enum DisposisiStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  REJECTED
}

model Surat {
  id              String        @id @default(cuid())
  documentId      String        @unique
  type            SuratType
  nomorAgenda     String        @unique
  nomorSurat      String
  tanggalSurat    DateTime
  tanggalTerima   DateTime?
  pengirim        String?
  tujuan          String?
  perihal         String
  priority        SuratPriority @default(BIASA)
  sifat           String?
  catatan         String?       @db.Text
  createdById     String
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  document    Document      @relation(fields: [documentId], references: [id], onDelete: Cascade)
  createdBy   User          @relation("SuratCreator", fields: [createdById], references: [id])
  disposisi   Disposisi[]

  @@index([type])
  @@index([tanggalSurat])
  @@map("surat")
}

model Disposisi {
  id            String           @id @default(cuid())
  suratId       String
  fromUserId    String
  toUserId      String
  instruksi     String           @db.Text
  status        DisposisiStatus  @default(PENDING)
  catatanRespon String?          @db.Text
  respondedAt   DateTime?
  createdAt     DateTime         @default(now())

  surat    Surat @relation(fields: [suratId], references: [id], onDelete: Cascade)
  fromUser User  @relation("DisposisiFrom", fields: [fromUserId], references: [id])
  toUser   User  @relation("DisposisiTo", fields: [toUserId], references: [id])

  @@index([suratId])
  @@index([toUserId, status])
  @@map("disposisi")
}

// ============================================
// AUDIT LOG
// ============================================

enum AuditAction {
  CREATE
  READ
  UPDATE
  DELETE
  DOWNLOAD
  PRINT
  SHARE
  LOGIN
  LOGOUT
  DISPOSITION
}

model AuditLog {
  id         String      @id @default(cuid())
  userId     String?
  action     AuditAction
  entity     String
  entityId   String?
  metadata   Json?
  oldValue   Json?
  newValue   Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime    @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([entity, entityId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}

// ============================================
// MASTER DATA
// ============================================

model UnitKerja {
  id        String   @id @default(cuid())
  nama      String   @unique
  kode      String   @unique
  parentId  String?
  createdAt DateTime @default(now())

  parent   UnitKerja?  @relation("UnitHierarchy", fields: [parentId], references: [id])
  children UnitKerja[] @relation("UnitHierarchy")

  @@map("unit_kerja")
}

model KlasifikasiArsip {
  id          String           @id @default(cuid())
  kode        String           @unique
  nama        String
  deskripsi   String?          @db.Text
  kategori    DocumentCategory
  retensiThn  Int
  isActive    Boolean          @default(true)
  parentId    String?
  createdAt   DateTime         @default(now())

  parent   KlasifikasiArsip?  @relation("KlasifikasiHierarchy", fields: [parentId], references: [id])
  children KlasifikasiArsip[] @relation("KlasifikasiHierarchy")

  @@index([kategori])
  @@map("klasifikasi_arsip")
}
```

### 12.1 Menjalankan Migrasi

```bash
# Generate migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Opsional) Seed database
npx prisma db seed
```

---

## 13. CONTOH IMPLEMENTASI

### 13.1 Server Plugin: Prisma Client Singleton

```typescript
// server/plugins/prisma.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

export default defineNitroPlugin(() => {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
})

export const getPrisma = (): PrismaClient => {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  return globalThis.__prisma
}
```

### 13.2 Server Middleware: Authentication

```typescript
// server/middleware/auth.ts
import { verifyToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const protectedPaths = ['/api/documents', '/api/surat', '/api/admin', '/api/users']
  const path = getRequestURL(event).pathname

  if (!protectedPaths.some(p => path.startsWith(p))) return
  if (path === '/api/auth/login' || path === '/api/auth/register') return

  const token = getCookie(event, 'auth_token')
    || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = await verifyToken(token)
    event.context.user = payload
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
```

### 13.3 API Endpoint: List Dokumen dengan Full-Text Search

```typescript
// server/api/documents/index.get.ts
import { z } from 'zod'
import { getPrisma } from '~/server/utils/prisma'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  kategori: z.enum([
    'AKADEMIK', 'KESISWAAN', 'KEPEGAWAIAN',
    'ADMINISTRATIF', 'KEUANGAN', 'LEGALITAS', 'MEDIA', 'LAINNYA'
  ]).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'EXPIRED', 'DESTROYED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'tanggalDokumen', 'judul']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const query = await getValidatedQuery(event, querySchema.parse)
  const prisma = getPrisma()

  const where: any = { deletedAt: null }

  // Filter by access level based on user role
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    where.accessLevel = {
      in: user.role === 'KEPALA_SEKOLAH'
        ? ['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET']
        : ['PUBLIC', 'INTERNAL']
    }
  }

  if (query.kategori) where.kategori = query.kategori
  if (query.status) where.status = query.status

  if (query.startDate || query.endDate) {
    where.tanggalDokumen = {}
    if (query.startDate) where.tanggalDokumen.gte = new Date(query.startDate)
    if (query.endDate) where.tanggalDokumen.lte = new Date(query.endDate)
  }

  let documents, total

  if (query.search) {
    // Full-text search dengan MySQL MATCH
    const offset = (query.page - 1) * query.limit
    documents = await prisma.$queryRaw`
      SELECT d.*,
        MATCH(d.judul, d.deskripsi, d.ocr_text, d.perihal)
        AGAINST(${query.search} IN NATURAL LANGUAGE MODE) AS relevance
      FROM documents d
      WHERE MATCH(d.judul, d.deskripsi, d.ocr_text, d.perihal)
        AGAINST(${query.search} IN NATURAL LANGUAGE MODE)
        AND d.deleted_at IS NULL
      ORDER BY relevance DESC
      LIMIT ${query.limit} OFFSET ${offset}
    `

    const countResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total
      FROM documents d
      WHERE MATCH(d.judul, d.deskripsi, d.ocr_text, d.perihal)
        AGAINST(${query.search} IN NATURAL LANGUAGE MODE)
        AND d.deleted_at IS NULL
    `
    total = Number(countResult[0].total)
  } else {
    [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          createdBy: { select: { id: true, namaLengkap: true, role: true } },
          tags: true,
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.document.count({ where }),
    ])
  }

  return {
    data: documents,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  }
})
```

### 13.4 Frontend: Composable untuk Dokumen

```typescript
// app/composables/useDocuments.ts
export const useDocuments = () => {
  const list = async (filters: any = {}) => {
    const query = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value))
      }
    })
    return await $fetch(`/api/documents?${query.toString()}`)
  }

  const getById = async (id: string) => {
    return await $fetch(`/api/documents/${id}`)
  }

  const upload = async (formData: FormData) => {
    return await $fetch('/api/documents', {
      method: 'POST',
      body: formData,
    })
  }

  const update = async (id: string, data: any) => {
    return await $fetch(`/api/documents/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  const remove = async (id: string) => {
    return await $fetch(`/api/documents/${id}`, { method: 'DELETE' })
  }

  return { list, getById, upload, update, remove }
}
```

### 13.5 Frontend: Halaman List Dokumen (TailwindCSS v4)

```vue
<!-- app/pages/documents/index.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDocuments } from '~/composables/useDocuments'

definePageMeta({ middleware: 'auth' })

const { list } = useDocuments()

const search = ref('')
const kategori = ref('')
const page = ref(1)
const limit = ref(20)

const { data, pending, refresh } = await useAsyncData(
  'documents',
  () => list({
    page: page.value,
    limit: limit.value,
    search: search.value,
    kategori: kategori.value || undefined,
  }),
  { watch: [page, kategori] }
)

let searchTimeout: NodeJS.Timeout
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    refresh()
  }, 300)
})

const kategoriOptions = [
  { value: '', label: 'Semua Kategori' },
  { value: 'AKADEMIK', label: 'Akademik' },
  { value: 'KESISWAAN', label: 'Kesiswaan' },
  { value: 'KEPEGAWAIAN', label: 'Kepegawaian' },
  { value: 'ADMINISTRATIF', label: 'Administratif' },
  { value: 'KEUANGAN', label: 'Keuangan' },
  { value: 'LEGALITAS', label: 'Legalitas' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Arsip Dokumen</h1>
          <p class="mt-1 text-gray-600">Kelola dan cari dokumen sekolah dengan mudah</p>
        </div>
        <NuxtLink
          to="/documents/upload"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Upload Dokumen
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="search"
              type="text"
              placeholder="Cari dokumen..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            v-model="kategori"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option v-for="opt in kategoriOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>

          <div class="flex items-center text-sm text-gray-600">
            <span v-if="data?.pagination">
              Total: <strong>{{ data.pagination.total }}</strong> dokumen
            </span>
          </div>
        </div>
      </div>

      <!-- Document Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="pending" class="p-8 text-center">
          <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
          <p class="mt-2 text-gray-600">Memuat dokumen...</p>
        </div>

        <table v-else-if="data?.data?.length" class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="doc in data.data" :key="doc.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 text-sm font-mono text-gray-900">{{ doc.kodeDokumen }}</td>
              <td class="px-6 py-4">
                <NuxtLink :to="`/documents/${doc.id}`" class="text-sm font-medium text-primary-600 hover:text-primary-800">
                  {{ doc.judul }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded">
                  {{ doc.kategori }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ new Date(doc.tanggalDokumen).toLocaleDateString('id-ID') }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button class="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                    <Icon name="heroicons:eye" class="w-5 h-5" />
                  </button>
                  <button class="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
                    <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="p-12 text-center">
          <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto text-gray-300" />
          <p class="mt-4 text-gray-600">Belum ada dokumen</p>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## 14. DEPLOYMENT (TANPA DOCKER)

### 14.1 Build Aplikasi

```bash
# Build untuk production
npm run build

# Output akan ada di folder .output/
```

### 14.2 Konfigurasi PM2

#### File: `ecosystem.config.js`

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'eduarch',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'mysql://eduarch:password@localhost:3306/eduarch',
        JWT_SECRET: 'ganti_dengan_secret_yang_aman',
        STORAGE_PATH: '/var/www/eduarch/storage',
      },
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/eduarch-error.log',
      out_file: '/var/log/pm2/eduarch-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
```

### 14.3 Setup Folder & Permission

```bash
# Buat folder aplikasi
sudo mkdir -p /var/www/eduarch
sudo chown -R $USER:$USER /var/www/eduarch

# Copy hasil build
cp -r .output /var/www/eduarch/
cp -r prisma /var/www/eduarch/
cp ecosystem.config.js /var/www/eduarch/

# Buat folder storage
mkdir -p /var/www/eduarch/storage/documents
mkdir -p /var/log/pm2

# Setup permission
sudo chown -R www-data:www-data /var/www/eduarch/storage
sudo chmod -R 755 /var/www/eduarch/storage

# Install PM2 startup script
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u www-data --hp /var/www
```

### 14.4 Jalankan Aplikasi dengan PM2

```bash
# Masuk ke folder aplikasi
cd /var/www/eduarch

# Jalankan aplikasi
pm2 start ecosystem.config.js

# Simpan konfigurasi PM2
pm2 save

# Monitor
pm2 monit

# Perintah berguna lainnya
pm2 status              # Lihat status
pm2 logs eduarch        # Lihat log
pm2 restart eduarch     # Restart aplikasi
pm2 stop eduarch        # Stop aplikasi
```

### 14.5 Setup Systemd Service (Alternatif PM2)

Jika tidak ingin menggunakan PM2, bisa pakai systemd langsung:

```bash
sudo nano /etc/systemd/system/eduarch.service
```

```ini
# /etc/systemd/system/eduarch.service
[Unit]
Description=EduArch - Sistem Arsip Digital Sekolah
After=network.target mariadb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/eduarch
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=10
StandardOutput=append:/var/log/eduarch/out.log
StandardError=append:/var/log/eduarch/error.log

Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=mysql://eduarch:password@localhost:3306/eduarch
Environment=JWT_SECRET=ganti_dengan_secret_yang_aman
Environment=STORAGE_PATH=/var/www/eduarch/storage

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable eduarch
sudo systemctl start eduarch
sudo systemctl status eduarch
```

### 14.6 Setup Nginx Reverse Proxy

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/eduarch.conf
```

```nginx
# /etc/nginx/sites-available/eduarch.conf
server {
    listen 80;
    server_name arsip.sekolah.sch.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name arsip.sekolah.sch.id;

    # SSL (akan di-generate oleh Certbot)
    ssl_certificate /etc/letsencrypt/live/arsip.sekolah.sch.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arsip.sekolah.sch.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Upload size limit
    client_max_body_size 50M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Proxy ke Nuxt
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Static assets cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/eduarch.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 14.7 Setup SSL dengan Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d arsip.sekolah.sch.id

# Auto-renewal (sudah otomatis, tapi bisa dicek)
sudo certbot renew --dry-run
```

### 14.8 Backup Database Otomatis

```bash
# Buat script backup
sudo nano /usr/local/bin/backup-eduarch.sh
```

```bash
#!/bin/bash
# /usr/local/bin/backup-eduarch.sh

BACKUP_DIR="/var/backups/eduarch"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="eduarch"
DB_USER="eduarch"
DB_PASS="password_kuat_disini"

# Buat folder backup
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup file storage
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz -C /var/www/eduarch storage

# Hapus backup lama (> 30 hari)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Beri permission
sudo chmod +x /usr/local/bin/backup-eduarch.sh

# Tambahkan ke crontab (backup setiap hari jam 2 pagi)
sudo crontab -e
```

```cron
# Backup database & storage setiap hari jam 2 pagi
0 2 * * * /usr/local/bin/backup-eduarch.sh >> /var/log/eduarch-backup.log 2>&1
```

### 14.9 Monitoring dengan Uptime Kuma (Gratis)

```bash
# Install Uptime Kuma (self-hosted monitoring)
npm install pm2 -g
git clone https://github.com/louislam/uptime-kuma.git
cd uptime-kuma
npm run setup
pm2 start server/server.js --name uptime-kuma
```

Akses di `http://your-server:3001` untuk monitoring uptime, response time, dll.

---

## 15. ROADMAP IMPLEMENTASI

### Fase 1: Fondasi (Minggu 1–2)

| Minggu | Milestone |
|--------|-----------|
| 1 | Setup project Nuxt 3 + TailwindCSS v4 + Prisma + MariaDB |
| 2 | Implementasi auth (login, register, JWT), middleware auth & RBAC, layout dasar |

### Fase 2: Core Features (Minggu 3–5)

| Minggu | Milestone |
|--------|-----------|
| 3 | Upload dokumen (multipart, drag-drop), list dokumen dengan filter & pagination |
| 4 | Detail dokumen + preview PDF, edit metadata & versioning, full-text search (MySQL FULLTEXT) |
| 5 | OCR processing (Tesseract.js), audit log, testing dasar |

### Fase 3: Surat & Disposisi (Minggu 6–7)

| Minggu | Milestone |
|--------|-----------|
| 6 | Modul surat masuk, modul surat keluar, disposisi digital |
| 7 | Notifikasi (in-app + email via Nodemailer), dashboard statistik |

### Fase 4: Advanced (Minggu 8–10)

| Minggu | Milestone |
|--------|-----------|
| 8 | Manajemen user & role, retensi & pemusnahan arsip |
| 9 | Integrasi Meilisearch (opsional), export laporan (PDF, Excel) |
| 10 | PWA setup, backup otomatis, security hardening |

### Fase 5: Testing & Deployment (Minggu 11–12)

| Minggu | Milestone |
|--------|-----------|
| 11 | Unit test (Vitest), E2E test (Playwright), security audit (OWASP ZAP) |
| 12 | Deployment production (PM2 + Nginx), user training, dokumentasi |

---

## 16. METRIK KESUKSESAN (KPI)

| KPI | Baseline | Target 6 Bulan | Target 12 Bulan |
|-----|----------|----------------|-----------------|
| Waktu pencarian dokumen | 30 menit (manual) | < 1 menit | < 30 detik |
| Dokumen terdigitalisasi | 0% | 60% | 100% (arsip aktif) |
| User adoption rate (staf) | 0% | 80% | 95% |
| System uptime | N/A | 99.5% | 99.9% |
| NPS (Net Promoter Score) | N/A | > 30 | > 50 |
| Pengurangan penggunaan kertas | 0% | 50% | 70% |
| Waktu disposisi surat | 2–3 hari | < 4 jam | < 1 jam |

---

## 17. RISIKO & MITIGASI

| No | Risiko | Probabilitas | Dampak | Mitigasi |
|----|--------|-------------|--------|----------|
| R1 | Resistensi pengguna terhadap sistem baru | Tinggi | Tinggi | Program pelatihan bertahap, champions per unit, UX yang intuitif |
| R2 | Migrasi data arsip fisik memakan waktu lama | Tinggi | Sedang | Prioritisasi arsip aktif (5 tahun terakhir), rekrut tenaga bantu scanning |
| R3 | Koneksi internet tidak stabil di sekolah | Sedang | Tinggi | Mode offline (PWA), sync saat online, caching lokal |
| R4 | Kebocoran data sensitif siswa | Rendah | Sangat Tinggi | Enkripsi end-to-end, RBAC ketat, audit trail, pen test berkala |
| R5 | Server VPS down | Rendah | Tinggi | Monitoring dengan Uptime Kuma, auto-restart PM2, backup rutin |
| R6 | Database corruption | Rendah | Sangat Tinggi | Backup harian otomatis, replication MariaDB, disaster recovery plan |
| R7 | MySQL full-text search lambat untuk data besar | Sedang | Sedang | Migrasi ke Meilisearch saat dokumen > 50.000 |
| R8 | OCR Tesseract.js lambat untuk file besar | Sedang | Sedang | Gunakan queue (BullMQ) untuk proses async, batasi ukuran file |

---

## 18. GLOSSARY

| Istilah | Definisi |
|---------|----------|
| **Arsip Aktif** | Dokumen yang masih sering digunakan dalam operasional sehari-hari |
| **Arsip Inaktif** | Dokumen yang jarang diakses namun masih dalam masa retensi |
| **OCR** | Optical Character Recognition – teknologi pembacaan teks dari gambar |
| **RBAC** | Role-Based Access Control – kontrol akses berbasis peran |
| **Disposisi** | Instruksi tindak lanjut atas surat masuk |
| **Retensi** | Jangka waktu penyimpanan dokumen sebelum dimusnahkan |
| **Dapodik** | Data Pokok Pendidikan – sistem data nasional Kemendikbud |
| **UU PDP** | Undang-Undang Pelindungan Data Pribadi |
| **SLA** | Service Level Agreement |
| **RPO/RTO** | Recovery Point Objective / Recovery Time Objective |
| **SSR** | Server-Side Rendering – render halaman di server |
| **SSG** | Static Site Generation – generate halaman statis saat build |
| **PWA** | Progressive Web App – web app yang bisa di-install seperti aplikasi mobile |
| **FULLTEXT** | Fitur pencarian teks lengkap di MySQL/MariaDB |

---

## 19. LAMPIRAN

### 19.1 Referensi Regulasi

1. UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi
2. PP No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik
3. UU No. 43 Tahun 2009 tentang Kearsipan
4. Peraturan ANRI No. 9 Tahun 2018 tentang Pedoman Pemeliharaan Arsip Dinamis
5. Permendikbudristek tentang Standar Akreditasi

### 19.2 Dokumentasi Teknologi

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [TailwindCSS v4 Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MariaDB Documentation](https://mariadb.com/kb/en/)
- [Meilisearch Documentation](https://www.meilisearch.com/docs)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### 19.3 Dokumen Terkait (Akan Dibuat)

- [ ] Dokumen Arsitektur Teknis (Technical Design Document)
- [ ] API Specification (OpenAPI/Swagger)
- [ ] Database Schema (ERD)
- [ ] UI/UX Design File (Figma)
- [ ] Test Plan & Test Cases
- [ ] User Manual
- [ ] Disaster Recovery Plan
- [ ] SOP Penggunaan Sistem

### 19.4 Perintah Cepat (Quick Reference)

```bash
# === Development ===
npm run dev              # Jalankan development server
npx prisma studio        # Buka Prisma Studio (database GUI)
npx prisma migrate dev   # Jalankan migrasi database

# === Production ===
npm run build            # Build untuk production
pm2 start ecosystem.config.js  # Jalankan dengan PM2
pm2 logs                 # Lihat log aplikasi
pm2 restart eduarch      # Restart aplikasi

# === Database ===
npx prisma db seed       # Seed database
npx prisma db push       # Push schema tanpa migration
npx prisma generate      # Regenerate Prisma Client

# === Backup ===
/usr/local/bin/backup-eduarch.sh  # Jalankan backup manual

# === SSL ===
sudo certbot renew       # Renew SSL certificate
```

---

> **Catatan:** Dokumen PRD ini bersifat living document dan akan diperbarui secara berkala sesuai dengan feedback pengguna dan perubahan kebutuhan. Revisi harus melalui proses review oleh Product Owner dan stakeholder terkait.

---

**Disetujui oleh:**

| Peran | Nama | Tanggal | Tanda Tangan |
|-------|------|---------|-------------|
| Product Owner | _______________ | ___/___/2026 | |
| Kepala Sekolah | _______________ | ___/___/2026 | |
| Tech Lead | _______________ | ___/___/2026 | |
| Kepala TU | _______________ | ___/___/2026 | |

---

*Akhir Dokumen PRD v2.0*