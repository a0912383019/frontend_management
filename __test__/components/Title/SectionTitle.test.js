import { it, describe, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import ElementPlus from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import { library } from '@/utils/fontawsome.js'

describe('SectionTitle', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  // no tooltip，確認組件是否渲染正確
  it('no tooltip，expect component', () => {
    wrapper = mount(SectionTitle, {
      global: {
        plugins: [ElementPlus]
      },
      components: {
        FontAwesomeIcon,
        CdpIcon
      },
      props: {
        title: 'Section with Title'
      }
    })

    expect(wrapper.find('.title__name').text()).toStrictEqual('Section with Title')
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false)
    expect(wrapper.vm.hasSlotContent).toBe(false)
  })

  // has tooltip，確認組件是否渲染正確
  it('has tooltip，expect component', async () => {
    wrapper = mount(SectionTitle, {
      global: {
        plugins: [ElementPlus]
      },
      components: {
        FontAwesomeIcon,
        CdpIcon
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
