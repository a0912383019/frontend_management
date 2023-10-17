import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('ButtonIcon', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('props.icon default，確認組件是否渲染正確', () => {
    wrapper = shallowMount(ButtonIcon, {
      props: {
        name: 'btn name one',
        size: 'large',
        color: 'blue',
        bg: true
      },
      global: {
        components: {
          FontAwesomeIcon
        }
      }
    })

    expect(wrapper.vm.buttonClass).toStrictEqual('button__large button__blue')
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(false)
    expect(wrapper.find('.btn-reset').text()).toStrictEqual('btn name one')
  })

  it('確認組件是否渲染正確', () => {
    wrapper = shallowMount(ButtonIcon, {
      props: {
        name: 'btn name two',
        icon: 'down',
        size: 'large',
        color: 'purple',
        bg: true
      },
      global: {
        components: {
          FontAwesomeIcon
        }
      }
    })

    expect(wrapper.vm.buttonClass).toStrictEqual('button__large button__purple')
    expect(wrapper.findComponent(FontAwesomeIcon).exists()).toBe(true)
    expect(wrapper.find('.btn-reset').text()).toStrictEqual('btn name two')
  })
})
