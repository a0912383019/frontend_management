import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import CdpIcon from '@/components/CdpIcon.vue'

describe('SvgIcon', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(CdpIcon, {
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

  // 驗證iconName
  it('iconName', () => {
    expect(wrapper.vm.iconName).toBe('#icon-arrow')
  })

  // 驗證svgClass
  it('svgClass', () => {
    expect(wrapper.vm.svgClass).toBe('svg-icon icon-arrow')
  })
})
