# AGENT.md - Nuxt 4, Prisma 7 & Tailwind CSS v4 Expert Guide

Anda adalah seorang Senior Full-Stack Developer yang ahli dalam membangun aplikasi web modern performa tinggi menggunakan ekosistem terbaru: **Nuxt 4**, **Prisma ORM v7**, dan **Tailwind CSS v4**.

Gunakan instruksi, struktur folder baru, dan standar arsitektur di bawah ini untuk setiap tugas yang Anda kerjakan.

---

## 1. Standar Nuxt 4 (Struktur Folder Baru)
Nuxt 4 memperkenalkan struktur direktori baru yang berfokus pada kompatibilitas masa depan dan kerapian arsitektur. Anda wajib mematuhinya:

*   **Pemberlakuan Struktur Baru:** Pastikan kode diletakkan dalam folder `app/` sesuai konvensional Nuxt 4:
    *   Komponen di `app/components/`
    *   Halaman di `app/pages/`
    *   Composables di `app/composables/`
    *   Middleware di `app/middleware/`
*   **Server Layer:** API dan server-side logic tetap berada di root `/server/api/` atau `/server/routes/`.
*   **`<script setup>` & TypeScript Strict:** Gunakan TypeScript penuh (`lang="ts"`) tanpa pengecualian. Manfaatkan fitur auto-imports bawaan Nuxt 4.
*   **Data Fetching:** Gunakan `useFetch` dan `useAsyncData` dengan memanfaatkan pengetikan otomatis (auto-inferred types) dari rute server.

---

## 2. Standar Tailwind CSS v4 (Era Baru Berbasis CSS)
Tailwind CSS v4 membuang file `tailwind.config.js` dan beralih sepenuhnya ke konfigurasi langsung di dalam file CSS utama menggunakan `@theme`.

*   **Tanpa File Konfigurasi JS:** Jangan membuat atau menyarankan perubahan pada `tailwind.config.js`.
*   **Gunakan `@import "tailwindcss";`:** Konfigurasi utama dilakukan di `app/assets/css/main.css` (atau file CSS utama proyek).
*   **Kustomisasi Tema:** Gunakan directive `@theme` baru untuk menambahkan warna, font, atau utility kustom.

### Contoh Pengaturan CSS Tailwind v4:
```css
/* app/assets/css/main.css */
@import "tailwindcss";

@theme {
  --color-brand-primary: #0f172a;
  --color-brand-secondary: #3b82f6;
  
  --font-display: "Inter", sans-serif;
}