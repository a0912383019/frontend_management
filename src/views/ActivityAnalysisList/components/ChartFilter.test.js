import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import ChartFilter from '@/views/ActivityAnalysisList/components/ChartFilter.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import { apiQueryListActivity } from '@/api'
import { createRouterMock } from 'vue-router-mock'

vi.mock('@/api', () => ({
  apiQueryListActivity: vi.fn()
}))

describe('ChartFilter', () => {
  let wrapper = null
  let activityStore
  const date = new Date(2000, 1, 1, 13)
  const hide = vi.fn()
  const dateRestraintion = vi.fn()
  const transformChartParams = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })
    createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore()
    activityStore.filterData = {
      selectDuration: 'week',
      analysisDate: '',
      selectReward: 1,
      activityNameList: []
    }
    activityStore.dateRestraintion = dateRestraintion
    activityStore.transformChartParams = transformChartParams

    apiQueryListActivity.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: [
          {
            id: 74,
            name: 'tetete',
            created_time: '2025-02-12T05:29:54-04:00',
            can_operate: true,
            operator_name: 'BI-CDP-Yu_Lan'
          },
          {
            id: 73,
            name: 'arvin測試活動名稱-02031159',
            created_time: '2025-01-23T06:01:14-04:00',
            can_operate: true,
            operator_name: ''
          },
          {
            id: 72,
            name: 'noviatest0120-1',
            created_time: '2025-01-19T21:57:03-04:00',
            can_operate: true,
            operator_name: 'BI-CDP-Novia#3507'
          }
        ]
      }
    })

    wrapper = shallowMount(ChartFilter, {
      global: {
        plugins: [i18n, ElementPlus, router],
        stubs: {
          ElPopover: {
            template: '<div><slot /></div>'
          },
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          },
          ElForm: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('components', async () => {
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(DatepickerRange).exists()).toBe(true)
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(false)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(true)
  })

  it('variables', () => {
    expect(wrapper.vm.selectDurationOptions).toStrictEqual([
      {
        disabled: false,
        label: '週',
        value: 'week'
      },
      {
        disabled: false,
        label: '月',
        value: 'month'
      },
      {
        disabled: false,
        label: '季',
        value: 'season'
      },
      {
        disabled: false,
        label: '年',
        value: 'year'
      }
    ])
    expect(wrapper.vm.selectRewardOptions).toStrictEqual([
      {
        label: '領獎',
        value: 1
      },
      {
        label: '未領獎',
        value: 0
      }
    ])
  })

  it('api correctly & handleSubmitClick & closePopover', async () => {
    await flushPromises()
    // api called by onMounted
    expect(apiQueryListActivity).toHaveBeenCalledOnce()
    expect(hide).toHaveBeenCalledOnce()
    expect(activityStore.filterData).toStrictEqual({
      selectDuration: 'week',
      analysisDate: '',
      selectReward: 1,
      activityNameList: [74, 73, 72]
    })
    expect(wrapper.vm.selectActivityNameOptions).toStrictEqual([
      {
        label: 'tetete',
        value: 74
      },
      {
        label: 'arvin測試活動名稱-02031159',
        value: 73
      },
      {
        label: 'noviatest0120-1',
        value: 72
      }
    ])

    // handleSubmitClick called by api
    expect(wrapper.vm.popoverVisible).toBeFalsy()
    expect(transformChartParams).toBeCalledTimes(1)
    expect(activityStore.chartFiltered).toStrictEqual(date.getTime())

    // closePopover
    expect(hide).toHaveBeenCalledOnce()
  })

  it('handleCheckAll', async () => {
    await flushPromises()
    wrapper.vm.indeterminate = true
    expect(wrapper.vm.indeterminate).toBeTruthy()
    expect(activityStore.filterData.activityNameList).toStrictEqual([74, 73, 72])
    wrapper.vm.handleCheckAll(false)
    expect(wrapper.vm.indeterminate).toBeFalsy()
    expect(activityStore.filterData.activityNameList).toStrictEqual([])
  })

  it('watch', async () => {
    await flushPromises()
    expect(apiQueryListActivity).toBeCalledTimes(1)

    activityStore.activityChange = 2
    await flushPromises()
    expect(apiQueryListActivity).toBeCalledTimes(2)

    expect(wrapper.vm.checkAll).toBeTruthy()
    expect(wrapper.vm.indeterminate).toBeFalsy()
    activityStore.filterData.activityNameList = [11]
    await flushPromises()
    expect(wrapper.vm.indeterminate).toBeTruthy()
  })
})
