import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import WeekTotalReport from '@/views/VipCommercialAnalysis/WeekTotalReport/WeekTotalReport.vue'
import Filter from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Filter.vue'
import Total from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Total.vue'
import Profit from '@/views/VipCommercialAnalysis/WeekTotalReport/components/Profit.vue'

describe('WeekTotalReport', () => {
  let wrapper = null
  const queryWeekTotalReport = vi.fn()
  const queryWeekProfitReport = vi.fn()

  beforeEach(() => {
    wrapper = shallowMount(WeekTotalReport)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    // 驗證組件是否存在
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(Total).exists()).toBe(true)
    expect(wrapper.findComponent(Profit).exists()).toBe(true)
  })

  it('Expected handleCallApi toHaveBeenCalled', () => {
    wrapper.vm.$refs.refTotal.queryWeekTotalReport = queryWeekTotalReport
    wrapper.vm.$refs.refProfit.queryWeekProfitReport = queryWeekProfitReport

    wrapper.vm.handleCallApi()

    // 驗證 queryWeekReport 是否被呼叫過
    expect(queryWeekTotalReport).toHaveBeenCalled()
    expect(queryWeekProfitReport).toHaveBeenCalled()
  })
})
