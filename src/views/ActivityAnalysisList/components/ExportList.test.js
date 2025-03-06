import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ExportList from '@/views/ActivityAnalysisList/components/ExportList.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import ElementPlus from 'element-plus'
import { apiQueryListActivity, apiExportActivityGrowthReport } from '@/api'
import { createRouterMock } from 'vue-router-mock'

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')

  return {
    ...actual,
    ElNotification: vi.fn()
  }
})

vi.mock('@/api', () => ({
  apiQueryListActivity: vi.fn(),
  apiExportActivityGrowthReport: vi.fn()
}))

describe('ExportList', () => {
  let wrapper = null

  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })

    apiQueryListActivity.mockResolvedValueOnce({
      data: {
        result: [
          {
            id: 80,
            name: 'vvv',
            created_time: '2025-02-27T01:42:08-04:00',
            can_operate: true,
            operator_name: 'BI-CDP-Yu_Lan'
          },
          {
            id: 79,
            name: 'test活動',
            created_time: '2025-02-24T04:24:54-04:00',
            can_operate: true,
            operator_name: 'BI-CDP-Novia#3507'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    })

    wrapper = shallowMount(ExportList, {
      global: {
        plugins: [i18n, ElementPlus, router, createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          },
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    await flushPromises()
    expect(wrapper.findComponent(ExportDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(DatepickerRange).exists()).toBe(true)
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(true)
    expect(wrapper.findComponent(ButtonIcon).exists()).toBe(true)

    wrapper.vm.apiSuccess = true
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(LoadingBox).exists()).toBe(false)
  })

  it('selectDurationOptions & selectRewardOptions', () => {
    const selectDurationOptions = [
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
    ]
    expect(wrapper.vm.selectDurationOptions).toStrictEqual(selectDurationOptions)

    const selectRewardOptions = [
      {
        label: '領獎',
        value: 1
      },
      {
        label: '未領獎',
        value: 0
      }
    ]
    expect(wrapper.vm.selectRewardOptions).toStrictEqual(selectRewardOptions)
  })

  it('handleOpenDialog', async () => {
    expect(wrapper.vm.activityStore.chartFiltered).toBe(0)
    wrapper.vm.handleOpenDialog()
    await flushPromises()

    const selectActivityNameOptions = [
      {
        label: 'vvv',
        value: 80
      },
      {
        label: 'test活動',
        value: 79
      }
    ]
    expect(wrapper.vm.apiSuccess).toBeTruthy()
    expect(wrapper.vm.selectActivityNameOptions).toStrictEqual(selectActivityNameOptions)
    expect(wrapper.vm.exportData.activityNameList).toStrictEqual([80, 79])
  })

  it('handleCloseDialog', () => {
    const filterData = {
      selectDuration: 'month',
      analysisDate: '2011-01-01 ~ 2022-01-01',
      selectReward: 1,
      activityNameList: [17, 28]
    }
    wrapper.vm.activityStore.filterData = filterData
    wrapper.vm.handleCloseDialog()
    expect(wrapper.vm.exportData).toStrictEqual(filterData)
  })

  it('handleCheckAll & isExportDisabled', () => {
    wrapper.vm.selectActivityNameOptions = [
      {
        label: 'vvv',
        value: 80
      },
      {
        label: 'test活動',
        value: 79
      }
    ]
    expect(wrapper.vm.indeterminate).toBeFalsy()
    wrapper.vm.handleCheckAll(true)
    expect(wrapper.vm.exportData.activityNameList).toStrictEqual([80, 79])
    expect(wrapper.vm.isExportDisabled).toBeFalsy()

    wrapper.vm.handleCheckAll(false)
    expect(wrapper.vm.exportData.activityNameList).toStrictEqual([])
    expect(wrapper.vm.isExportDisabled).toBeTruthy()
  })

  it('handelExportList', async () => {
    const filterData = {
      selectDuration: 'month',
      analysisDate: '2011-01-01 ~ 2022-01-01',
      selectReward: 1,
      activityNameList: [17, 28]
    }
    wrapper.vm.activityStore.filterData = filterData
    wrapper.vm.handleCloseDialog()

    wrapper.vm.dialogVisible = true
    expect(wrapper.vm.dialogVisible).toBeTruthy()
    apiExportActivityGrowthReport.mockResolvedValueOnce({
      data: {
        result: {
          url: 'https://www.google.com/'
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    })

    const url = 'http://dummy.com/'
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    })
    // 呼叫第一次
    wrapper.vm.handelExportList()
    await flushPromises()
    expect(window.location.href).toEqual('https://www.google.com/')
    expect(wrapper.vm.dialogVisible).toBeFalsy()
  })
})
