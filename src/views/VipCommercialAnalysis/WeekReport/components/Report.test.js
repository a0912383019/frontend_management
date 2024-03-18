import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { sortTableData } from '@/utils/commonUtils.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import Report from '@/views/VipCommercialAnalysis/WeekReport/components/Report.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import PercentWithIcon from '@/components/PercentWithIcon.vue'
import ExportCSV from '@/views/VipCommercialAnalysis/WeekReport/components/ExportCSV.vue'

describe('WeekReport', () => {
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
      hall_code: 'esx',
      hall_name: 'esx'
    }

    const result1 = {
      data: {
        result: [
          {
            user_id: 457588964,
            user_name: 'pidlala6',
            bet_amount: '780.0000',
            bet_amount_compare: '180.0000',
            payoff: '288.0000',
            profit_loss: '-318.5000',
            offer_amount: '606.5000',
            ga_num: 0,
            login_num: 4,
            net_amount: '100.0000',
            deposit_amount: '200498.0000',
            compare_bet_amount_percent: '333.3333'
          },
          {
            user_id: 457588966,
            user_name: 'pidlala',
            bet_amount: '0',
            bet_amount_compare: '0',
            payoff: '0',
            profit_loss: '0',
            offer_amount: '0',
            ga_num: 0,
            login_num: 0,
            net_amount: '0',
            deposit_amount: '0',
            compare_bet_amount_percent: '0'
          },
          {
            user_id: 457588978,
            user_name: 'pdlalaauto',
            bet_amount: '250.0000',
            bet_amount_compare: '216.0000',
            payoff: '250.0000',
            profit_loss: '-284.0000',
            offer_amount: '534.0000',
            ga_num: 0,
            login_num: 1,
            net_amount: '-877.0000',
            deposit_amount: '1123.0000',
            compare_bet_amount_percent: '15.7407'
          }
        ],
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

    wrapper = shallowMount(Report, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
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
    expect(wrapper.findComponent(PercentWithIcon).exists()).toBe(false)
    expect(wrapper.findComponent(ExportCSV).exists()).toBe(true)
  })

  it('upadteCurrentSort', async () => {
    wrapper.vm.upadteCurrentSort({ prop: 'bet_amount', order: 'descending' })
    expect(sortTableData).toHaveBeenCalled()
  })

  it('Expected API data in the transform function is correct', async () => {
    const data = [
      {
        user_id: 457588964,
        user_name: 'pidlala6',
        bet_amount: '780',
        bet_amount_compare: '180.0000',
        payoff: '288',
        profit_loss: '<span class="text-danger">-318</span>',
        offer_amount: '607',
        ga_num: '0',
        login_num: '4',
        net_amount: '100',
        deposit_amount: '200,498',
        compare_bet_amount_percent: '333',
        user: {
          user_name: 'pidlala6',
          user_id: 457588964
        }
      },
      {
        user_id: 457588966,
        user_name: 'pidlala',
        bet_amount: '0',
        bet_amount_compare: '0',
        payoff: '0',
        profit_loss: '0',
        offer_amount: '0',
        ga_num: '0',
        login_num: '0',
        net_amount: '0',
        deposit_amount: '0',
        compare_bet_amount_percent: '0',
        user: {
          user_name: 'pidlala',
          user_id: 457588966
        }
      },
      {
        user_id: 457588978,
        user_name: 'pdlalaauto',
        bet_amount: '250',
        bet_amount_compare: '216.0000',
        payoff: '250',
        profit_loss: '<span class="text-danger">-284</span>',
        offer_amount: '534',
        ga_num: '0',
        login_num: '1',
        net_amount: '<span class="text-danger">-877</span>',
        deposit_amount: '1,123',
        compare_bet_amount_percent: '16',
        user: {
          user_name: 'pdlalaauto',
          user_id: 457588978
        }
      }
    ]

    await wrapper.vm.queryWeekReport()
    expect(wrapper.vm.tableData).toStrictEqual(data)
  })
})
