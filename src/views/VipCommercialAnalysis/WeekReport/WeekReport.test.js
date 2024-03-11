import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import WeekReport from '@/views/VipCommercialAnalysis/WeekReport/WeekReport.vue'
import Filter from '@/views/VipCommercialAnalysis/WeekReport/components/Filter.vue'
import Report from '@/views/VipCommercialAnalysis/WeekReport/components/Report.vue'

describe('WeekReport', () => {
  let wrapper = null
  const queryWeekReport = vi.fn()

  beforeEach(() => {
    wrapper = shallowMount(WeekReport)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    // 驗證組件是否存在
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(Report).exists()).toBe(true)
  })

  it('Expected handleCallApi toHaveBeenCalled', () => {
    wrapper.vm.$refs.refReport.queryWeekReport = queryWeekReport

    wrapper.vm.handleCallApi()

    // 驗證 queryWeekReport 是否被呼叫過
    expect(queryWeekReport).toHaveBeenCalled()
  })
})
