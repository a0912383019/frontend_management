import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LivelyAnalysis from '@/views/VipCommercialAnalysis/LivelyAnalysis/LivelyAnalysis.vue'
import Filter from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Filter.vue'
import Overview from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Overview.vue'
import Detail from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/Detail.vue'

describe('LivelyAnalysis', () => {
  let wrapper = null
  const queryLivelyAnalysisOverview = vi.fn()
  const queryMemberLivelyList = vi.fn()

  beforeEach(() => {
    wrapper = shallowMount(LivelyAnalysis)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    // 驗證組件是否存在
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(Overview).exists()).toBe(true)
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
  })

  it('Expected handleCallApi toHaveBeenCalled', () => {
    wrapper.vm.$refs.refOverview.queryLivelyAnalysisOverview = queryLivelyAnalysisOverview

    wrapper.vm.handleCallApi()

    // 驗證 queryLivelyAnalysisOverview 是否被呼叫過
    expect(queryLivelyAnalysisOverview).toHaveBeenCalled()
  })

  it('Expected handleCallApi handleCallDetailApi', () => {
    wrapper.vm.$refs.refDetail.queryMemberLivelyList = queryMemberLivelyList

    wrapper.vm.handleCallDetailApi()

    // 驗證 queryMemberLivelyList 是否被呼叫過
    expect(queryMemberLivelyList).toHaveBeenCalled()
  })
})
