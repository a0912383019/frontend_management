import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ExrpotCSV from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/ExportCSV.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
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

    wrapper.vm.handelExportReport()
    await flushPromises()

    expect(wrapper.vm.exportDialogVisible).toBe(true)
  })
})
