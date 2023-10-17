import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FuzzySwitchWithTooltip from '@/components/Switch/FuzzySwitchWithTooltip.vue'
import ElementPlus from 'element-plus'
import { i18n } from '@/global/i18n'
import { library } from '@/utils/fontawsome.js'

describe('FuzzySwitchWithTooltip', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = mount(FuzzySwitchWithTooltip, {
      global: {
        plugins: [ElementPlus, i18n]
      },
      components: {
        FontAwesomeIcon
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('是否有正確觸發emit', async () => {
    await wrapper.find('.el-switch__input').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
