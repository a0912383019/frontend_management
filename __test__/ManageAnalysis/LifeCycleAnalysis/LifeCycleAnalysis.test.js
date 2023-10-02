import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { i18n } from '@/global/i18n'
import router from '@/router'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LifeCycleAnalysis from '@/views/ManageAnalysis/components/LifeCycleAnalysis/LifeCycleAnalysis.vue'
import LifeCyclePeopleChanges from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/LifeCyclePeopleChanges/LifeCyclePeopleChanges.vue'
import StepOverview from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/StepOverview/StepOverview.vue'
import MemberDetails from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/MemberDetails.vue'

describe('LifeCycleAnalysis', () => {
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(LifeCycleAnalysis, {
      global: {
        plugins: [
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('預期渲染的元件', async () => {
    expect(wrapper.findComponent(LifeCyclePeopleChanges).exists()).toBe(true)
    expect(wrapper.findComponent(StepOverview).exists()).toBe(true)
    expect(wrapper.findComponent(MemberDetails).exists()).toBe(true)
  })
  it('預期函示有觸發', async () => {
    //mock ref functions
    wrapper.vm.$refs.step.query_life_cycle_analysis_avg_data = vi.fn()
    wrapper.vm.$refs.member.query_life_cycle_analysis_detail_tbl = vi.fn()
    wrapper.vm.$refs.member.tableGoToFirstPage = vi.fn()
    wrapper.vm.callApi()
  })
})
