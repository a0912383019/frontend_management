import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { sortTableData } from '@/utils/commonUtils.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Detail from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Detail.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

describe('Detail', () => {
  let wrapper = null
  let spyGet

  const mocks = vi.hoisted(() => {
    return {
      sortTableData: vi.fn()
    }
  })

  vi.mock('@/utils/commonUtils.js', async (importOriginal) => {
    const mod = await importOriginal()
    return {
      ...mod,
      sortTableData: mocks.sortTableData
    }
  })

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'esb'
    }

    const result1 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            user_id: 24371,
            user_name: 'ballguest',
            login_hour: 19,
            total_login_count: 117
          },
          {
            user_id: 24365,
            user_name: 'cballguest',
            login_hour: 19,
            total_login_count: 107
          },
          {
            user_id: 24368,
            user_name: 'bcash888',
            login_hour: 19,
            total_login_count: 104
          }
        ]
      }
    }
    const result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'success',
          error_code: '210400000'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'post')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Detail, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    // 驗證組件是否存在
    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('upadteCurrentSort', async () => {
    wrapper.vm.upadteCurrentSort({ prop: 'total_login_count', order: 'descending' })
    expect(sortTableData).toHaveBeenCalled()
  })

  it('Expected API data in the transform function is correct', async () => {
    const data = [
      {
        user_id: 24371,
        user_name: 'ballguest',
        login_hour: 19,
        total_login_count: 117
      },
      {
        user_id: 24365,
        user_name: 'cballguest',
        login_hour: 19,
        total_login_count: 107
      },
      {
        user_id: 24368,
        user_name: 'bcash888',
        login_hour: 19,
        total_login_count: 104
      }
    ]
    await wrapper.vm.queryActiveTimeDetail({ activeTime: 10 })
    expect(wrapper.vm.tableData).toStrictEqual(data)
    expect(wrapper.vm.dataTime).toBe(10)
  })
})
