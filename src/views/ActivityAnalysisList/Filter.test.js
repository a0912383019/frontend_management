import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import Filter from '@/views/ActivityAnalysisList/Filter.vue'

describe('Filter', () => {
  let wrapper = null
  const date = new Date(2000, 1, 1, 13)
  const hide = vi.fn()
  let activityStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore(pinia)

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
    expect(wrapper.vm.searchActivity).toStrictEqual('')
    expect(activityStore.searchActivity).toStrictEqual('')
    expect(activityStore.islistFiltered).toStrictEqual(0)

    const searchActivity = 'Tom tom activity'
    wrapper.vm.searchActivity = searchActivity
    wrapper.vm.handleClick()
    expect(wrapper.vm.searchActivity).toStrictEqual(searchActivity)
    expect(activityStore.searchActivity).toStrictEqual(searchActivity)
    expect(activityStore.islistFiltered).toStrictEqual(date.getTime())
    expect(hide).toHaveBeenCalledOnce()
  })
})
