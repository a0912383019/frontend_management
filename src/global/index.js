import { elementPlusRegister } from './element-plus'
import { highchartsRegister } from './highcharts'
import { i18nRegister } from './i18n.js'
import { svgIconRegister } from './svg-icon'
import { googleLoginRegister } from './google-login'
import { fontAwesomeIconRegister } from './font-awesome-icon'

export const globalRegister = (app) => {
  elementPlusRegister(app)
  highchartsRegister(app)
  i18nRegister(app)
  svgIconRegister(app)
  googleLoginRegister(app)
  fontAwesomeIconRegister(app)
}
