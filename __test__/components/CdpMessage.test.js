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

  // 確認組件是否存在
  it('expect component', () => {
    expect(wrapper.classes('message')).toBe(true)
  })

  // 測試getIcon
  it('expect getIcon', () => {
    const result = wrapper.vm.getIcon('loading')
    expect(result).toBe('fa-solid fa-spinner')
  })

  // 測試messageData
  it('expect messageData', () => {
    const result = wrapper.vm.messageData
    expect(result).toEqual({
      icon: 'fa-solid fa-spinner',
      title: '查詢中'
    })
  })

  // 測試messageStyle
  it('expect messageStyle', () => {
    const result = wrapper.vm.messageStyle
    expect(result).toEqual({
      height: '300px'
    })
  })

  // 測試props cover
  it('expect props cover', () => {
    expect(wrapper.find('.message').classes()).toContain('cover')
  })

  // 測試props bg
  it('expect props bg', () => {
    expect(wrapper.find('.message').classes()).toContain('dark')
  })
})
