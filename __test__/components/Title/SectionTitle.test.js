import { it, describe, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@/utils/fontawsome.js'

describe('SectionTitle', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('no tooltip，確認組件是否渲染正確', () => {
    wrapper = mount(SectionTitle, {
      global: {
        plugins: [ElementPlus]
      },
      components: {
        FontAwesomeIcon
      },
      props: {
        title: 'Section with Title'
      }
    })

    expect(wrapper.find('.title__name').text()).toStrictEqual('Section with Title')
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false)
    expect(wrapper.vm.hasSlotContent).toBe(false)
  })

  it('has tooltip，確認組件是否渲染正確', async () => {
    wrapper = mount(SectionTitle, {
      global: {
        plugins: [ElementPlus]
      },
      components: {
        FontAwesomeIcon
      },
      props: {
        title: 'Section with Title and Tooltip'
      },
      slots: {
        tooltip: 'Tooltip Content'
      }
    })

    expect(wrapper.find('.title__name').text()).toStrictEqual('Section with Title and Tooltip')
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
    expect(wrapper.vm.hasSlotContent).toBe(true)
  })
})
