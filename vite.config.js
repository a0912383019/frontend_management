import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import { svgBuilder } from './src/utils/svgBuilder'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: loadEnv(mode, process.cwd()).VITE_ENV !== 'staging' ? '/' : '/cdp-v2/',
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
          target: 'https://qa-cdp-api.caino.club',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/php-api/, '')
        },
        '/go-api': {
          target: 'https://qa-cdp-v-api.caino.club',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/go-api/, '')
        }
      }
    }
  })
}
