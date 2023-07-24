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
      '/php-api': {
        target: 'https://demo-api-cdp.caino.club',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php-api/, '')
      },
      '/go-api': {
        target: 'https://demo-cdp-v-api.caino.club',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/go-api/, '')
      }
    }
  }
})
