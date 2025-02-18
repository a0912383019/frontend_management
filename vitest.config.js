import { fileURLToPath } from 'node:url'
import { mergeConfig, loadEnv } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: 'jsdom',
        // include: ['src/views/ActivityAnalysisList/components/ActivityChart.test.js'], // 可指定要測試哪個檔案，gitlab的cicd會跑很久，可用此設定測試
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        coverage: {
          provider: 'v8'
        },
        reporters:
          loadEnv(configEnv, process.cwd()).VITE_ENV !== 'local'
            ? ['default']
            : ['junit', 'json', 'verbose'],
        outputFile: {
          junit: './test/report.xml'
        }
      }
    })
  )
)
