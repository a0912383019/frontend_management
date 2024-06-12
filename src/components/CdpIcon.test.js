import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CdpIcon from '@/components/CdpIcon.vue'

describe('SvgIcon', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(CdpIcon, {
      props: {
        name: 'arrow',
        color: '#faa'
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
