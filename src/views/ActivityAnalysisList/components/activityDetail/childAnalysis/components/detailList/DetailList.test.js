import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import { createTestingPinia } from '@pinia/testing'
import DetailList from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/DetailList.vue'
import { apiQueryActivityCompareDetail } from '@/api'
import { createRouterMock } from 'vue-router-mock'
import { useActivityAnalysisStore } from '@/stores'

vi.mock('@/api', () => ({
  apiQueryActivityCompareDetail: vi.fn()
}))

describe('DetailList', () => {
  let wrapper = null
  let activityStore
  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })

    createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore()

    apiQueryActivityCompareDetail.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: {
          records_total: 107,
          data: [
            {
              user_id: 457053870,
              user_name: 'testdenny723',
              before_commissionable_avg: '2.8571',
              activity_commissionable_avg: '61.3630',
              after_commissionable_avg: '0',
              commissionable_rate_activity: '2047.7050',
              commissionable_rate_after: '-100.0000',
              before_profit_avg: '0.2214',
              activity_profit_avg: '-80.4037',
              after_profit_avg: '0',
              profit_rate_activity: '-36411.3334',
              profit_rate_after: '-100.0000'
            },
            {
              user_id: 455650502,
              user_name: 'royy',
              before_commissionable_avg: '2.7846',
              activity_commissionable_avg: '0',
              after_commissionable_avg: '0',
              commissionable_rate_activity: '-100.0000',
              commissionable_rate_after: '-100.0000',
              before_profit_avg: '1.0407',
              activity_profit_avg: '-0.0111',
              after_profit_avg: '0',
              profit_rate_activity: '-101.0676',
              profit_rate_after: '-100.0000'
            },
            {
              user_id: 455648868,
              user_name: 'karisan',
              before_commissionable_avg: '0.7143',
              activity_commissionable_avg: '7.5470',
              after_commissionable_avg: '0',
              commissionable_rate_activity: '956.5738',
              commissionable_rate_after: '-100.0000',
              before_profit_avg: '0.7143',
              activity_profit_avg: '2.0800',
              after_profit_avg: '0',
              profit_rate_activity: '191.2000',
              profit_rate_after: '-100.0000'
            }
          ]
        }
      }
    })

    wrapper = shallowMount(DetailList, {
      global: {
        plugins: [i18n, ElementPlus, router]
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('api correctly', async () => {
    await flushPromises()
    expect(apiQueryActivityCompareDetail).toBeCalledTimes(1)
    const tableData = [
      {
        activity_commissionable_avg: {
          rate: '2,048',
          val: '61'
        },
        activity_profit_avg: {
          rate: '-36,411',
          val: '-80'
        },
        after_commissionable_avg: {
          rate: '-100',
          val: '0'
        },
        after_profit_avg: {
          rate: '-100',
          val: '0'
        },
        before_commissionable_avg: '3',
        before_profit_avg: '0',
        member_name: {
          user_id: 457053870,
          user_name: 'testdenny723'
        }
      },
      {
        activity_commissionable_avg: {
          rate: '-100',
          val: '0'
        },
        activity_profit_avg: {
          rate: '-101',
          val: '0'
        },
        after_commissionable_avg: {
          rate: '-100',
          val: '0'
        },
        after_profit_avg: {
          rate: '-100',
          val: '0'
        },
        before_commissionable_avg: '3',
        before_profit_avg: '1',
        member_name: {
          user_id: 455650502,
          user_name: 'royy'
        }
      },
      {
        activity_commissionable_avg: {
          rate: '957',
          val: '8'
        },
        activity_profit_avg: {
          rate: '191',
          val: '2'
        },
        after_commissionable_avg: {
          rate: '-100',
          val: '0'
        },
        after_profit_avg: {
          rate: '-100',
          val: '0'
        },
        before_commissionable_avg: '1',
        before_profit_avg: '1',
        member_name: {
          user_id: 455648868,
          user_name: 'karisan'
        }
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
    expect(wrapper.vm.tableTotal).toStrictEqual(107)
    expect(wrapper.vm.pageTableTotal).toStrictEqual(107)
  })

  it('updateCurrentPage', () => {
    expect(wrapper.vm.apiDraw).toStrictEqual(1)
    expect(wrapper.vm.apiStart).toStrictEqual(0)
    expect(wrapper.vm.apiLength).toStrictEqual(20)
    expect(wrapper.vm.page).toStrictEqual({
      currentPage: 1,
      pageSize: 20
    })

    wrapper.vm.updateCurrentPage(2)
    expect(wrapper.vm.apiDraw).toStrictEqual(2)
    expect(wrapper.vm.apiStart).toStrictEqual(20)
    expect(wrapper.vm.page).toStrictEqual({
      currentPage: 2,
      pageSize: 20
    })
  })

  it('handleTableSort', async () => {
    await flushPromises()
    expect(apiQueryActivityCompareDetail).toBeCalledTimes(1)
    expect(wrapper.vm.sortCol).toStrictEqual('before_commissionable_avg')
    expect(wrapper.vm.defaultOrder).toStrictEqual('descending')

    wrapper.vm.handleTableSort({ prop: 'activity_commissionable_avg', order: 'ascending' })
    await flushPromises()
    expect(apiQueryActivityCompareDetail).toBeCalledTimes(2)
    expect(wrapper.vm.sortCol).toStrictEqual('activity_commissionable_avg')
    expect(wrapper.vm.defaultOrder).toStrictEqual('ascending')
  })

  it('handleStepClick', () => {
    expect(wrapper.vm.memberStepData).toStrictEqual({
      member_name: null,
      member_id: null,
      member_step_detail_date: null
    })
    expect(wrapper.vm.chartShow).toBeFalsy()

    wrapper.vm.handleStepClick({
      member_name: {
        user_name: 'rick',
        user_id: 2234332
      },
      activity_detail_date: '2024-01-01 ~ 2024-01-31'
    })
    expect(wrapper.vm.memberStepData).toStrictEqual({
      member_name: 'rick',
      member_id: 2234332,
      member_step_detail_date: '2024-01-01 ~ 2024-01-31'
    })
    expect(wrapper.vm.chartShow).toBeTruthy()
  })

  it('watch', async () => {
    await flushPromises()
    wrapper.vm.apiStart = 21
    expect(wrapper.vm.apiStart).toStrictEqual(21)
    expect(apiQueryActivityCompareDetail).toBeCalledTimes(1)

    activityStore.isChildDetailListFiltered = 88102
    await flushPromises()
    expect(wrapper.vm.apiStart).toStrictEqual(0)
    expect(apiQueryActivityCompareDetail).toBeCalledTimes(2)
  })
})
