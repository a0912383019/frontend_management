import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import 'element-plus/dist/index.css'

export const elementPlusRegister = (app) => {
  app.use(ElementPlus, {
    locale: {
      el: {
        ...zhTw.el,
        pagination: {
          pagesize: '筆/頁',
          total: `共 {total} 筆`,
          goto: '前往第',
          pageClassifier: '頁'
        }
      }
    }
  })

  for (let iconName in Icons) {
    app.component(iconName, Icons[iconName])
  }
}
