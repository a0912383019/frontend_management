import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import Overview from '@/views/ActivityAnalysisList/components/Overview.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('Overview', () => {
  let wrapper = null
  let spyGet
  let spyDelete
  let globalStore
  let activityStore
  // const date = new Date(2000, 1, 1, 13)
  // const hide = vi.fn()
  // let activityStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'esx'
    }
    activityStore = useActivityAnalysisStore(pinia)
    // vi.useFakeTimers()
    // vi.setSystemTime(date)
    const result1 = {
      data: {
        result: [
          {
            id: 36,
            name: '新增驗證測試',
            created_time: '2024-11-14T23:03:13-04:00',
            can_operate: true,
            operator_name: 'tomtest'
          },
          {
            id: 31,
            name: '新增測試',
            created_time: '2024-11-11T00:10:45-04:00',
            can_operate: true,
            operator_name: 'tomtest'
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
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyDelete = vi.spyOn(axiosGoInstance, 'delete')
    spyGet.mockResolvedValueOnce(result1)
    spyDelete.mockResolvedValueOnce(result2)

    wrapper = shallowMount(Overview, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })

    // wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    // vi.clearAllMocks()
    // vi.useRealTimers()
    wrapper.unmount()
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '活動名稱',
        minWidth: '40%',
        prop: 'activityName'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作者',
        minWidth: '20%',
        prop: 'operator'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '建立時間',
        minWidth: '20%',
        prop: 'createdTime',
        sortable: 'custom'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作',
        minWidth: '20%',
        prop: 'operation'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('test get api called correctly and func transformActivityList correctly', () => {
    // onMounted called
    expect(spyGet).toBeCalledTimes(1)
    const tableData = [
      {
        activityId: 36,
        activityName: '新增驗證測試',
        canOperate: true,
        createdTime: '2024/11/15 11:03:13',
        operator: 'tomtest'
      },
      {
        activityId: 31,
        activityName: '新增測試',
        canOperate: true,
        createdTime: '2024/11/11 12:10:45',
        operator: 'tomtest'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('')
  // // 測試 closePopover
  // it('closePopover', () => {
  //   wrapper.vm.closePopover()
  //   expect(hide).toHaveBeenCalledOnce()
  // })

  // it('handleClick', async () => {
  //   expect(wrapper.vm.searchActivity).toStrictEqual('')
  //   expect(activityStore.searchActivity).toStrictEqual('')
  //   expect(activityStore.islistFiltered).toStrictEqual(0)

  //   const searchActivity = 'Tom tom activity'
  //   wrapper.vm.searchActivity = searchActivity
  //   wrapper.vm.handleClick()
  //   expect(wrapper.vm.searchActivity).toStrictEqual(searchActivity)
  //   expect(activityStore.searchActivity).toStrictEqual(searchActivity)
  //   expect(activityStore.islistFiltered).toStrictEqual(date.getTime())
  //   expect(hide).toHaveBeenCalledOnce()
  // })
})
