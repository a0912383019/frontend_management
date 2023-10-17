import { it, describe, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('CdpMessage', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(CdpMessage, {
      props: {
        messageKey: 'shortLoading',
        cover: true,
        height: 300,
        bg: 'dark'
      },
      global: {
        plugins: [i18n],
        components: {
          FontAwesomeIcon,
          CdpIcon
        }
      }
    })
  })

  it('確認組件是否存在', () => {
    expect(wrapper.classes('message')).toBe(true)
  })

  it('測試getIcon', () => {
    const result = wrapper.vm.getIcon('loading')
    expect(result).toBe('fa-solid fa-spinner')
  })

  it('測試messageData', () => {
    const result = wrapper.vm.messageData
    expect(result).toEqual({
      icon: 'fa-solid fa-spinner',
      title: '查詢中'
    })
  })

  it('測試messageStyle', () => {
    const result = wrapper.vm.messageStyle
    expect(result).toEqual({
      height: '300px'
    })
  })

  it('測試props cover', () => {
    expect(wrapper.find('.message').classes()).toContain('cover')
  })

  it('測試props bg', () => {
    expect(wrapper.find('.message').classes()).toContain('dark')
  })
})
