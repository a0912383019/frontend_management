import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import DayReport from '@/views/VipCommercialAnalysis/DayReport/DayReport.vue'
import Filter from '@/views/VipCommercialAnalysis/DayReport/components/Filter.vue'
import Report from '@/views/VipCommercialAnalysis/DayReport/components/Report.vue'

describe('DayReport', () => {
  let wrapper = null
  const queryDayReportMock = vi.fn()

  beforeEach(() => {
    wrapper = shallowMount(DayReport)
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
    wrapper.vm.$refs.refReport.queryDayReport = queryDayReportMock

    wrapper.vm.handleCallApi()

    // 驗證 queryDayReportMock 是否被呼叫過
    expect(queryDayReportMock).toHaveBeenCalled()
  })
})
