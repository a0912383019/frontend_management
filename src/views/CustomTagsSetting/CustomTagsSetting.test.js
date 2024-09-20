import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { useGlobalStore, useSystemStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import CustomTagsSetting from '@/views/CustomTagsSetting/CustomTagsSetting.vue'
import * as module from '@/utils/commonUtils.js'

describe('CustomTagsSetting.vue', () => {
  let wrapper = null
  let spyGet
  let spyPut
  let spyDelete
  const sortByFather = vi.fn()
  const storeGetSystemConfig = vi.fn()

  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  const systemStore = useSystemStore(pinia)

  beforeEach(() => {
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'Esball'
    }
    // globalStore.isLoading = false
    systemStore.storeGetSystemConfig = storeGetSystemConfig

    vi.spyOn(module, 'getSessionStorageEntity').mockImplementation(vi.fn())
    module.getSessionStorageEntity.mockReturnValue({
      tags_config: {
        esb: {
          30406: {
            tag_type: 1,
            tag_description: '人工定義為高價值會員',
            tag_name: '水水tag',
            tag_enabled: 1
          },
          40003: {
            tag_type: 3,
            tag_description: '近15個實動日，當日贏後下次會賭更大會員',
            tag_name: '混混tag',
            tag_enabled: 1
          }
        }
      }
    })

    let result1 = {
      data: {
        result: [
          {
            row_count: 4,
            status: 2,
            tag_code: 30406,
            updated_time: '2024-09-19 04:55:10'
          },
          {
            row_count: 8,
            status: 2,
            tag_code: 40003,
            updated_time: '2024-09-02 00:35:05'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    let result2 = {
      data: {
        status: {
          message: 'success',
          return_code: '0000'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result1)
    spyPut = vi.spyOn(axiosGoInstance, 'put').mockResolvedValue(result2)
    spyDelete = vi.spyOn(axiosGoInstance, 'delete').mockResolvedValue(result2)

    wrapper = shallowMount(CustomTagsSetting, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })
    wrapper.vm.$refs.tableRef.sortByFather = sortByFather
  })

  afterEach(() => {
    wrapper.unmount()
    sortByFather.mockClear()
  })

  it('test tableColumns', () => {
    const expectTableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '標籤名稱',
        minWidth: '14%',
        prop: 'tag_name'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '總人數',
        minWidth: '9%',
        prop: 'total_people_num',
        sortable: true
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '狀態',
        minWidth: '8%',
        prop: 'status'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '更新時間',
        minWidth: '15%',
        prop: 'updated_time',
        sortable: true
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '啟用 / 停用',
        minWidth: '10%',
        prop: 'enabled_and_disabled'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '管理',
        minWidth: '23%',
        prop: 'manage'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作',
        minWidth: '21%',
        prop: 'operation'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(expectTableColumns)
  })

  it('test queryListCustomTagsSetting & transformCustomTagData', async () => {
    const expectTableData = [
      {
        enabled_and_disabled: 1,
        status: 2,
        tag_code: 30406,
        tag_description: '人工定義為高價值會員',
        tag_name: '水水tag',
        total_people_num: 4,
        updated_time: '2024/09/19 04:55:10'
      },
      {
        enabled_and_disabled: 1,
        status: 2,
        tag_code: 40003,
        tag_description: '近15個實動日，當日贏後下次會賭更大會員',
        tag_name: '混混tag',
        total_people_num: 8,
        updated_time: '2024/09/02 00:35:05'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(expectTableData)
    expect(spyGet).toBeCalledTimes(1)
    expect(spyGet).toHaveBeenCalledWith('/api/auth/member_custom_tags', {
      params: {
        hall_name: 'esb'
      }
    })
    expect(sortByFather).toBeCalledTimes(1)
  })

  it('test updateTagConfig & reloadPage', async () => {
    expect(storeGetSystemConfig).toBeCalledTimes(0)
    // onMounted 第一次
    expect(spyGet).toBeCalledTimes(1)

    const enabled = true
    const tagCode = 30001
    wrapper.vm.updateTagConfig(enabled, tagCode)
    await flushPromises()
    expect(spyPut).toBeCalledTimes(1)
    expect(spyPut).toHaveBeenCalledWith(`/api/auth/member_custom_tags/${tagCode}`, {
      hall_name: 'esb',
      enabled
    })
    expect(storeGetSystemConfig).toBeCalledTimes(1)
    expect(spyGet).toBeCalledTimes(2)
  })

  const data = {
    tag_code: 30001,
    tag_name: 'duedue',
    tag_description: 'test duedue'
  }

  it('openDetail & closeDetail with initTagDetail', () => {
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagDescription).toStrictEqual('')
    expect(wrapper.vm.tagDetailOpen).toBeFalsy()

    wrapper.vm.openDetail(data)
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('30001')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('duedue')
    expect(wrapper.vm.tagDetail.tagDescription).toStrictEqual('test duedue')
    expect(wrapper.vm.tagDetailOpen).toBeTruthy()

    wrapper.vm.closeDetail()
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagDescription).toStrictEqual('')
    expect(wrapper.vm.tagDetailOpen).toBeFalsy()
  })

  it('openHistory & closeHistory with initTagDetail', () => {
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagDescription).toStrictEqual('')
    expect(wrapper.vm.tagHistoryOpen).toBeFalsy()

    wrapper.vm.openHistory(data)
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('30001')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('duedue')
    expect(wrapper.vm.tagHistoryOpen).toBeTruthy()

    wrapper.vm.closeHistory()
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('')
    expect(wrapper.vm.tagHistoryOpen).toBeFalsy()
  })

  it('test storeSortData', () => {
    expect(wrapper.vm.sortData).toStrictEqual(null)

    wrapper.vm.storeSortData('date')
    expect(wrapper.vm.sortData).toStrictEqual('date')
  })

  it('test openImportCsv & closeImportCsv', () => {
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.importCsvBox).toBeFalsy()

    wrapper.vm.openImportCsv(data)
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('30001')
    expect(wrapper.vm.importCsvBox).toBeTruthy()

    wrapper.vm.closeImportCsv()
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.importCsvBox).toBeFalsy()
  })

  it('test openDeleteBox & closeDelete', () => {
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('')
    expect(wrapper.vm.deleteBox).toBeFalsy()

    wrapper.vm.openDeleteBox(data)
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('30001')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('duedue')
    expect(wrapper.vm.deleteBox).toBeTruthy()

    wrapper.vm.closeDelete()
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('')
    expect(wrapper.vm.tagDetail.tagName).toStrictEqual('')
    expect(wrapper.vm.deleteBox).toBeFalsy()
  })

  it('test confirmDelete & deleteCustomTags', async () => {
    expect(spyDelete).toBeCalledTimes(0)
    wrapper.vm.tagDetail.tagCode = '30001'
    expect(wrapper.vm.tagDetail.tagCode).toStrictEqual('30001')

    wrapper.vm.confirmDelete()
    await flushPromises()
    expect(spyDelete).toBeCalledTimes(1)
    expect(spyDelete).toHaveBeenCalledWith('/api/auth/member_custom_tags/30001', {
      params: {
        hall_name: 'esb'
      }
    })
  })
})
