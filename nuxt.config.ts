// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },

  serverDir: './server',

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@vite-pwa/nuxt',
  ],

  css: ['./assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    storagePath: process.env.STORAGE_PATH || './storage',
    meilisearchUrl: process.env.MEILISEARCH_URL,
    meilisearchKey: process.env.MEILISEARCH_KEY,
    public: {
      appName: 'EduArch',
      appVersion: '1.0.0',
      maxUploadSize: 50 * 1024 * 1024,
    },
  },

  app: {
    head: {
      title: 'EduArch - Sistem Arsip Digital Sekolah',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistem Arsip Digital untuk Sekolah' },
        { name: 'theme-color', content: '#4f46e5' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico'],
    manifest: {
      name: 'EduArch - Sistem Arsip Digital Sekolah',
      short_name: 'EduArch',
      description: 'Sistem Arsip Digital untuk Sekolah',
      theme_color: '#4f46e5',
      background_color: '#f9fafb',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
    },
    client: {
      installPrompt: true,
    },
  },

  nitro: {
    compressPublicAssets: true,
    bodyLimit: 50 * 1024 * 1024,
    alias: {
      '~': process.cwd(),
    },
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: process.env.NODE_ENV !== 'production' },
})
