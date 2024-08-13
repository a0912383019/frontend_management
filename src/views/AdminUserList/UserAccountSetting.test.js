import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus, { dayjs } from 'element-plus'
import UserAccountSetting from '@/views/AdminUserList/UserAccountSetting.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AccessHall from '@/views/AdminUserList/components/AccessHall.vue'
import CdpButton from '@/components/Button/CdpButton.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('UserAccountSetting', () => {
  let wrapper = null
  let spyGet
  let spyPut
  const userMockData = {
    access_hall_name: 'esx,jg,bmw',
    created_time: '2023-01-17 03:09:30',
    email: 'wayne_wang@superbtech.asia',
    google_picture_url: 'https://picture',
    id: 2,
    last_login_date: '2023-02-15 06:12:37',
    login_num: 6,
    name: 'AI-Wayne',
    updated_time: '2024-08-08 22:44:28',
    user_status: 0,
    user_type: 9
  }

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.userTypeConfig = {
      0: '一般使用者',
      1: '進階使用者',
      8: '遊戲廳管理員',
      9: '系統管理員',
      '-1': 'GM'
    }
    globalStore.userStatusConfig = {
      0: '啟用',
      1: '停用'
    }

    const getResultEmpty = {
      data: {
        status: {
          return_code: '0001',
          message: 'success'
        }
      }
    }
    const getResult = {
      data: {
        result: userMockData,
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    const putResult = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(getResultEmpty)
    spyGet.mockResolvedValueOnce(getResult)
    spyPut = vi.spyOn(axiosGoInstance, 'put')
    spyPut.mockResolvedValue(putResult)

    // 讓console.error不要洗版
    vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = shallowMount(UserAccountSetting, {
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
        userId: 24,
        userName: 'kowkow'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(AccessHall).exists()).toBe(false)
    expect(wrapper.findComponent(CdpButton).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmBox).exists()).toBe(true)

    wrapper.vm.startRender = true
    expect(wrapper.findComponent(AccessHall).exists()).toBe(false)
  })

  it('handleUserEdit', () => {
    expect(wrapper.vm.edit).toBeFalsy()
    wrapper.vm.handleUserEdit()
    expect(wrapper.vm.edit).toBeTruthy()
  })

  it('handleEditConfirm', async () => {
    wrapper.vm.startRender = true
    await wrapper.vm.$nextTick()
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

    expect(wrapper.vm.newAccessHallsLable).toStrictEqual([])
    expect(wrapper.vm.newAccessHallsValue).toStrictEqual('')
    expect(wrapper.vm.confirmEditBox).toBeFalsy()

    wrapper.vm.handleEditConfirm()
    expect(wrapper.vm.newAccessHallsLable).toStrictEqual(['bmw', 'rb'])
    expect(wrapper.vm.newAccessHallsValue).toStrictEqual('bmw,rb')
    expect(wrapper.vm.confirmEditBox).toBeTruthy()
  })

  it('handleOpenDialog', async () => {
    wrapper.vm.form.userType = 9
    wrapper.vm.userDetail.userId = 99
    expect(wrapper.vm.form.userType).toStrictEqual(9)
    expect(wrapper.vm.userDetail.userId).toStrictEqual(99)

    wrapper.vm.handleOpenDialog()
    expect(wrapper.vm.form.userType).toStrictEqual(null)
    expect(wrapper.vm.userDetail.userId).toStrictEqual('')
    expect(spyGet).toHaveBeenCalledTimes(1)
    expect(spyGet).toHaveBeenCalledWith('/api/auth/admin/user/user_info', {
      params: { member_id: wrapper.vm.props.userId }
    })
    expect(wrapper.vm.startRender).toBeFalsy()
    expect(wrapper.vm.userHalls).toStrictEqual([])

    wrapper.vm.handleOpenDialog()
    await flushPromises()
    expect(spyGet).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.userDetail.userId).toStrictEqual(userMockData.id)
    expect(wrapper.vm.userDetail.email).toStrictEqual(userMockData.email)
    expect(wrapper.vm.userDetail.userType).toStrictEqual('系統管理員')
    expect(wrapper.vm.form.userType).toStrictEqual('9')
    expect(wrapper.vm.userDetail.userStatus).toStrictEqual('啟用')
    expect(wrapper.vm.form.userStatus).toStrictEqual('0')
    expect(wrapper.vm.userDetail.createTime).toStrictEqual(
      dayjs(userMockData.created_time).format('YYYY/MM/DD HH:mm:ss')
    )
    expect(wrapper.vm.userDetail.loginNum).toStrictEqual(userMockData.login_num)
    expect(wrapper.vm.userDetail.updateTime).toStrictEqual(
      dayjs(userMockData.updated_time).format('YYYY/MM/DD HH:mm:ss')
    )
    expect(wrapper.vm.userDetail.lastLoginTime).toStrictEqual(
      dayjs(userMockData.last_login_date).format('YYYY/MM/DD HH:mm:ss')
    )
    expect(wrapper.vm.userHalls).toStrictEqual(['esx', 'jg', 'bmw'])
    expect(wrapper.vm.startRender).toBeTruthy()
  })

  it('handleDialogClosed', () => {
    wrapper.vm.edit = true
    wrapper.vm.startRender = true
    expect(wrapper.vm.edit).toBeTruthy()
    expect(wrapper.vm.startRender).toBeTruthy()
    expect(wrapper.emitted('closeDialog')).toBeFalsy()

    wrapper.vm.handleDialogClosed()
    expect(wrapper.vm.edit).toBeFalsy()
    expect(wrapper.vm.startRender).toBeFalsy()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })

  it('handleEditCancel', () => {
    expect(wrapper.vm.cancelEditBox).toBeFalsy()
    wrapper.vm.handleEditCancel()
    expect(wrapper.vm.cancelEditBox).toBeTruthy()
  })

  it('cancelExecute', () => {
    wrapper.vm.cancelEditBox = true
    expect(wrapper.vm.cancelEditBox).toBeTruthy()
    wrapper.vm.cancelExecute()
    expect(wrapper.vm.cancelEditBox).toBeFalsy()
  })

  it('confirmExecute', async () => {
    wrapper.vm.startRender = true
    await wrapper.vm.$nextTick()
    wrapper.vm.originUserData = {
      user_type: 9,
      user_status: 0
    }
    const initHalls = vi.fn()
    wrapper.vm.$refs.accessHallRef.initHalls = initHalls
    wrapper.vm.edit = true
    wrapper.vm.cancelEditBox = true
    expect(wrapper.vm.edit).toBeTruthy()
    expect(wrapper.vm.cancelEditBox).toBeTruthy()
    expect(wrapper.vm.form.userType).toStrictEqual(null)
    expect(wrapper.vm.form.userStatus).toStrictEqual(null)

    wrapper.vm.confirmExecute()
    expect(wrapper.vm.form.userType).toStrictEqual('9')
    expect(wrapper.vm.form.userStatus).toStrictEqual('0')
    expect(wrapper.vm.edit).toBeFalsy()
    expect(wrapper.vm.cancelEditBox).toBeFalsy()
  })

  it('cancelSaved', () => {
    wrapper.vm.confirmEditBox = true
    expect(wrapper.vm.confirmEditBox).toBeTruthy()
    wrapper.vm.cancelSaved()
    expect(wrapper.vm.confirmEditBox).toBeFalsy()
  })

  it('confirmSaved', async () => {
    wrapper.vm.confirmEditBox = true
    expect(wrapper.vm.confirmEditBox).toBeTruthy()
    expect(wrapper.emitted('updateSuccess')).toBeFalsy()

    const params = {
      user_type: 8,
      user_status: 1,
      access_hall_name: 'esx,bmw'
    }
    wrapper.vm.form.userType = params.user_type.toString()
    wrapper.vm.form.userStatus = params.user_status.toString()
    wrapper.vm.newAccessHallsValue = params.access_hall_name

    wrapper.vm.confirmSaved()
    await flushPromises()
    expect(spyPut).toHaveBeenCalledWith(`/api/auth/admin/user/${wrapper.vm.props.userId}`, params)
    expect(wrapper.vm.confirmEditBox).toBeFalsy()
    expect(wrapper.emitted('updateSuccess')).toBeTruthy()
  })
})
