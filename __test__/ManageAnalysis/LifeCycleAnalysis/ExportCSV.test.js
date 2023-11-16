import { it, describe, expect, afterEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import router from '@/router'
import ExportCSV from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/components/ExportCSV.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/ExportReport.vue'

describe('ExportCSV', () => {
  let wrapper = null
  let assignMock

  afterEach(() => {
    wrapper.unmount()
    assignMock.mockClear()
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

    assignMock = vi.fn()

    delete window.location
    window.location = { assign: assignMock }

    wrapper = shallowMount(ExportCSV, {
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

    // 驗證組件是否存在
    expect(wrapper.findComponent(ExportDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(true)

    // 執行function
    wrapper.vm.handelExportReport()

    // 等待異步執行
    await flushPromises()

    // 驗證window.location.href
    expect(window.location.href).toBe('https://www.google.com.tw/')
  })
})
