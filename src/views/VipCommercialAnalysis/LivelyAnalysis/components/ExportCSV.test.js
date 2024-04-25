import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ExrpotCSV from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/ExportCSV.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'

describe('ExrpotCSV', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'esb'
    }

    const result1 = {
      data: {
        result: {
          url: 'https://www.google.com/'
        },
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    const result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'success',
          error_code: '210400000'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'post')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(ExrpotCSV, {
      global: {
        plugins: [i18n]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(ExportDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ExportReport).exists()).toBe(true)
  })

  it('handelExportReport', async () => {
    // 儲存原始的 window.location.href
    const originalHref = window.location.href

    // 創建 window.location 的模擬
    const mockLocation = { writable: true, value: originalHref }
    Object.defineProperty(global, 'window', { value: { location: mockLocation } })

    // 呼叫函數
    await wrapper.vm.handelExportReport()

    // 斷言 window.location.href 是否已經被更新
    expect(global.window.location.href).toBe('https://www.google.com/')

    // 還原 window.location.href 的原始值
    global.window.location.href = originalHref
  })
})
