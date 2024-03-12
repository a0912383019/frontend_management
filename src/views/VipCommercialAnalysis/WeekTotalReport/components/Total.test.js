import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import { sortTableData } from '@/utils/commonUtils.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Total from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Total.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'

describe('Total', () => {
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
            financial_year: 2024,
            financial_month: 3,
            financial_week: 1,
            financial_week_start: '2024-03-04',
            financial_week_end: '2024-03-10',
            active_people: 3,
            bet_amount: '25030.0000',
            deposit_amount: '201498.0000',
            payoff: '9638.0000',
            premium_amount: '1663.7300',
            profit_loss: '7974.2700',
            net_amount: '-900.0000',
            ga_num: 0,
            login_num: 15
          },
          {
            financial_year: 2024,
            financial_month: 3,
            financial_week: 2,
            financial_week_start: '2024-03-11',
            financial_week_end: '2024-03-17',
            active_people: 1,
            bet_amount: '9000.0000',
            deposit_amount: '0',
            payoff: '1925.0000',
            premium_amount: '249.9000',
            profit_loss: '1675.1000',
            net_amount: '0',
            ga_num: 0,
            login_num: 2
          },
          {
            financial_year: 2024,
            financial_month: 3,
            financial_week: 3,
            financial_week_start: '2024-03-18',
            financial_week_end: '2024-03-24',
            active_people: 0,
            bet_amount: '0',
            deposit_amount: '0',
            payoff: '0',
            premium_amount: '0',
            profit_loss: '0',
            net_amount: '0',
            ga_num: 0,
            login_num: 0
          },
          {
            financial_year: 2024,
            financial_month: 3,
            financial_week: 4,
            financial_week_start: '2024-03-25',
            financial_week_end: '2024-03-31',
            active_people: 0,
            bet_amount: '0',
            deposit_amount: '0',
            payoff: '0',
            premium_amount: '0',
            profit_loss: '0',
            net_amount: '0',
            ga_num: 0,
            login_num: 0
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

    wrapper = shallowMount(Total, {
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
  })

  it('upadteCurrentSort', async () => {
    wrapper.vm.upadteCurrentSort({ prop: 'bet_amount', order: 'descending' })
    expect(sortTableData).toHaveBeenCalled()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    const data = [
      {
        date_duration: '2024/03/04 ~ 2024/03/10',
        date_duration_start: '2024/03/04',
        date_duration_end: '2024/03/10',
        active_people: '3',
        deposit_amount: '201,498',
        bet_amount: '25,030',
        payoff: '9,638',
        premium_amount: '1,664',
        profit_loss: '7,974',
        net_amount: '<span class="text-danger">-900</span>',
        ga_num: '0',
        login_num: '15'
      },
      {
        date_duration: '2024/03/11 ~ 2024/03/17',
        date_duration_start: '2024/03/11',
        date_duration_end: '2024/03/17',
        active_people: '1',
        deposit_amount: '0',
        bet_amount: '9,000',
        payoff: '1,925',
        premium_amount: '250',
        profit_loss: '1,675',
        net_amount: '0',
        ga_num: '0',
        login_num: '2'
      },
      {
        date_duration: '2024/03/18 ~ 2024/03/24',
        date_duration_start: '2024/03/18',
        date_duration_end: '2024/03/24',
        active_people: '0',
        deposit_amount: '0',
        bet_amount: '0',
        payoff: '0',
        premium_amount: '0',
        profit_loss: '0',
        net_amount: '0',
        ga_num: '0',
        login_num: '0'
      },
      {
        date_duration: '2024/03/25 ~ 2024/03/31',
        date_duration_start: '2024/03/25',
        date_duration_end: '2024/03/31',
        active_people: '0',
        deposit_amount: '0',
        bet_amount: '0',
        payoff: '0',
        premium_amount: '0',
        profit_loss: '0',
        net_amount: '0',
        ga_num: '0',
        login_num: '0'
      }
    ]

    await wrapper.vm.queryWeekTotalReport()
    expect(wrapper.vm.tableData).toStrictEqual(data)
  })
})
