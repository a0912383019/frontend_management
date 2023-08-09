import { createI18n } from 'vue-i18n'
import zhTw from '@/language/zh-TW/zh-TW.json'
import zhCN from '@/language/zh-CN/zh-CN.json'
import en from '@/language/en/en.json'
export const i18n = createI18n({
  legacy: false, //使用vue3 Composition Api 一定要設為false才可使用
  locale: sessionStorage.languageType ?? 'zh-TW', //設定預設語系
  fallbackLocale: 'zh-TW',
  warnHtmlMessage: false, // i18n內包含html標籤，console不跳警告提示
  messages: {
    'zh-TW': zhTw,
    'zh-CN': zhCN,
    en: en
  }
})
export const i18nRegister = (app) => {
  app.use(i18n)
}

export const lngs = {
  en: { nativeName: 'English' },
  'zh-TW': { nativeName: '繁體' },
  'zh-CN': { nativeName: '简体' }
}
