import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import ElementPlus from 'element-plus'
import { i18n } from '@/global/i18n'
import { library } from '@/utils/fontawsome.js'

describe('SwitchWithTooltip', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = mount(SwitchWithTooltip, {
      global: {
        plugins: [ElementPlus, i18n]
      },
      props: {
        name: 'Happy Day',
        color: 'blue',
        isDisabled: false
      },
      components: {
        FontAwesomeIcon,
        CdpIcon
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('test variables & components', async () => {
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false)
    expect(wrapper.vm.switchColor).toStrictEqual('cdp-switch-blue')

    await wrapper.setProps({ tooltipContent: 'logic is awesome' })
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
  })

  // 是否有正確觸發emit
  it('test emit', async () => {
    await wrapper.find('.el-switch__input').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
