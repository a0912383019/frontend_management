import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

export const elementPlusRegister = (app) => {
  app.use(ElementPlus)

  for (let iconName in Icons) {
    app.component(iconName, Icons[iconName])
  }
}
