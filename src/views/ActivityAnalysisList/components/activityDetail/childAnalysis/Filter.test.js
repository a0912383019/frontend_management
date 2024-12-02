import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import Filter from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/Filter.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('Filter', () => {
  let wrapper = null
  const date = new Date(2000, 1, 1, 13)
  const hide = vi.fn()
  const findSelectedOption = vi.fn()
  let activityStore

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('@/stores/activityAnalysis.js', () => ({
      useActivityAnalysisStore: vi.fn()
    }))
    const mockActivityAnalysis = {
      findSelectedOption: findSelectedOption,
      isChildFiltered: 0
    }
    useActivityAnalysisStore.mockReturnValue(mockActivityAnalysis)

    vi.useFakeTimers()
    vi.setSystemTime(date)

    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })

    wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    wrapper.unmount()
  })

  // 測試 closePopover
  it('closePopover', () => {
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalledOnce()
  })

  it('handleClick', async () => {
    activityStore = useActivityAnalysisStore()
    wrapper.vm.handleClick()
    expect(findSelectedOption).toHaveBeenCalledOnce()
    expect(activityStore.isChildFiltered).toStrictEqual(date.getTime())
    expect(hide).toHaveBeenCalledOnce()
  })
})
