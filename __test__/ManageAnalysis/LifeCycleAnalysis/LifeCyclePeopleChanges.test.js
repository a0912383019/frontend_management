import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { storeToRefs } from 'pinia'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'
import ElementPlus from 'element-plus'
import router from '@/router'
import LifeCycleAnalysis from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/LifeCyclePeopleChanges/LifeCyclePeopleChanges.vue'
import FilterMemberName from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/LifeCyclePeopleChanges/components/FilterMemberName.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import StepConfig from '@/components/StepConfig.vue'

describe('會員階段人數變化', () => {
  let wrapper = null
  let manageAnalysisStore = null
  let dateStore = null
  beforeEach(() => {
    wrapper = shallowMount(LifeCycleAnalysis, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    manageAnalysisStore = useManageAnalysisStore()
    dateStore = useDateStore()
  })
  afterEach(() => {
    wrapper.unmount()
    manageAnalysisStore = null
    dateStore = null
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})

  // api的資料
  const apiData = {
    total_people_num: 45079,
    step_data: [
      {
        total_num: 0,
        people_percent: '0',
        increase_num: 0,
        decrease_num: 0,
        step: 0
      },
      {
        total_num: 3725,
        people_percent: '8',
        increase_num: 39,
        decrease_num: 48,
        step: 1
      },
      {
        total_num: 268,
        people_percent: '1',
        increase_num: 23,
        decrease_num: 13,
        step: 2
      },
      {
        total_num: 10,
        people_percent: '0',
        increase_num: 10,
        decrease_num: 10,
        step: 3
      },
      {
        total_num: 237,
        people_percent: '1',
        increase_num: 31,
        decrease_num: 25,
        step: 4
      },
      {
        total_num: 275,
        people_percent: '1',
        increase_num: 16,
        decrease_num: 21,
        step: 5
      },
      {
        total_num: 2265,
        people_percent: '5',
        increase_num: 68,
        decrease_num: 88,
        step: 6
      },
      {
        total_num: 38299,
        people_percent: '85',
        increase_num: 57,
        decrease_num: 16,
        step: 7
      }
    ]
  }

  // 轉換後的資料
  const transformData = [
    {
      step_index: 1,
      total_num: {
        data: '3,725',
        id: '10',
        step: 1,
        detail: 0
      },
      people_percent: '8 %',
      diff_pre_day: {
        class: 'cdp-text-candypink',
        num: '-9'
      },
      increase_num: {
        data: '39',
        id: '11',
        step: 1,
        detail: 1
      },
      decrease_num: {
        data: '48',
        id: '12',
        step: 1,
        detail: 2
      }
    },
    {
      step_index: 2,
      total_num: {
        data: '268',
        id: '20',
        step: 2,
        detail: 0
      },
      people_percent: '1 %',
      diff_pre_day: {
        class: 'cdp-text-lightgreen',
        num: '+10'
      },
      increase_num: {
        data: '23',
        id: '21',
        step: 2,
        detail: 1
      },
      decrease_num: {
        data: '13',
        id: '22',
        step: 2,
        detail: 2
      }
    },
    {
      step_index: 3,
      total_num: {
        data: '10',
        id: '30',
        step: 3,
        detail: 0
      },
      people_percent: '0 %',
      diff_pre_day: {
        class: 'cdp-text-candypink',
        num: '0'
      },
      increase_num: {
        data: '10',
        id: '31',
        step: 3,
        detail: 1
      },
      decrease_num: {
        data: '10',
        id: '32',
        step: 3,
        detail: 2
      }
    },
    {
      step_index: 4,
      total_num: {
        data: '237',
        id: '40',
        step: 4,
        detail: 0
      },
      people_percent: '1 %',
      diff_pre_day: {
        class: 'cdp-text-lightgreen',
        num: '+6'
      },
      increase_num: {
        data: '31',
        id: '41',
        step: 4,
        detail: 1
      },
      decrease_num: {
        data: '25',
        id: '42',
        step: 4,
        detail: 2
      }
    },
    {
      step_index: 5,
      total_num: {
        data: '275',
        id: '50',
        step: 5,
        detail: 0
      },
      people_percent: '1 %',
      diff_pre_day: {
        class: 'cdp-text-candypink',
        num: '-5'
      },
      increase_num: {
        data: '16',
        id: '51',
        step: 5,
        detail: 1
      },
      decrease_num: {
        data: '21',
        id: '52',
        step: 5,
        detail: 2
      }
    },
    {
      step_index: 6,
      total_num: {
        data: '2,265',
        id: '60',
        step: 6,
        detail: 0
      },
      people_percent: '5 %',
      diff_pre_day: {
        class: 'cdp-text-candypink',
        num: '-20'
      },
      increase_num: {
        data: '68',
        id: '61',
        step: 6,
        detail: 1
      },
      decrease_num: {
        data: '88',
        id: '62',
        step: 6,
        detail: 2
      }
    },
    {
      step_index: 7,
      total_num: {
        data: '38,299',
        id: '70',
        step: 7,
        detail: 0
      },
      people_percent: '85 %',
      diff_pre_day: {
        class: 'cdp-text-lightgreen',
        num: '+41'
      },
      increase_num: {
        data: '57',
        id: '71',
        step: 7,
        detail: 1
      },
      decrease_num: {
        data: '16',
        id: '72',
        step: 7,
        detail: 2
      }
    }
  ]

  it('預設apiSuccess = false，預期渲染的元件', async () => {
    expect(wrapper.findComponent(FilterMemberName).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.findComponent(StepConfig).exists()).toBe(false)
  })

  it('測試 tooltip 時間是否符合預期', () => {
    // 設定日期時間
    const dateValue = {
      today: dayjs(dateStore.date_range_picker_config_4['startDate']).format('YYYY/MM/DD'),
      yesterday: dayjs(dateStore.date_range_picker_config_4['startDate'])
        .startOf('day')
        .subtract(1, 'day')
        .format('YYYY/MM/DD')
    }

    // 驗證是否符合預期
    expect(wrapper.vm.tooltipDate).toStrictEqual(dateValue)
  })

  it('測試 handleClick', () => {
    // 參數
    const dataValue = {
      data: '3,725',
      id: '10',
      step: 1,
      detail: 0
    }
    // 執行function
    wrapper.vm.handleClick(dataValue)

    //驗證是否符合預期
    expect(wrapper.vm.selectRow).toBe(dataValue.id)
    expect(manageAnalysisStore.stepType).toBe(dataValue.step)
    expect(manageAnalysisStore.detailType).toBe(dataValue.detail)
  })

  it('上傳使用手動匯入名單', () => {
    const { filterCustomUserList } = storeToRefs(manageAnalysisStore)
    // 使用者名單
    let csvData = ['junmoxian', 'fan8750f1', 'chgu47', 'zhoupangji', 'zhcwp', 'sjoy0930']

    // 設定使用者名單
    wrapper.vm.activeFile = csvData
    wrapper.vm.filterCustomUserList = csvData

    // 驗證是否符合預期
    expect(filterCustomUserList.value).toEqual(csvData)
  })

  it('語系轉換，tableColumns和轉換資料是否符合預期', () => {
    // 更換語系
    wrapper.vm.i18nLocale = 'en'
    wrapper.vm.apiTableResult = apiData
    wrapper.vm.transformLifeCycleAnalysisOverviewTbl(apiData)
    expect(wrapper.vm.tableData).toStrictEqual(transformData)

    // tableColumns
    const tableColumnsValue = wrapper.vm.tableColumns
    expect(tableColumnsValue).toStrictEqual([
      {
        label: 'Phase',
        prop: 'step_name',
        headerAlign: 'center',
        align: 'left',
        minWidth: '20%'
      },
      {
        label: 'As of Today',
        prop: 'total_num',
        headerAlign: 'center',
        align: 'center',
        minWidth: '16%'
      },
      {
        label: '% Total',
        prop: 'people_percent',
        headerAlign: 'center',
        align: 'center',
        minWidth: '16%'
      },
      {
        label: 'Difference from the previous day',
        prop: 'diff_pre_day',
        headerAlign: 'center',
        align: 'center',
        minWidth: '16%'
      },
      {
        label: 'Joining Today',
        prop: 'increase_num',
        headerAlign: 'center',
        align: 'center',
        minWidth: '16%'
      },
      {
        label: 'Leaving Today',
        prop: 'decrease_num',
        headerAlign: 'center',
        align: 'center',
        minWidth: '16%'
      }
    ])
  })

  it('觸發watch 與 mock api 是否如預期', async () => {
    //mock api 0000
    const result0 = {
      data: {
        result: {
          total_people_num: 45079,
          step_data: [
            {
              total_num: 0,
              people_percent: '0',
              increase_num: 0,
              decrease_num: 0,
              step: 0
            },
            {
              total_num: 3725,
              people_percent: '8',
              increase_num: 39,
              decrease_num: 48,
              step: 1
            },
            {
              total_num: 268,
              people_percent: '1',
              increase_num: 23,
              decrease_num: 13,
              step: 2
            },
            {
              total_num: 10,
              people_percent: '0',
              increase_num: 10,
              decrease_num: 10,
              step: 3
            },
            {
              total_num: 237,
              people_percent: '1',
              increase_num: 31,
              decrease_num: 25,
              step: 4
            },
            {
              total_num: 275,
              people_percent: '1',
              increase_num: 16,
              decrease_num: 21,
              step: 5
            },
            {
              total_num: 2265,
              people_percent: '5',
              increase_num: 68,
              decrease_num: 88,
              step: 6
            },
            {
              total_num: 38299,
              people_percent: '85',
              increase_num: 57,
              decrease_num: 16,
              step: 7
            }
          ]
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result0)
    //觸發updateTimestamp
    wrapper.vm.filterTimestamp = 12345
    //等待異步完成
    await flushPromises()
    expect(wrapper.vm.tableData).toStrictEqual(transformData)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)

    //mock api other
    const result2 = {
      data: {
        status: {
          return_code: '9999',
          message: 'fail'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result2)
    wrapper.vm.filterTimestamp = 22345
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.vm.messageKey).toBe('queryFailed')

    //mock error api 403
    const error403 = new Error('Forbidden')
    error403.response = {
      status: 403
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(error403)
    //觸發watch的fn
    wrapper.vm.filterTimestamp = 2323448
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.vm.messageKey).toBe('noPermission')

    //mock error api 401
    const error401 = new Error('error')
    error401.response = {
      status: 401
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(error401)
    //觸發watch的fn
    wrapper.vm.filterTimestamp = 2323449
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)

    //mock error api other
    const errorOther = new Error('error')
    errorOther.response = {
      status: 999
    }
    vi.spyOn(axiosGoInstance, 'post').mockRejectedValue(errorOther)
    //觸發watch的fn
    wrapper.vm.filterTimestamp = 2323450
    //等待異步完成
    await flushPromises()
    //預期轉換後的資料
    expect(wrapper.vm.tableData).toStrictEqual([])
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
    expect(wrapper.vm.messageKey).toBe('chartFailed')
  })

  it('切換廳主', () => {
    wrapper.vm.activeHall.hall_code = '15'
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.apiTableResult).toStrictEqual([])
  })
})
