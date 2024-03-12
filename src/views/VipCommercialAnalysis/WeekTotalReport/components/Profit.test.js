import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Profit from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Profit.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

describe('Profit', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'esx'
    }

    const result1 = {
      data: {
        result: {
          profit_zero: 6,
          profit_positive: 2,
          profit_1a: 3,
          profit_10a: 0,
          profit_50a: 0,
          profit_100a: 0,
          profit_over100a: 0,
          total_people: 11
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
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

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Profit, {
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

  it('Expected components render correctly, mock api 0000', async () => {
    const data = [
      {
        profit_zero: '6',
        profit_positive: '2',
        profit_1a: '3',
        profit_10a: '0',
        profit_50a: '0',
        profit_100a: '0',
        profit_over100a: '0',
        total_people: '11'
      }
    ]

    await wrapper.vm.queryWeekProfitReport()
    expect(wrapper.vm.tableData).toStrictEqual(data)
  })
})
