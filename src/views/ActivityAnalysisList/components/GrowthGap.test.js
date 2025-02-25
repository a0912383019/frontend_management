import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import GrowthGap from '@/views/ActivityAnalysisList/components/GrowthGap.vue'
import { ElNotification } from 'element-plus'
import { useActivityAnalysisStore } from '@/stores'
import {
  apiQueryGrowthGapCommissionable,
  apiQueryGrowthGapReal,
  apiQueryGrowthGapProfit
} from '@/api'
import ActivityChart from '@/views/ActivityAnalysisList/components/ActivityChart.vue'
import router from '@/router'

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')

  return {
    ...actual,
    ElNotification: vi.fn()
  }
})

vi.mock('@/api', () => ({
  apiQueryGrowthGapCommissionable: vi.fn(),
  apiQueryGrowthGapReal: vi.fn(),
  apiQueryGrowthGapProfit: vi.fn()
}))

describe('GrowthGap', () => {
  let wrapper
  let analysisStore
  const apiError = new Error('API Error')
  apiError.response = {
    status: 404
  }

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    analysisStore = useActivityAnalysisStore(pinia)
    analysisStore.chartFiltered = 1
    analysisStore.chartApiParams = {
      start_date: '2023-01-01',
      end_date: '2023-01-31',
      cut_type: 'monthly',
      reward_flag: true,
      search_activity: []
    }
    analysisStore.currentTabs = 'GrowthGap'
    analysisStore.chartFilteredArr = {
      GrowthGap: { status: 0 }
    }

    // mock api value
    apiQueryGrowthGapCommissionable.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [1, 2, 3] }
    })
    apiQueryGrowthGapReal.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [4, 5, 6] }
    })
    apiQueryGrowthGapProfit.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [7, 8, 9] }
    })

    // 讓 console.error 不要洗版
    vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = shallowMount(GrowthGap, {
      global: {
        plugins: [i18n, router]
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('components', () => {
    expect(wrapper.findComponent(ActivityChart).exists()).toBe(true)
  })

  it('成功查詢所有圖表, onMounted 第一次 queryCharts', async () => {
    await flushPromises()
    expect(ElNotification).toHaveBeenCalledWith({
      title: '查詢成功',
      type: 'success'
    })
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapReal).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledOnce()
    expect(wrapper.vm.apiObjectCommissionable.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectCommissionable.result).toStrictEqual([1, 2, 3])
    expect(wrapper.vm.apiObjectReal.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectReal.result).toStrictEqual([4, 5, 6])
    expect(wrapper.vm.apiObjectProfit.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectProfit.result).toStrictEqual([7, 8, 9])
  })

  it('部分 API 查詢失敗, watch 觸發', async () => {
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapReal).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledOnce()

    apiQueryGrowthGapCommissionable.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [1, 2, 3] }
    })
    apiQueryGrowthGapReal.mockRejectedValue(apiError)
    apiQueryGrowthGapProfit.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [7, 8, 9] }
    })

    // 觸發 watch
    analysisStore.chartFiltered = 2
    await flushPromises()
    expect(ElNotification).toHaveBeenCalledWith({
      title: '部份查詢失敗，請重新操作',
      type: 'error'
    })
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledTimes(2)
    expect(apiQueryGrowthGapReal).toHaveBeenCalledTimes(2)
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledTimes(2)
  })

  it('全部 API 查詢失敗, watch 觸發', async () => {
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapReal).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledOnce()
    apiQueryGrowthGapCommissionable.mockRejectedValue(apiError)
    apiQueryGrowthGapReal.mockRejectedValue(apiError)
    apiQueryGrowthGapProfit.mockRejectedValue(apiError)

    // 觸發 watch
    analysisStore.chartFiltered = 2
    await flushPromises()
    expect(ElNotification).toHaveBeenCalledWith({
      title: '查詢失敗，請重新操作',
      type: 'error'
    })
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledTimes(2)
    expect(apiQueryGrowthGapReal).toHaveBeenCalledTimes(2)
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledTimes(2)
  })

  it('顯示 noResult 訊息, watch 觸發', async () => {
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapReal).toHaveBeenCalledOnce()
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledOnce()

    apiQueryGrowthGapCommissionable.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [] }
    })

    // 觸發 watch
    analysisStore.chartFiltered = 2
    await flushPromises()
    expect(wrapper.vm.apiObjectCommissionable.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectCommissionable.messageKey).toBe('noResult')
    expect(apiQueryGrowthGapCommissionable).toHaveBeenCalledTimes(2)
    expect(apiQueryGrowthGapReal).toHaveBeenCalledTimes(2)
    expect(apiQueryGrowthGapProfit).toHaveBeenCalledTimes(2)
  })
})
