// https://nuxt.com/docs/api/configuration/nuxt-config
const enableSupabase = process.env.ENABLE_SUPABASE !== 'false'
const supabaseUrl = process.env.SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'demo-anon-key'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vite-pwa/nuxt',
    'nuxt-gtag'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      enableSupabase,
      supabaseUrl,
      supabaseKey,
      gtagId: process.env.GTAG_ID
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  typescript: {
    strict: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    },
    checker: true
  },

  gtag: {
    id: process.env.GTAG_ID
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt App',
      short_name: 'Nuxt App',
      theme_color: '#00DC82',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/offline.html',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  supabase: {
    url: supabaseUrl,
    key: supabaseKey,
    redirect: false
  }
})
