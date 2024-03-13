import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ActiveTimeAnalysis from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/ActiveTimeAnalysis.vue'
import Filter from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Filter.vue'
import TimePeople from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/TimePeople.vue'
import Detail from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/Detail.vue'

describe('ActiveTimeAnalysis', () => {
  let wrapper = null
  const queryActiveTimePeople = vi.fn()
  const queryActiveTimeDetail = vi.fn()

  beforeEach(() => {
    wrapper = shallowMount(ActiveTimeAnalysis)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    // 驗證組件是否存在
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.findComponent(TimePeople).exists()).toBe(true)
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
  })

  it('Expected handleCallApi toHaveBeenCalled', () => {
    wrapper.vm.$refs.refTimePeople.queryActiveTimePeople = queryActiveTimePeople

    // console.log(wrapper.vm.$refs.refDetail.apiSuccess)

    wrapper.vm.handleCallApi()

    // 驗證 queryActiveTimePeople 是否被呼叫過
    expect(queryActiveTimePeople).toHaveBeenCalled()
  })

  it('Expected handelCallDetailApi toHaveBeenCalled', () => {
    wrapper.vm.$refs.refDetail.queryActiveTimeDetail = queryActiveTimeDetail

    const value = {
      point: {
        index: 10
      }
    }
    wrapper.vm.handelCallDetailApi(value)

    // 驗證 queryActiveTimeDetail 是否被呼叫過
    expect(queryActiveTimeDetail).toHaveBeenCalled()
  })
})
