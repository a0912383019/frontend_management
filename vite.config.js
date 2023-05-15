import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { svgBuilder } from './src/utils/svgBuilder'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  // build: {
  //   outDir: 'CDP'
  // },
  plugins: [vue(), svgBuilder('./src/assets/icons/')],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/global.scss";`
      }
    }
  },
  server: {
    proxy: {
      '/travelApi': {
        target: 'https://www.travel.taipei/open-api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/travelApi/, '')
      },
      '/cdpapi': {
        target: 'https://dev-api-cdp.caino.club',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdpapi/, '')
      }
    }
  }
})
