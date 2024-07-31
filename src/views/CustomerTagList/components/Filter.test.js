import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import Filter from '@/views/CustomerTagList/components/Filter.vue'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

describe('Filter', () => {
  let wrapper = null
  const hide = vi.fn()

  beforeEach(() => {
    const result = {
      result: {
        ag_name: ['aapprmb', 'acandy', 'acash888', 'aesbtest'],
        user_level: [
          { user_level_id: 15608, user_level_name: '控管層-一般(內)-B' },
          { user_level_id: 15610, user_level_name: '未分層' },
          { user_level_id: 15613, user_level_name: '第0-0層' }
        ]
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    const error = {
      return_code: '9999',
      message: 'Unexpected error.',
      error_code: '210400001',
      errors: 'Unexpected error.'
    }
    vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case '/api/auth/member/ag_name_user_level':
          return Promise.resolve({ data: result })
        default:
          return error
      }
    })

    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus, router],
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

  it('queryAgNameUserLevel', () => {
    // 代理帳號
    const accountOptions = [
      { value: '0', label: '全部', selected: true },
      { value: 'aapprmb', label: 'aapprmb' },
      { value: 'acandy', label: 'acandy' },
      { value: 'acash888', label: 'acash888' },
      { value: 'aesbtest', label: 'aesbtest' }
    ]
    expect(wrapper.vm.selectAccountOptions).toStrictEqual(accountOptions)

    // 會員層級
    const levelOptions = [
      { value: '0', label: '全部', selected: true },
      { value: 15608, label: '控管層-一般(內)-B' },
      { value: 15610, label: '未分層' },
      { value: 15613, label: '第0-0層' }
    ]
    expect(wrapper.vm.selectLevelOptions).toStrictEqual(levelOptions)
  })

  it('watch form.member', async () => {
    wrapper.vm.form.member = 'test'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.formDisabled).toBe(true)

    wrapper.vm.form.member = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.formDisabled).toBe(false)
  })

  it('handleCsvSuccess', async () => {
    const user = ['ye4676', 'txphydd', 'j8888', 'jsasdg']

    wrapper.vm.handleCsvSuccess(user)
    expect(hide).toHaveBeenCalled()
  })

  it('handleCsvClear', async () => {
    wrapper.vm.form.custom_user_list = ['aa']
    await wrapper.vm.handleCsvClear()
    expect(wrapper.vm.form.custom_user_list).toStrictEqual([])
  })

  // 測試 closePopover
  it('closePopover', () => {
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalled()
  })
})
