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

  it('name = delete, emits cancel event when cancel button is clicked', async () => {
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
        modelValue: true
      }
    })
    expect(wrapper.find('.inner-dialog__title').classes()).toContain('delete-color')
    expect(wrapper.findAllComponents(CdpButton)[1].classes()).toContain('delete-bg')
    //觸發取消按鈕點擊事件
    await wrapper.find('.cdp__modal-btn__cancel').trigger('click')

    //檢查是否觸發了名為 'cancel' 的事件
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('name = notSaved, emits confirm event when confirm button is clicked', async () => {
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
        name: 'notSaved',
        modelValue: true
      }
    })
    expect(wrapper.find('.inner-dialog__title').classes()).not.toContain('delete-color')
    expect(wrapper.findAllComponents(CdpButton)[1].classes()).not.toContain('delete-bg')

    //觸發確認按鈕點擊事件
    await wrapper.find('.cdp__modal-btn__submit').trigger('click')

    //檢查是否觸發了名為 'confirm' 的事件
    expect(wrapper.emitted('confirmExecute')).toBeTruthy()
  })

  it('name = notSaved, set modelValue to change visibleValue', async () => {
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
        name: 'notSaved',
        modelValue: true
      }
    })
    expect(wrapper.vm.visibleValue).toBeTruthy()
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.vm.visibleValue).toBeFalsy()
  })
})
