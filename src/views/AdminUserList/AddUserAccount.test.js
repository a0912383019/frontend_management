import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import AddUserAccount from '@/views/AdminUserList/AddUserAccount.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AccessHall from '@/views/AdminUserList/components/AccessHall.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('AddUserAccount', () => {
  let wrapper = null
  let spyPost

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    useGlobalStore(pinia)

    const postResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyPost = vi.spyOn(axiosGoInstance, 'post')
    spyPost.mockResolvedValue(postResult)

    wrapper = shallowMount(AddUserAccount, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        },
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          },
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        userId: 24,
        userName: 'kowkow'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    expect(wrapper.findComponent(AccessHall).exists()).toBe(true)
    expect(wrapper.findComponent(CdpButton).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmBox).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
  })

  it('handleOpenDialog & handleDialogClosed', () => {
    const resetFields = vi.fn()
    wrapper.vm.$refs.formRef.resetFields = resetFields
    wrapper.vm.user.userType = '1'
    wrapper.vm.user.userStatus = '1'
    const initHalls = vi.fn()
    wrapper.vm.$refs.accessHallRef.initHalls = initHalls

    expect(resetFields).toBeCalledTimes(0)
    expect(wrapper.vm.user.userType).toStrictEqual('1')
    expect(wrapper.vm.user.userStatus).toStrictEqual('1')
    expect(initHalls).toBeCalledTimes(0)

    wrapper.vm.handleOpenDialog()
    expect(resetFields).toBeCalledTimes(1)
    expect(wrapper.vm.user.userType).toStrictEqual('0')
    expect(wrapper.vm.user.userStatus).toStrictEqual('0')
    expect(initHalls).toBeCalledTimes(1)
    expect(wrapper.emitted('closeAddDialog')).toBeFalsy()

    wrapper.vm.handleDialogClosed()
    expect(resetFields).toBeCalledTimes(2)
    expect(initHalls).toBeCalledTimes(2)
    expect(wrapper.emitted('closeAddDialog')).toBeTruthy()
  })

  it('formRules', () => {
    expect(wrapper.vm.formRules).toStrictEqual([
      {
        message: '請輸入Email',
        required: true
      },
      {
        message: '請輸入正確的Email格式',
        type: 'email'
      },
      {
        validator: expect.any(Function)
      }
    ])
  })

  it('handleUserAdd', () => {
    const clearValidate = vi.fn()
    wrapper.vm.$refs.formRef.clearValidate = clearValidate
    const checkHallNodes = vi.fn().mockReturnValue([
      {
        hallCode: 'bmw',
        label: 'bmw'
      },
      {
        hallCode: 'rb',
        label: 'rb'
      }
    ])
    wrapper.vm.$refs.accessHallRef.checkHallNodes = checkHallNodes
    let validate = vi.fn((callback) => callback(false))
    wrapper.vm.$refs.formRef.validate = validate

    wrapper.vm.newAccessHallsLable = ['esx']
    wrapper.vm.newAccessHallsValue = 'who,ck,nq'
    expect(wrapper.vm.newAccessHallsLable).toStrictEqual(['esx'])
    expect(wrapper.vm.newAccessHallsValue).toStrictEqual('who,ck,nq')

    wrapper.vm.handleUserAdd()
    expect(wrapper.vm.newAccessHallsLable).toStrictEqual([])
    expect(wrapper.vm.newAccessHallsValue).toStrictEqual('')

    validate = vi.fn((callback) => callback(true))
    wrapper.vm.$refs.formRef.validate = validate

    wrapper.vm.newAccessHallsLable = ['esx']
    wrapper.vm.newAccessHallsValue = 'who,ck,nq'
    expect(wrapper.vm.newAccessHallsLable).toStrictEqual(['esx'])
    expect(wrapper.vm.newAccessHallsValue).toStrictEqual('who,ck,nq')
    expect(wrapper.vm.confirmAddBox).toBeFalsy()

    wrapper.vm.handleUserAdd()
    wrapper.vm.newAccessHallsLable = ['bmw', 'rb']
    expect(wrapper.vm.newAccessHallsValue).toStrictEqual('bmw,rb')
    expect(wrapper.vm.confirmAddBox).toBeTruthy()
  })

  it('cancelAdd', () => {
    wrapper.vm.confirmAddBox = true
    expect(wrapper.vm.confirmAddBox).toBeTruthy()

    wrapper.vm.cancelAdd()
    expect(wrapper.vm.confirmAddBox).toBeFalsy()
  })

  it('emailChange', () => {
    wrapper.vm.emailDuplicate = true
    expect(wrapper.vm.emailDuplicate).toBeTruthy()

    wrapper.vm.emailChange()
    expect(wrapper.vm.emailDuplicate).toBeFalsy()
  })

  it('confirmAdd', async () => {
    wrapper.vm.confirmAddBox = true
    expect(wrapper.vm.confirmAddBox).toBeTruthy()
    expect(wrapper.emitted('addSuccess')).toBeFalsy()

    wrapper.vm.confirmAdd()
    await flushPromises()
    expect(wrapper.vm.confirmAddBox).toBeFalsy()
    expect(wrapper.emitted('addSuccess')).toBeTruthy()
  })
})
