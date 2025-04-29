import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import { svgBuilder } from './src/utils/svgBuilder'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
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
        '/go-api': {
          target: 'https://dev-cdp.caino.team/v2',
          changeOrigin: true,
          // secure: false,
          rewrite: (path) => path.replace(/^\/go-api/, '')
        }
      }
    }
  })
}
