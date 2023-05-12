import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@/utils/fontawsome'

export const fontAwesomeIconRegister = (app) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
