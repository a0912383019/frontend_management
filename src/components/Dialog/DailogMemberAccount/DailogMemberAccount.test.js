import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { i18n } from '@/global/i18n'
import DailogMemberAccount from '@/components/Dialog/DailogMemberAccount/DailogMemberAccount.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'

describe('DailogMemberAccount.vue', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const user_info = {
      user_name: 'test',
      user_id: 77
    }
    sessionStorage.setItem('user_info', JSON.stringify(user_info))

    let result1 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          id: 249,
          name: 'BI-CDP-Tyty',
          email: 'tyty@mail.ty.net',
          user_type: 9,
          user_status: 0,
          access_hall_name: 'esx,hf8,jg,bmw,b9,rb',
          google_picture_url: 'https://test.ggg-c',
          login_num: 339,
          last_login_date: '2024-05-22 03:09:22',
          created_time: '2023-05-12 05:18:42',
          updated_time: '2024-01-19 03:13:24'
        }
      }
    }

    let result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(DailogMemberAccount, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        modelValue: false
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected variables correctly', async () => {
    expect(wrapper.props('modelValue')).toBe(false)
    expect(wrapper.vm.userName).toStrictEqual('')
    let memberData = {
      email: '',
      accountType: '',
      createdTime: '',
      loginNum: '',
      lastUpdateTime: '',
      lastLoginTime: ''
    }
    expect(wrapper.vm.memberData).toStrictEqual(memberData)

    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.memberData).toStrictEqual(memberData)
  })

  it('Expected variables correctly when api called after open dialog', async () => {
    await wrapper.vm.handleOpenDialog()
    await flushPromises()
    expect(wrapper.vm.userName).toStrictEqual('BI-CDP-Tyty')
    let memberData = {
      email: 'tyty@mail.ty.net',
      accountType: '系統管理員',
      createdTime: '2023/05/12 05:18:42',
      lastLoginTime: '2024/05/22 03:09:22',
      lastUpdateTime: '2024/01/19 03:13:24',
      loginNum: '339'
    }
    expect(wrapper.vm.memberData).toStrictEqual(memberData)

    await wrapper.vm.handleOpenDialog()
    await flushPromises()
    expect(wrapper.vm.userName).toStrictEqual('')
    memberData = {
      email: '',
      accountType: '',
      createdTime: '',
      loginNum: '',
      lastUpdateTime: '',
      lastLoginTime: ''
    }
    expect(wrapper.vm.memberData).toStrictEqual(memberData)
  })

  it('Expected emit correctly when close dialog', async () => {
    expect(wrapper.emitted('closeDialog')).toBeFalsy()
    await wrapper.vm.handleDialogClosed()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })
})
