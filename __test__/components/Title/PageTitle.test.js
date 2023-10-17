import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PageTitle from '@/components/Title/PageTitle.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('PageTitle', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('no props.icon，確認組件是否渲染正確', () => {
    wrapper = shallowMount(PageTitle, {
      props: {
        title: 'no icon'
      },
      global: {
        components: {
          FontAwesomeIcon
        }
      }
    })

    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false)
    expect(wrapper.find('.title__name').text()).toStrictEqual('no icon')
  })

  it('props.icon exists，確認組件是否渲染正確', () => {
    wrapper = shallowMount(PageTitle, {
      props: {
        icon: 'fa-gear',
        title: 'has icon'
      },
      global: {
        components: {
          FontAwesomeIcon
        }
      }
    })

    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
    expect(wrapper.find('.title__name').text()).toStrictEqual('has icon')
  })
})
