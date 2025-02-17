import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import Filter from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/detailList/Filter.vue'
import { createTestingPinia } from '@pinia/testing'

describe('Filter', () => {
  let wrapper = null
  const date = new Date(2000, 1, 1, 13)
  const hide = vi.fn()
  let activityStore

  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore()

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

  it('handleClick', () => {
    wrapper.vm.handleClick()
    expect(activityStore.isChildDetailListFiltered).toStrictEqual(date.getTime())
    expect(hide).toHaveBeenCalledOnce()
  })
})
