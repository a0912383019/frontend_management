import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import Search from '@/components/Search.vue'

describe('Search', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(Search, {
      props: {
        modelValue: 'bro',
        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
      },
      global: {
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試渲染
  it('expect component', () => {
    expect(wrapper.find('.search__input').exists()).toBe(true)
    expect(wrapper.find('.search__iconsearch').exists()).toBe(true)
  })

  // 測試input
  it('test input', async () => {
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.props('modelValue')).toBe('test')
  })

  // 測試button delete
  it('test button delete', async () => {
    await wrapper.find('.search__icondelete').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.props('modelValue')).toBe('')
  })
})
