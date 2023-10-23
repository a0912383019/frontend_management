import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import SvgKnob from '@/components/SvgKnob.vue'

describe('SvgKnob', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(SvgKnob, {
      props: {
        percent: 20,
        text: 'mobile'
      },
      global: {
        plugins: [
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  // 驗證end數值是否正確
  it('Verify that the end value is correct', () => {
    let circumference = 2 * Math.PI * 100
    let end = circumference * (wrapper.vm.props.percent / 100)
    expect(wrapper.vm.end).toBe(end)
  })

  // 測試.knob__percent是否為props percent
  it('Test whether .knob__percent is props percent', () => {
    expect(wrapper.find('.knob__percent').text()).toContain(wrapper.vm.props.percent)
  })

  // 測試.knob__text是否為props text
  it('Test whether .knob__text is props text', () => {
    expect(wrapper.find('.knob__text').text()).toContain(wrapper.vm.props.text)
  })
})
