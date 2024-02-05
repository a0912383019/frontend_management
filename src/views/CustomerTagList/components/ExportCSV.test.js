import { it, describe, expect, afterEach, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { useGlobalStore } from '@/stores/global.js'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import ExportCSV from '@/views/CustomerTagList/components/ExportCSV.vue'
import router from '@/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/ExportReport.vue'

describe('ExportCSV', () => {
  let wrapper = null
  let assignMock

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    assignMock = vi.fn()

    delete window.location
    window.location = { assign: assignMock }

    wrapper = shallowMount(ExportCSV, {
      global: {
        plugins: [i18n, ElementPlus, router],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        total: 25,
        formData: {
          activatedDate: '2023-10-20 ~ 2023-11-19',
          customUserList: [],
          excludeTag: '',
          fuzzySearch: false,
          member: '',
          registerDate: '2023-08-20 ~ 2023-11-19',
          searchTag: '',
          selectAcount: '',
          selectLevel: 0
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    assignMock.mockClear()
  })

  it('expect components', () => {
    expect(wrapper.findComponent(ExportDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(true)
  })

  it('expect apiTotal', () => {
    expect(wrapper.vm.apiTotal).toBe(25)
  })

  it('handelExportReport', async () => {
    const result = {
      data: {
        result: {
          url: 'https://www.google.com.tw/'
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'post').mockResolvedValue(result)

    wrapper.vm.handelExportReport()

    expect(wrapper.vm.globalStore.isLoading).toBe(true)

    // 等待異步執行
    await flushPromises()

    // 驗證window.location.href
    expect(window.location.href).toBe('https://www.google.com.tw/')
  })
})
