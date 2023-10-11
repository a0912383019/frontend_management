import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import SvgIcon from '@/components/SvgIcon.vue'

describe('SvgIcon', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(SvgIcon, {
      props: {
        name: 'arrow',
        color: '#faa'
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

  it('驗證iconName', () => {
    expect(wrapper.vm.iconName).toBe('#icon-arrow')
  })

  it('驗證svgClass', () => {
    expect(wrapper.vm.svgClass).toBe('svg-icon icon-arrow')
  })
})
