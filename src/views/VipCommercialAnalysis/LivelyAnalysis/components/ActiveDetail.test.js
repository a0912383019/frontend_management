import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useVipCommercialAnalysisStore } from '@/stores'
import { dayjs } from 'element-plus'
import ElementPlus from 'element-plus'
import ActiveDetail from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/ActiveDetail.vue'

describe('ActiveDetail', () => {
  let wrapper = null

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const vipStore = useVipCommercialAnalysisStore(pinia)
    vipStore.livelyAnalysisFilter = {
      searchDate: '2024/01/20'
    }

    wrapper = shallowMount(ActiveDetail, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected endDate is correctly', () => {
    expect(wrapper.vm.endDate).toBe('2024-01-20')
  })

  it('handleOpenDialog', async () => {
    const user = {
      user_name: 'Kobe'
    }
    const paramsData = {
      user_name: 'Kobe',
      startDate: '2023-10-23',
      endDate: '2024-01-20'
    }
    wrapper.vm.endDate = '2024-01-20'
    await wrapper.vm.handleOpenDialog(user)
    expect(wrapper.vm.userName).toBe('Kobe')
    expect(wrapper.vm.paramsData).toStrictEqual(paramsData)
    expect(wrapper.vm.dialogVisible).toBeTruthy()
  })
})
