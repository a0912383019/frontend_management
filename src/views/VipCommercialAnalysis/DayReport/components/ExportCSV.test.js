import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import ExrpotCSV from '@/views/VipCommercialAnalysis/DayReport/components/ExportCSV.vue'
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

    const result = {
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

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result)

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
    // 呼叫函數
    await wrapper.vm.handelExportReport()

    expect(wrapper.vm.exportDialogVisible).toBe(true)
  })
})
