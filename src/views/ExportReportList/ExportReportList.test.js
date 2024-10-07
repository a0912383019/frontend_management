import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ExportReportList from '@/views/ExportReportList/ExportReportList.vue'
import { useGlobalStore, useExportListStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { createTestingPinia } from '@pinia/testing'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import DeleteBox from '@/views/ExportReportList/components/DeleteBox.vue'
import SearchDetailBox from '@/views/ExportReportList/components/SearchDetailBox.vue'

describe('ExportReportList.vue', () => {
  let wrapper = null
  let spyGet
  const storeApiSpy = vi.fn()
  let globalStore
  let exportListStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    globalStore = useGlobalStore(pinia)
    globalStore.systemConfigIsOk = 0
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'Esball'
    }

    exportListStore = useExportListStore(pinia)
    exportListStore.tag_description_dict = { hall: {} }
    exportListStore.queryAgNameUserLevel = storeApiSpy

    vi.mock('@/utils/commonUtils.js', async () => {
      const actual = await vi.importActual('@/utils/commonUtils.js')
      const getSessionStorageEntity = vi.fn()
      getSessionStorageEntity.mockReturnValue({
        tags_config: {
          10001: {
            tag_type: 1,
            tag_description: '人工定義為高價值會員'
          }
        }
      })

      return {
        ...actual,
        getSessionStorageEntity
      }
    })

    let result = {
      data: {
        result: [
          {
            created_time: '2024-04-17 23:26:00',
            export_download_link: 'https://fake.link',
            export_progress: true,
            is_expired: false,
            search_content:
              '{"report_date":"2024-04-17","vip_tag":[10001,10003],"locale":"zh-TW","user_id":249}',
            type: 4
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValue(result)

    wrapper = shallowMount(ExportReportList, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('expect onMounted & watch systemConfigIsOk correctly', async () => {
    expect(exportListStore.tag_description_dict.hall).toStrictEqual({
      10001: {
        tag_description: '人工定義為高價值會員',
        tag_type: 1
      }
    })
    expect(storeApiSpy).toHaveBeenCalledTimes(1)
    expect(spyGet).toHaveBeenCalledOnce()

    globalStore.systemConfigIsOk = 1
    await wrapper.vm.$nextTick()
    expect(storeApiSpy).toHaveBeenCalledTimes(2)
  })

  it('test components exists', async () => {
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(SearchDetailBox).exists()).toBe(true)
    expect(wrapper.findComponent(DeleteBox).exists()).toBe(true)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(CustomTable).exists()).toBe(false)
  })

  it('test tableColumns & allLinkList & tableData correctly', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '來源頁面',
        minWidth: '15%',
        prop: 'source_page'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '匯出日期',
        minWidth: '21%',
        prop: 'export_date',
        sortable: true
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '詳細資料',
        minWidth: '19%',
        prop: 'detail'
      },
      {
        align: 'left',
        headerAlign: 'center',
        label: '狀態',
        minWidth: '15%',
        prop: 'status',
        sortable: true
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '下載連結',
        minWidth: '15%',
        prop: 'download_link'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '操作',
        minWidth: '15%',
        prop: 'operation'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
    expect(spyGet).toHaveBeenCalledOnce()
    expect(spyGet).toHaveBeenCalledWith(
      '/api/auth/export_report/user_export_list',
      expect.any(Object)
    )
    expect(wrapper.vm.allLinkList).toStrictEqual(['https://fake.link'])

    const tableData = [
      {
        created_time: '2024-04-17 23:26:00',
        export_date: '2024/04/17 23:26:00',
        export_download_link: 'https://fake.link',
        export_progress: true,
        is_disabled: false,
        is_expired: false,
        search_content:
          '{"report_date":"2024-04-17","vip_tag":[10001,10003],"locale":"zh-TW","user_id":249}',
        source_page: 'sidebar.bbin_vip_commercial_analysis',
        status: 'completed',
        type: 4
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
  })

  it('test getSourceName', () => {
    expect(wrapper.vm.getSourceName(1)).toStrictEqual('sidebar.bbin_manage_analysis')
    expect(wrapper.vm.getSourceName(2)).toStrictEqual('sidebar.bbin_customer_tag_list')
    expect(wrapper.vm.getSourceName(3)).toStrictEqual('sidebar.bbin_vip_commercial_analysis')
    expect(wrapper.vm.getSourceName(6)).toStrictEqual('sidebar.bbin_offer_analysis_list')
    expect(wrapper.vm.getSourceName(8)).toStrictEqual('sidebar.activity_analysis_list')
  })

  it('test upadteCurrentSort', async () => {
    const originData = [
      {
        export_date: '2024/04/17 10:11:00',
        export_download_link: 'https://fake.link.a'
      },
      {
        export_date: '2024/04/12 23:26:00',
        export_download_link: 'https://fake.link.b'
      },
      {
        export_date: '2024/04/15 18:45:00',
        export_download_link: 'https://fake.link.c'
      }
    ]
    wrapper.vm.tableData = originData
    wrapper.vm.beforeSort = originData

    await wrapper.vm.upadteCurrentSort({ prop: 'export_date', order: 'descending' })
    const descTableData = [
      {
        export_date: '2024/04/17 10:11:00',
        export_download_link: 'https://fake.link.a'
      },
      {
        export_date: '2024/04/15 18:45:00',
        export_download_link: 'https://fake.link.c'
      },
      {
        export_date: '2024/04/12 23:26:00',
        export_download_link: 'https://fake.link.b'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(descTableData)

    await wrapper.vm.upadteCurrentSort({ prop: 'export_date', order: 'ascending' })
    const ascTableData = [
      {
        export_date: '2024/04/12 23:26:00',
        export_download_link: 'https://fake.link.b'
      },
      {
        export_date: '2024/04/15 18:45:00',
        export_download_link: 'https://fake.link.c'
      },
      {
        export_date: '2024/04/17 10:11:00',
        export_download_link: 'https://fake.link.a'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(ascTableData)

    await wrapper.vm.upadteCurrentSort({ prop: 'export_date', order: '' })
    expect(wrapper.vm.tableData).toStrictEqual(originData)
  })

  it('test window open', async () => {
    global.open = vi.fn()

    wrapper.vm.downloadReport('https://fake.link')
    await wrapper.vm.$nextTick()
    expect(window.open).toBeCalled()
    expect(window.open).toHaveBeenCalledWith('https://fake.link', '_blank')
  })

  it('test opendetail & detailBoxClose', () => {
    expect(wrapper.vm.detailBoxVisible).toBeFalsy()
    expect(wrapper.vm.reportDetail).toStrictEqual({
      type: 0,
      source: '',
      content: {}
    })

    wrapper.vm.opendetail({
      search_content:
        '{"report_date":"2024-04-17","vip_tag":[10001,10003],"locale":"zh-TW","user_id":249}',
      source_page: 'sidebar.bbin_vip_commercial_analysis',
      status: 'completed',
      type: 4
    })
    expect(wrapper.vm.detailBoxVisible).toBeTruthy()
    expect(wrapper.vm.reportDetail).toStrictEqual({
      content: {
        locale: 'zh-TW',
        report_date: '2024-04-17',
        user_id: 249,
        vip_tag: [10001, 10003]
      },
      source: 'sidebar.bbin_vip_commercial_analysis',
      type: 4
    })

    wrapper.vm.detailBoxClose()
    expect(wrapper.vm.detailBoxVisible).toBeFalsy()
  })

  it('test delete info functions', () => {
    expect(spyGet).toHaveBeenCalledOnce()

    expect(wrapper.vm.confirmBoxVisible).toBeFalsy()
    expect(wrapper.vm.confirmBoxTopVisible).toBeFalsy()
    expect(wrapper.vm.deleteLinkList).toStrictEqual([])
    expect(wrapper.vm.confirmInfo).toStrictEqual({
      sourcePage: '',
      exportDate: ''
    })

    wrapper.vm.confirmDelete({
      created_time: '2024-04-17 23:26:00',
      export_download_link: 'https://fake.link',
      type: 4
    })
    expect(wrapper.vm.confirmBoxVisible).toBeTruthy()
    expect(wrapper.vm.confirmBoxTopVisible).toBeFalsy()
    expect(wrapper.vm.deleteLinkList).toStrictEqual(['https://fake.link'])
    expect(wrapper.vm.confirmInfo).toStrictEqual({
      exportDate: '2024/04/17 23:26:00',
      sourcePage: 'sidebar.bbin_vip_commercial_analysis'
    })

    const linkList = ['https://fake.link.a', 'https://fake.link.b']
    wrapper.vm.allLinkList = linkList
    wrapper.vm.confirmDeleteAll()
    expect(wrapper.vm.deleteLinkList).toStrictEqual(linkList)
    expect(wrapper.vm.confirmBoxTopVisible).toBeTruthy()

    wrapper.vm.deleteSuccess()
    expect(spyGet).toHaveBeenCalledTimes(2)

    wrapper.vm.deleteBoxClose()
    expect(wrapper.vm.confirmBoxVisible).toBeFalsy()
    expect(wrapper.vm.confirmBoxTopVisible).toBeFalsy()
  })
})
