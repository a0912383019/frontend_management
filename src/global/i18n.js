import { createI18n } from 'vue-i18n'
import zhTw from '@/language/zh-TW/zh-TW.json'
import zhCN from '@/language/zh-CN/zh-CN.json'
import en from '@/language/en/en.json'
const i18n = createI18n({
  legacy: false, //使用vue3 Composition Api 一定要設為false才可使用
  locale: localStorage.languageType ?? 'zh-TW', //設定預設語系
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTw,
    'zh-CN': zhCN,
    'en-US': en
  }
})
export const i18nRegister = (app) => {
  app.use(i18n)
}
