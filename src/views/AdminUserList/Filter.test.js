import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import Filter from '@/views/AdminUserList/Filter.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('Filter', () => {
  let wrapper = null
  let hide

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    useGlobalStore(pinia)
    hide = vi.fn()
    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })
    wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('selectUserTypeOptions', async () => {
    await wrapper.vm.$nextTick()

    const selectUserTypeOptions = [
      {
        label: '全部',
        selected: true,
        value: 'all'
      },
      {
        label: '一般使用者',
        value: '0'
      },
      {
        label: '進階使用者',
        value: '1'
      },
      {
        label: '遊戲廳管理員',
        value: '8'
      },
      {
        label: '系統管理員',
        value: '9'
      },
      {
        label: 'GM',
        value: '-1'
      }
    ]
    expect(wrapper.vm.selectUserTypeOptions).toStrictEqual(selectUserTypeOptions)
  })

  it('selectUserStatusOptions', async () => {
    await wrapper.vm.$nextTick()

    const selectUserStatusOptions = [
      {
        label: '全部',
        selected: true,
        value: 'all'
      },
      {
        label: '啟用',
        value: '0'
      },
      {
        label: '停用',
        value: '1'
      }
    ]
    expect(wrapper.vm.selectUserStatusOptions).toStrictEqual(selectUserStatusOptions)
  })

  it('closePopover', () => {
    expect(hide).toHaveBeenCalledTimes(0)
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalledTimes(1)
  })

  it('click filter', async () => {
    expect(hide).toHaveBeenCalledTimes(0)
    expect(wrapper.vm.form).toStrictEqual({
      userName: '',
      userType: 'all',
      userStatus: 'all',
      lastLoginTime: ''
    })

    wrapper.vm.form.userName = 'jimmy'
    wrapper.vm.form.userType = '9'
    wrapper.vm.form.userStatus = '0'
    wrapper.vm.form.lastLoginTime = ''

    const emitData = {
      userName: 'jimmy',
      userType: '9',
      userStatus: '0',
      lastLoginTime: null
    }
    await wrapper.vm.handleClick()
    expect(wrapper.emitted('searchAccount')).toBeTruthy()
    expect(wrapper.emitted('searchAccount')[0]).toEqual([emitData])
    expect(hide).toHaveBeenCalledTimes(1)
  })
})
