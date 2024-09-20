import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import EditDetail from '@/views/CustomTagsSetting/components/EditDetail.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

describe('EditDetail', () => {
  let wrapper = null
  let spyPut

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    useGlobalStore(pinia)

    const putResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyPut = vi.spyOn(axiosGoInstance, 'put')
    spyPut.mockResolvedValue(putResult)

    wrapper = shallowMount(EditDetail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        },
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        modelValue: true,
        tagCode: '50001',
        tagName: 'test tag',
        tagDescription: 'testing'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)
  })

  it('should call callback without error when description is valid', () => {
    const callbackFunc = vi.fn()

    wrapper.vm.validateTrimDescription(null, 'Valid description', callbackFunc)

    expect(callbackFunc).toBeCalledTimes(1)
    expect(callbackFunc).toBeCalledWith()
  })

  it('should call callback with an error when description is empty', () => {
    const callbackFunc = vi.fn()

    wrapper.vm.validateTrimDescription(null, '', callbackFunc)

    expect(callbackFunc).toBeCalledTimes(1)
    expect(callbackFunc).toBeCalledWith(new Error('請輸入空白以外的內容'))
  })

  it('rules', () => {
    const rules = {
      tagDescription: [
        {
          message: '請輸入標籤說明內容',
          required: true,
          trigger: 'change'
        },
        {
          max: 200,
          message: '標籤說明內容過長(最多為200個字元)',
          trigger: 'change'
        },
        {
          trigger: 'change',
          validator: expect.any(Function)
        }
      ]
    }
    expect(wrapper.vm.rules).toStrictEqual(rules)
  })

  it('handleDialogClosed', () => {
    expect(wrapper.emitted('closeDetail')).toBeFalsy()
    wrapper.vm.handleDialogClosed()
    expect(wrapper.emitted('closeDetail')).toBeTruthy()
  })

  it('handleDialogOpen & watch tagForm.tagDescription', async () => {
    let validate = vi.fn((callback) => callback(true))
    wrapper.vm.$refs.formRef.validate = validate

    wrapper.vm.submitBtnDisabled = false
    expect(wrapper.vm.submitBtnDisabled).toBeFalsy()
    expect(wrapper.vm.tagForm.tagDescription).toStrictEqual('')

    wrapper.vm.handleDialogOpen()
    expect(wrapper.vm.submitBtnDisabled).toBeTruthy()
    expect(wrapper.vm.tagForm.tagDescription).toStrictEqual('testing')

    wrapper.vm.tagForm.tagDescription = 'test again'
    await flushPromises()
    expect(wrapper.vm.submitBtnDisabled).toBeFalsy()
  })

  it('updateTagDescription', async () => {
    expect(wrapper.emitted('updateSuccess')).toBeFalsy()

    wrapper.vm.updateTagDescription()
    await flushPromises()
    expect(spyPut).toHaveBeenCalled()
    expect(wrapper.emitted('updateSuccess')).toBeTruthy()
  })
})
