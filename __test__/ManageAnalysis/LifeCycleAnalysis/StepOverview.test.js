import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { storeToRefs } from 'pinia'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import StepOverview from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/StepOverview.vue'
import FilterDate from '@/components/Filter/FilterDate.vue'
import ExportReport from '@/components/ExportReport.vue'
import AvgCard from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/components/AvgCard.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ElementPlus from 'element-plus'
import router from '@/router'

describe('階段總覽', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = mount(StepOverview, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ],
        components: {
          FontAwesomeIcon
        }
      }
    })
  })
  afterEach(() => {
    wrapper.unmount()
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})

  it('預設apiSuccess = false，預期渲染的元件', async () => {
    expect(wrapper.findComponent(FilterDate).exists()).toBe(false)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(false)
    expect(wrapper.findComponent(AvgCard).exists()).toBe(false)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('進階篩選，日期更新後執行的動作', async () => {
    const value = {
      timestamp: 1694577285954,
      rangeDate: '2023-08-14 ~ 2023-09-11'
    }
    const manageAnalysisStore = useManageAnalysisStore()
    const { deatilRangeDate, filterDateTimestamp } = storeToRefs(manageAnalysisStore)

    wrapper.vm.updateTimestamp(value)
    expect(filterDateTimestamp.value).toBe(value.timestamp)
    expect(deatilRangeDate.value).toBe(value.rangeDate)

    wrapper.vm.filterCustomUserList = []
    wrapper.vm.activeHall.hall_code = 'esb'
    wrapper.vm.queryDate = '2023-09-11'
    wrapper.vm.deatilRangeDate = '2023-08-14 ~ 2023-09-11'
    wrapper.vm.stepType = 1
    wrapper.vm.detailType = 0
    wrapper.vm.searchName = ''
    wrapper.vm.fuzzySearch = false
    //mock api 0000
    const result0 = {
      data: {
        result: {
          avg_bet_amount: '11645.60',
          avg_payoff: '-314.22',
          avg_deposit_amount: '1717.48'
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    //觸發updateTimestamp
    wrapper.vm.filterDateTimestamp = 1234567
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //等待異步完成
    await flushPromises()
  })

  it('監聽FilterMemberName.vue時間戳記', () => {
    wrapper.vm.filterTimestamp = 123456
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('clickNumberAboveToShow')
  })

  it('觸發watch 與 mock api 是否如預期', async () => {
    wrapper.vm.filterCustomUserList = []
    wrapper.vm.activeHall.hall_code = 'esb'
    wrapper.vm.queryDate = '2023-09-11'
    wrapper.vm.deatilRangeDate = '2023-08-14 ~ 2023-09-11'
    wrapper.vm.stepType = 1
    wrapper.vm.detailType = 0
    wrapper.vm.searchName = ''
    wrapper.vm.fuzzySearch = false
    //mock api 0000
    const result0 = {
      data: {
        result: {
          avg_bet_amount: '11645.60',
          avg_payoff: '-314.22',
          avg_deposit_amount: '1717.48'
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    //觸發updateTimestamp
    wrapper.vm.filterDateTimestamp = 1234567
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(AvgCard).exists()).toBe(true)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(true)

    //mock error api 403
    const error403 = new Error('Forbidden')
    error403.response = {
      status: 403
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(error403)
    //觸發watch的fn
    wrapper.vm.filterDateTimestamp = 2323448
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.messageKey).toBe('noPermission')

    //mock error api 401
    const error401 = new Error('error')
    error401.response = {
      status: 401
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(error401)
    //觸發watch的fn
    wrapper.vm.filterDateTimestamp = 2323449
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料

    //mock error api other
    const errorOther = new Error('error')
    errorOther.response = {
      status: 999
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(errorOther)
    //觸發watch的fn
    wrapper.vm.filterDateTimestamp = 2323450
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.messageKey).toBe('chartFailed')
  })
})
