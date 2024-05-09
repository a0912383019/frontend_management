import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ConfirmBox from '@/components/ConfirmBox.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ElementPlus from 'element-plus'

describe('ConfirmBox.vue', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  it('props & var & emit correct', async () => {
    wrapper = shallowMount(ConfirmBox, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        modelValue: true,
        title: 'cdp title',
        content: 'cdp content',
        leftBtn: 'cdp left btn',
        rightBtn: 'cdp right btn'
      }
    })

    expect(wrapper.findComponent(CdpButton).exists()).toBe(true)
    expect(wrapper.props('title')).toStrictEqual('cdp title')
    expect(wrapper.props('content')).toStrictEqual('cdp content')
    expect(wrapper.vm.leftBtnName).toStrictEqual('cdp left btn')
    expect(wrapper.vm.rightBtnName).toStrictEqual('cdp right btn')

    await wrapper.vm.handleCancel()
    expect(wrapper.emitted('cancelExecute')).toBeTruthy()

    await wrapper.vm.handleComfirm()
    expect(wrapper.emitted('confirmExecute')).toBeTruthy()

    expect(wrapper.find('.inner-dialog__icon img').attributes().src).toStrictEqual(
      '/src/assets/images/alert-2.png'
    )
    expect(wrapper.find('.inner-dialog__title').classes()).not.toContain('red-color')
    expect(wrapper.findComponent('.cdp__modal-btn__submit').classes()).not.toContain('red-bg')

    await wrapper.setProps({ color: 'red' })
    expect(wrapper.find('.inner-dialog__icon img').attributes().src).toStrictEqual(
      '/src/assets/images/alert-1.png'
    )
    expect(wrapper.find('.inner-dialog__title').classes()).toContain('red-color')
    expect(wrapper.findComponent('.cdp__modal-btn__submit').classes()).toContain('red-bg')
  })
})
