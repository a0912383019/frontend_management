import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { sortTableData } from '@/utils/commonUtils.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Detail from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Detail.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import ActiveDetail from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/ActiveDetail.vue'
import ExportCSV from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/ExportCSV.vue'
import CdpIcon from '@/components/CdpIcon.vue'

describe('Detail', () => {
  let wrapper = null
  let spyGet
  const dialogFn = vi.fn()

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
    const vipStore = useVipCommercialAnalysisStore(pinia)
    vipStore.livelyAnalysisFilter = {
      searchDate: '2024/01/20',
      vipTag: '10001,10003'
    }

    const result1 = {
      data: {
        result: [
          {
            user_id: 457589186,
            analysis_level: 0,
            compare_level: 0,
            user_name: 'atqaaaron1',
            bet_amount: '0',
            payoff: '0',
            offer_amount: '43.3000',
            profit_loss: '-43.3000',
            net_amount: '0',
            deposit_amount: '0'
          },
          {
            user_id: 457588978,
            analysis_level: 0,
            compare_level: 0,
            user_name: 'pdlalaauto',
            bet_amount: '0',
            payoff: '0',
            offer_amount: '390.5000',
            profit_loss: '-390.5000',
            net_amount: '0',
            deposit_amount: '0'
          },
          {
            user_id: 457589872,
            analysis_level: 0,
            compare_level: 0,
            user_name: 'rmbgling',
            bet_amount: '9000.0000',
            payoff: '1925.0000',
            offer_amount: '249.9000',
            profit_loss: '1675.1000',
            net_amount: '0',
            deposit_amount: '0'
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

    spyGet = vi.spyOn(axiosGoInstance, 'post')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Detail, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon,
          CdpIcon
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
    expect(wrapper.findComponent(ActiveDetail).exists()).toBe(true)
    expect(wrapper.findComponent(ExportCSV).exists()).toBe(true)
  })

  it('Expected today is correctly', () => {
    expect(wrapper.vm.today).toBe('2024/01/20')
  })

  it('Expected tooltipDate is correctly', () => {
    const result = {
      lastWeekData: '2024/01/07 ~ 2024/01/13',
      thisWeekData: '2024/01/14 ~ 2024/01/20'
    }
    const tooltipDate = {
      lastWeekData: '',
      thisWeekData: ''
    }
    Object.entries(wrapper.vm.tooltipDate).map((item) => {
      tooltipDate[item[0]] = item[1].trim().replace(/\n\s*/g, ' ')
    })
    expect(tooltipDate).toStrictEqual(result)
  })

  it('upadteCurrentSort', () => {
    wrapper.vm.upadteCurrentSort({ prop: 'total_login_count', order: 'descending' })
    expect(sortTableData).toHaveBeenCalled()
  })

  it('handleActiveDetailClick', () => {
    wrapper.vm.$refs.refActiveDetail.handleOpenDialog = dialogFn
    wrapper.vm.handleActiveDetailClick()
    // 驗證 dialogFn 是否被呼叫過
    expect(dialogFn).toHaveBeenCalled()
  })

  it('Expected API data in the transform function is correct', async () => {
    const result = [
      {
        user_name: 'atqaaaron1',
        deposit_amount: '0',
        bet_amount: '0',
        payoff: '0',
        offer_amount: '43',
        profit_loss: '-43',
        net_amount: '0',
        user: { user_name: 'atqaaaron1', user_id: 457589186 },
        lastWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      },
      {
        user_name: 'pdlalaauto',
        deposit_amount: '0',
        bet_amount: '0',
        payoff: '0',
        offer_amount: '391',
        profit_loss: '-391',
        net_amount: '0',
        user: { user_name: 'pdlalaauto', user_id: 457588978 },
        lastWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      },
      {
        user_name: 'rmbgling',
        deposit_amount: '0',
        bet_amount: '9,000',
        payoff: '1,925',
        offer_amount: '250',
        profit_loss: '1,675',
        net_amount: '0',
        user: { user_name: 'rmbgling', user_id: 457589872 },
        lastWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' },
        thisWeekIcon: { icon: 'fa-dizzy', color: 'cdp-text-light__slate__gray' }
      }
    ]
    await wrapper.vm.queryMemberLivelyList({
      level: 0,
      type: 0
    })
    expect(wrapper.vm.tableData).toStrictEqual(result)
  })
})
