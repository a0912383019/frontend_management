import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import router from '@/router'
import { useGlobalStore } from '@/stores/global.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import StepConfig from '@/components/StepConfig.vue'
import { library } from '@/utils/fontawsome.js'

describe('StepConfig', () => {
  let wrapper = null
  let globalStore = null
  beforeEach(() => {
    wrapper = mount(StepConfig, {
      props: {
        stepIndex: 2
      },
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      },
      components: {
        FontAwesomeIcon,
        CdpIcon
      }
    })
    globalStore = useGlobalStore()
  })
  afterEach(() => {
    wrapper.unmount()
    globalStore = null
  })

  // 預期取得tableConfig[2]的description
  it('Expected to obtain the description of tableConfig[2]', () => {
    let description = '註冊或登入會員「產生下注或存款行為」'
    expect(globalStore.tableConfig[wrapper.vm.props.stepIndex]['step_description']).toBe(
      description
    )
  })
})
