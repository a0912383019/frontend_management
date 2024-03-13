import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { sortTableData } from '@/utils/commonUtils.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Report from '@/views/VipCommercialAnalysis/DayReport/components/Report.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import ExportCSV from '@/views/VipCommercialAnalysis/DayReport/components/ExportCSV.vue'

describe('DayReport', () => {
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
            user_id: 457588978,
            user_name: 'pdlalaauto',
            bet_amount: '250.0000',
            payoff: '250.0000',
            profit_loss: '106.5000',
            deposit_amount: '1123.0000',
            offer_amount: '143.5000',
            ga_num: 0,
            login_num: 1,
            net_amount: '-877.0000'
          },
          {
            user_id: 457588964,
            user_name: 'pidlala6',
            bet_amount: '720.0000',
            payoff: '298.0000',
            profit_loss: '223.0000',
            deposit_amount: '0',
            offer_amount: '75.0000',
            ga_num: 0,
            login_num: 1,
            net_amount: '0'
          },
          {
            user_id: 457589748,
            user_name: 'leordtestlu',
            bet_amount: '0',
            payoff: '0',
            profit_loss: '0',
            deposit_amount: '0',
            offer_amount: '0',
            ga_num: 0,
            login_num: 1,
            net_amount: '0'
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

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Report, {
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
    expect(wrapper.findComponent(CurrencySignText).exists()).toBe(true)
    expect(wrapper.findComponent(ExportCSV).exists()).toBe(true)
  })

  it('upadteCurrentSort', async () => {
    wrapper.vm.upadteCurrentSort({ prop: 'bet_amount', order: 'descending' })
    expect(sortTableData).toHaveBeenCalled()
  })

  it('Expected API data in the transform function is correct', () => {
    const data = [
      {
        bet_amount: '250',
        deposit_amount: '1,123',
        ga_num: '0',
        login_num: '1',
        net_amount: '<span class="text-danger">-877</span>',
        offer_amount: '144',
        payoff: '250',
        profit_loss: '107',
        user: {
          user_id: 457588978,
          user_name: 'pdlalaauto'
        },
        user_name: 'pdlalaauto'
      },
      {
        bet_amount: '720',
        deposit_amount: '0',
        ga_num: '0',
        login_num: '1',
        net_amount: '0',
        offer_amount: '75',
        payoff: '298',
        profit_loss: '223',
        user: {
          user_id: 457588964,
          user_name: 'pidlala6'
        },
        user_name: 'pidlala6'
      },
      {
        bet_amount: '0',
        deposit_amount: '0',
        ga_num: '0',
        login_num: '1',
        net_amount: '0',
        offer_amount: '0',
        payoff: '0',
        profit_loss: '0',
        user: {
          user_id: 457589748,
          user_name: 'leordtestlu'
        },
        user_name: 'leordtestlu'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(data)
  })
})
