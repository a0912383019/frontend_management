import { it, describe, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tag from '@/components/Filter/Tag.vue'

describe('Tag', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(Tag, {
      props: {
        title: '測試標題',
        color: 'blue'
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  it('驗證tag class是否符合預期', () => {
    expect(wrapper.find('.tag').classes()).toContain('blue')
  })

  it('驗證tag title是否符合預期', () => {
    expect(wrapper.find('.tag').text()).toBe('測試標題')
  })
})
