import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import Overview from '@/views/ActivityAnalysisList/components/Overview.vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { sortTableDate } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import ActivityDetail from '@/views/ActivityAnalysisList/components/activityDetail/ActivityDetail.vue'

describe('Overview', () => {
  let wrapper = null
  let spyGet
  let spyDelete
  let globalStore
  let activityStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esx',
      hall_name: 'esx'
    }
    activityStore = useActivityAnalysisStore(pinia)

    vi.mock('@/utils/commonUtils.js', async () => {
      const actual = await vi.importActual('@/utils/commonUtils.js')
      const sortTableDate = vi.fn()

      return {
        ...actual,
        sortTableDate
      }
    })

    const result1 = {
      data: {
        result: [
          {
            id: 36,
            name: '新增驗證測試',
            created_time: '2025-02-04T02:41:51-04:00',
            can_operate: true,
            operator_name: 'tomtest'
          },
          {
            id: 31,
            name: '新增測試',
            created_time: '2025-02-04T02:41:51-04:00',
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
    spyGet.mockResolvedValue(result1)
    spyDelete.mockResolvedValue(result2)

    wrapper = shallowMount(Overview, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('components', async () => {
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmBox).exists()).toBe(true)
    expect(wrapper.findComponent(ActivityDetail).exists()).toBe(true)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
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
        createdTime: '2025/02/04 02:41:51',
        operator: 'tomtest'
      },
      {
        activityId: 31,
        activityName: '新增測試',
        canOperate: true,
        createdTime: '2025/02/04 02:41:51',
        operator: 'tomtest'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('openActivityDetail & closeDetail', () => {
    expect(wrapper.vm.showDetail).toBeFalsy()
    wrapper.vm.openActivityDetail()
    expect(wrapper.vm.showDetail).toBeTruthy()
    wrapper.vm.closeDetail()
    expect(wrapper.vm.showDetail).toBeFalsy()
  })

  it('openDeleteBox & cancelDelete & confirmDelete', async () => {
    expect(wrapper.vm.deleteBox).toBeFalsy()
    expect(wrapper.vm.deleteActivityName).toStrictEqual(null)
    expect(wrapper.vm.deleteId).toStrictEqual(null)

    wrapper.vm.openDeleteBox('yuyu activity', 22)
    expect(wrapper.vm.deleteBox).toBeTruthy()
    expect(wrapper.vm.deleteActivityName).toStrictEqual('yuyu activity')
    expect(wrapper.vm.deleteId).toStrictEqual(22)

    wrapper.vm.cancelDelete()
    expect(wrapper.vm.deleteBox).toBeFalsy()
    expect(wrapper.vm.deleteActivityName).toStrictEqual(null)
    expect(wrapper.vm.deleteId).toStrictEqual(null)

    expect(spyGet).toBeCalledTimes(1)

    wrapper.vm.openDeleteBox('yuyu activity', 22)
    expect(wrapper.vm.deleteBox).toBeTruthy()
    wrapper.vm.confirmDelete()
    await flushPromises()
    expect(spyDelete).toBeCalledTimes(1)
    expect(spyDelete).toBeCalledWith('/api/auth/activity/22', {
      params: {
        hall_name: 'esx'
      }
    })
    expect(spyGet).toBeCalledTimes(2)
    expect(wrapper.vm.deleteBox).toBeFalsy()
  })

  it('test upadteCurrentSort', () => {
    const sortParams = {
      order: 'descending',
      prop: 'createdTime',
      tableData: [
        {
          activityId: 36,
          activityName: '新增驗證測試',
          canOperate: true,
          createdTime: '2025/02/04 02:41:51',
          operator: 'tomtest'
        },
        {
          activityId: 31,
          activityName: '新增測試',
          canOperate: true,
          createdTime: '2025/02/04 02:41:51',
          operator: 'tomtest'
        }
      ]
    }

    wrapper.vm.upadteCurrentSort({ prop: 'createdTime', order: 'descending' })
    expect(sortTableDate).toHaveBeenCalledWith(sortParams)
  })

  it('test watch', async () => {
    expect(spyGet).toBeCalledTimes(1)
    activityStore.islistFiltered = 2
    await flushPromises()
    expect(spyGet).toBeCalledTimes(2)
    activityStore.activityChange = 2
    await flushPromises()
    expect(spyGet).toBeCalledTimes(3)
  })
})
