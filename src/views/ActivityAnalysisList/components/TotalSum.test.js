import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import TotalSum from '@/views/ActivityAnalysisList/components/TotalSum.vue'
import { ElNotification } from 'element-plus'
import { useActivityAnalysisStore } from '@/stores'
import { apiQueryTotalCommissionable, apiQueryTotalReal, apiQueryTotalProfit } from '@/api'
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
  apiQueryTotalCommissionable: vi.fn(),
  apiQueryTotalReal: vi.fn(),
  apiQueryTotalProfit: vi.fn()
}))

describe('TotalSum', () => {
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
    analysisStore.currentTabs = 'TotalSum'
    analysisStore.chartFilteredArr = {
      TotalSum: { status: 0 }
    }

    // mock api value
    apiQueryTotalCommissionable.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [1, 2, 3] }
    })
    apiQueryTotalReal.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [4, 5, 6] }
    })
    apiQueryTotalProfit.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [7, 8, 9] }
    })

    // 讓 console.error 不要洗版
    vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = shallowMount(TotalSum, {
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
      type: 'success',
      duration: 1500
    })
    expect(apiQueryTotalCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryTotalReal).toHaveBeenCalledOnce()
    expect(apiQueryTotalProfit).toHaveBeenCalledOnce()
    expect(wrapper.vm.apiObjectCommissionable.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectCommissionable.result).toStrictEqual([1, 2, 3])
    expect(wrapper.vm.apiObjectReal.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectReal.result).toStrictEqual([4, 5, 6])
    expect(wrapper.vm.apiObjectProfit.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectProfit.result).toStrictEqual([7, 8, 9])
  })

  it('部分 API 查詢失敗, watch 觸發', async () => {
    expect(apiQueryTotalCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryTotalReal).toHaveBeenCalledOnce()
    expect(apiQueryTotalProfit).toHaveBeenCalledOnce()

    apiQueryTotalCommissionable.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [1, 2, 3] }
    })
    apiQueryTotalReal.mockRejectedValue(apiError)
    apiQueryTotalProfit.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [7, 8, 9] }
    })

    // 觸發 watch
    analysisStore.chartFiltered = 2
    await flushPromises()
    expect(ElNotification).toHaveBeenCalledWith({
      title: '部份查詢失敗，請重新操作',
      type: 'error',
      duration: 1500
    })
    expect(apiQueryTotalCommissionable).toHaveBeenCalledTimes(2)
    expect(apiQueryTotalReal).toHaveBeenCalledTimes(2)
    expect(apiQueryTotalProfit).toHaveBeenCalledTimes(2)
  })

  it('全部 API 查詢失敗, watch 觸發', async () => {
    expect(apiQueryTotalCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryTotalReal).toHaveBeenCalledOnce()
    expect(apiQueryTotalProfit).toHaveBeenCalledOnce()
    apiQueryTotalCommissionable.mockRejectedValue(apiError)
    apiQueryTotalReal.mockRejectedValue(apiError)
    apiQueryTotalProfit.mockRejectedValue(apiError)

    // 觸發 watch
    analysisStore.chartFiltered = 2
    await flushPromises()
    expect(ElNotification).toHaveBeenCalledWith({
      title: '查詢失敗，請重新操作',
      type: 'error',
      duration: 1500
    })
    expect(apiQueryTotalCommissionable).toHaveBeenCalledTimes(2)
    expect(apiQueryTotalReal).toHaveBeenCalledTimes(2)
    expect(apiQueryTotalProfit).toHaveBeenCalledTimes(2)
  })

  it('顯示 noResult 訊息, watch 觸發', async () => {
    expect(apiQueryTotalCommissionable).toHaveBeenCalledOnce()
    expect(apiQueryTotalReal).toHaveBeenCalledOnce()
    expect(apiQueryTotalProfit).toHaveBeenCalledOnce()

    apiQueryTotalCommissionable.mockResolvedValue({
      data: { status: { return_code: '0000' }, result: [] }
    })

    // 觸發 watch
    analysisStore.chartFiltered = 2
    await flushPromises()
    expect(wrapper.vm.apiObjectCommissionable.apiSuccess).toBeTruthy()
    expect(wrapper.vm.apiObjectCommissionable.messageKey).toBe('noResult')
    expect(apiQueryTotalCommissionable).toHaveBeenCalledTimes(2)
    expect(apiQueryTotalReal).toHaveBeenCalledTimes(2)
    expect(apiQueryTotalProfit).toHaveBeenCalledTimes(2)
  })
})
