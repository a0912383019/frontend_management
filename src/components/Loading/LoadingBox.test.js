import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LoadingBox from '@/components/Loading/LoadingBox.vue'

describe('LoadingBox', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders with default props', () => {
    wrapper = shallowMount(LoadingBox)

    //default props是否有正確應用到元件上
    expect(wrapper.find('.loader').classes()).toContain('lg')
    expect(wrapper.find('.loader').classes()).toContain('grey')
  })

  it('renders with specific props', () => {
    wrapper = shallowMount(LoadingBox, {
      props: {
        size: 'sm',
        color: 'blue'
      }
    })

    //props是否有正確應用到元件上
    expect(wrapper.find('.loader').classes()).toContain('sm')
    expect(wrapper.find('.loader').classes()).toContain('blue')
  })
})
