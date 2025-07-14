import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Wyłącz sourcemapy w produkcji
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
  // Server configuration (tylko dla developmentu)
  server: {
    port: 5173,
    proxy: {
      // Proxy do API Ministerstwa Finansów
      '/api/mf': {
        target: 'https://wl-api.mf.gov.pl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mf/, '/api'),
        secure: false,
      },
      // Proxy do Google Apps Script
      '/api/gus': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/api\/gus/,
            '/macros/s/AKfycbwl25HRBXrLPrgs58QmozBU9dZYouu-J5qXrIx4nZvlRJaFk1Org5OjXw1NE0OO5i7X/exec'
          ),
      },
    },
  },
  // Definiuj zmienne środowiskowe
  define: {
    'import.meta.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
  },
})