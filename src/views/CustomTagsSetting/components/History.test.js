import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import History from '@/views/CustomTagsSetting/components/History.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('History', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    useGlobalStore(pinia)

    const result1 = {
      result: {
        data: [
          {
            file_name: '20240902123035_233.csv',
            file_path: 'upload/CDP/dev/custom_tag/BBIN/esx/20240902/',
            add_count: null,
            remove_count: null,
            status: 2,
            member_id: 233,
            member_name: 'BI-CDP-Toto',
            updated_time: '2024-09-02 00:35:06'
          },
          {
            file_name: 'example_file.txt',
            file_path: '/path/to/file',
            add_count: 50,
            remove_count: 10,
            status: 1,
            member_id: 246,
            member_name: 'BI-CDP-Toto',
            updated_time: '2024-08-21 21:41:41'
          }
        ],
        records_total: 2
      },
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    const result2 = {
      result: 'https://example.link.com',
      status: {
        return_code: '0000',
        message: 'success'
      }
    }

    let propsTagCode = '50001'
    spyGet = vi.spyOn(axiosGoInstance, 'get').mockImplementation((url) => {
      switch (url) {
        case `/api/auth/member_custom_tags/${propsTagCode}/logs`:
          return Promise.resolve({ data: result1 })
        case `/api/auth/member_custom_tags/${propsTagCode}/logs/download_link`:
          return Promise.resolve({ data: result2 })
      }
    })

    wrapper = shallowMount(History, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          ElDialog: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        modelValue: true,
        tagCode: propsTagCode,
        tagName: 'test tag'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(CustomTable).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '檔案',
        minWidth: '21%',
        prop: 'file'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '更新時間',
        minWidth: '20%',
        prop: 'updated_time'
      },
      {
        align: 'center',
        colClass: 'break-work',
        headerAlign: 'center',
        label: '操作者',
        minWidth: '20%',
        prop: 'operator'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '新增人數',
        minWidth: '12%',
        prop: 'add_member_num'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '刪除人數',
        minWidth: '12%',
        prop: 'delete_member_num'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '狀態',
        minWidth: '15%',
        prop: 'status'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('handleDialogOpen & updateCurrentPage', async () => {
    expect(wrapper.vm.apiDraw).toStrictEqual(1)
    expect(wrapper.vm.apiStart).toStrictEqual(0)

    wrapper.vm.handleDialogOpen()
    await flushPromises()
    expect(spyGet).toBeCalledTimes(1)
    expect(spyGet).toBeCalledWith(`/api/auth/member_custom_tags/${wrapper.props('tagCode')}/logs`, {
      params: {
        hall_name: '',
        length: 10,
        start: 0
      }
    })
    const tableData = [
      {
        add_member_num: '-',
        delete_member_num: '-',
        file: '20240902123035_233.csv',
        operator: 'BI-CDP-Toto',
        status: 2,
        updated_time: '2024/09/02 00:35:06'
      },
      {
        add_member_num: 50,
        delete_member_num: 10,
        file: 'example_file.txt',
        operator: 'BI-CDP-Toto',
        status: 1,
        updated_time: '2024/08/21 21:41:41'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
    expect(wrapper.vm.apiRecordsTotal).toStrictEqual(2)

    wrapper.vm.updateCurrentPage(2)
    await flushPromises()
    expect(wrapper.vm.apiDraw).toStrictEqual(2)
    expect(wrapper.vm.apiStart).toStrictEqual(10)
    expect(spyGet).toBeCalledTimes(2)
    expect(spyGet).toBeCalledWith(`/api/auth/member_custom_tags/${wrapper.props('tagCode')}/logs`, {
      params: {
        hall_name: '',
        length: 10,
        start: 10
      }
    })
  })

  it('handleDialogClosed', () => {
    wrapper.vm.apiStart = 10
    expect(wrapper.vm.apiStart).toStrictEqual(10)
    expect(wrapper.emitted('closeHistory')).toBeFalsy()

    wrapper.vm.handleDialogClosed()
    expect(wrapper.vm.apiStart).toStrictEqual(0)
    expect(wrapper.emitted('closeHistory')).toBeTruthy()
  })

  it('queryDownloadHistoryFile & downloadFile', async () => {
    // 模擬 document.createElement 和 document.body.appendChild 行為
    const link = document.createElement('a')
    const appendChildMock = vi.spyOn(document.body, 'appendChild')
    const removeChildMock = vi.spyOn(document.body, 'removeChild')

    // 模擬 link 元素和 click 行為
    const clickMock = vi.fn()
    link.click = clickMock
    vi.spyOn(document, 'createElement').mockImplementation(() => link)

    const fileName = '4040404.csv'
    wrapper.vm.queryDownloadHistoryFile(fileName)
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(spyGet).toBeCalledWith(
      `/api/auth/member_custom_tags/${wrapper.props('tagCode')}/logs/download_link`,
      {
        params: {
          file_name: '4040404.csv',
          hall_name: ''
        }
      }
    )

    // downloadFile 被呼叫
    expect(link.href).toBe('https://example.link.com/')
    expect(link.style.display).toBe('none')
    expect(appendChildMock).toHaveBeenCalledWith(link)
    expect(clickMock).toHaveBeenCalled()
    expect(removeChildMock).toHaveBeenCalledWith(link)

    // 恢復模擬行為
    appendChildMock.mockRestore()
    removeChildMock.mockRestore()
  })
})
