import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ExrpotCSV from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/ExportCSV.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import { ElNotification } from 'element-plus'
import { apiExportActivityCompareDetail } from '@/api'
import router from '@/router'

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')

  return {
    ...actual,
    ElNotification: vi.fn()
  }
})

vi.mock('@/api', () => ({
  apiExportActivityCompareDetail: vi.fn()
}))

describe('ExrpotCSV', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(ExrpotCSV, {
      global: {
        plugins: [i18n, router, createTestingPinia({ createSpy: vi.fn })]
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(ExportDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(true)
  })

  it('handelExportReport', async () => {
    apiExportActivityCompareDetail.mockResolvedValueOnce({
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
    wrapper.vm.handelExportReport()
    await flushPromises()
    expect(window.location.href).toEqual('https://www.google.com/')
  })

  it('handelExportReport', async () => {
    apiExportActivityCompareDetail.mockResolvedValueOnce({
      data: {
        status: {
          return_code: '0000',
          message: 'success',
          error_code: '210400020'
        }
      }
    })

    // 呼叫第二次
    wrapper.vm.handelExportReport()
    await flushPromises()
    expect(ElNotification).toHaveBeenCalledWith({
      title: '查無資料',
      type: 'warning'
    })
  })
})
