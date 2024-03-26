import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TooltipCustomTag from '@/components/TooltipCustomTag.vue'

describe('TooltipCustomTag', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(TooltipCustomTag, {
      global: {
        plugins: [ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
  })
})
