import { it, describe, expect } from 'vitest'
import { library } from '@/utils/fontawsome.js'
import {
  faExclamationTriangle,
  faAngleDown,
  faHistory,
  faBook,
  faMagnifyingGlass,
  faXmark,
  faHome,
  faTags,
  faPeopleArrows,
  faDonate,
  faBars,
  faChartPie,
  faDice,
  faChartLine,
  faGift,
  faSortAmountDown,
  faCog,
  faSyncAlt,
  faList,
  faUserCog,
  faUsersCog,
  faInfoCircle,
  faCircleInfo,
  faPersonRunning,
  faBaby,
  faPersonSkating,
  faPersonHiking,
  faWheelchair,
  faBedPulse,
  faSkullCrossbones,
  faSpinner,
  faTriangleExclamation,
  faPiggyBank,
  faEye,
  faSliders,
  faDownload,
  faMoneyBillWave,
  faChartArea,
  faGear,
  faLock,
  faShieldAlt,
  faPlus,
  faUsers,
  faCaretLeft,
  faCaretDown,
  faCaretUp,
  faSearch,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import {
  faWindowRestore,
  faGrinStars,
  faGrinBeam,
  faSmile,
  faFaceMeh,
  faFrown,
  faDizzy
} from '@fortawesome/free-regular-svg-icons'
import { faVimeoV } from '@fortawesome/free-brands-svg-icons'

describe('Font Awesome Icon Library Configuration', () => {
  it('should add all solid icons to the library', () => {
    const solidIcons = [
      faExclamationTriangle,
      faAngleDown,
      faHistory,
      faBook,
      faMagnifyingGlass,
      faXmark,
      faHome,
      faTags,
      faPeopleArrows,
      faDonate,
      faBars,
      faChartPie,
      faDice,
      faChartLine,
      faGift,
      faSortAmountDown,
      faCog,
      faSyncAlt,
      faList,
      faUserCog,
      faUsersCog,
      faInfoCircle,
      faCircleInfo,
      faPersonRunning,
      faBaby,
      faPersonSkating,
      faPersonHiking,
      faWheelchair,
      faBedPulse,
      faSkullCrossbones,
      faSpinner,
      faTriangleExclamation,
      faPiggyBank,
      faEye,
      faSliders,
      faDownload,
      faMoneyBillWave,
      faChartArea,
      faGear,
      faLock,
      faShieldAlt,
      faPlus,
      faUsers,
      faCaretLeft,
      faCaretDown,
      faCaretUp,
      faSearch,
      faChevronDown
    ]

    solidIcons.forEach((icon) => {
      expect(library.definitions['fas'][icon.iconName]).toEqual(icon.icon)
    })
  })

  it('should add all regular icons to the library', () => {
    const regularIcons = [
      faWindowRestore,
      faGrinStars,
      faGrinBeam,
      faSmile,
      faFaceMeh,
      faFrown,
      faDizzy
    ]

    regularIcons.forEach((icon) => {
      expect(library.definitions['far'][icon.iconName]).toEqual(icon.icon)
    })
  })

  it('should add all brand icons to the library', () => {
    const brandIcons = [faVimeoV]

    brandIcons.forEach((icon) => {
      expect(library.definitions['fab'][icon.iconName]).toEqual(icon.icon)
    })
  })
})
