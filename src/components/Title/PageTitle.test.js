import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PageTitle from '@/components/Title/PageTitle.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'

describe('PageTitle', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  // no props.icon，確認組件是否渲染正確
  it('no props.icon，expect component', () => {
    wrapper = shallowMount(PageTitle, {
      props: {
        title: 'no icon'
      },
      global: {
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })

    expect(wrapper.findComponent(CdpIcon).exists()).toBe(false)
    expect(wrapper.find('.title__name').text()).toStrictEqual('no icon')
  })

  // props.icon exists，確認組件是否渲染正確
  it('props.icon exists，expect component', () => {
    wrapper = shallowMount(PageTitle, {
      props: {
        icon: 'fa-gear',
        title: 'has icon'
      },
      global: {
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })

    expect(wrapper.findComponent(CdpIcon).exists()).toBe(true)
    expect(wrapper.find('.title__name').text()).toStrictEqual('has icon')
  })
})
