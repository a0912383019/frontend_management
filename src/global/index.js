import { elementPlusRegister } from './element-plus'
import { highchartsRegister } from './highcharts'
import { svgIconRegister } from './svg-icon'
import { googleLoginRegister } from './google-login'
import { fontAwesomeIconRegister } from './font-awesome-icon'

export const globalRegister = (app) => {
  elementPlusRegister(app)
  highchartsRegister(app)
  svgIconRegister(app)
  googleLoginRegister(app)
  fontAwesomeIconRegister(app)
}
