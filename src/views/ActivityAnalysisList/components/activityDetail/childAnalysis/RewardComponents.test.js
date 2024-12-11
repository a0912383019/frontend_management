import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { useActivityAnalysisStore } from '@/stores'
import { createTestingPinia } from '@pinia/testing'
import RewardComponents from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/RewardComponents.vue'
import AnalysisDetails from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisDetails.vue'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'

describe('RewardComponents', () => {
  let wrapper = null
  let activityStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore(pinia)

    wrapper = shallowMount(RewardComponents)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('components', () => {
    expect(wrapper.findComponent(AnalysisDetails).exists()).toBeTruthy()
    expect(wrapper.findComponent(AnalysisTable).exists()).toBeTruthy()
  })

  it('expect variables correctly by watch', async () => {
    expect(wrapper.vm.key).toStrictEqual(0)
    expect(wrapper.vm.isRewarded).toBeTruthy()

    // watch
    activityStore.childActiveView = 'NotRewardComponents'
    activityStore.isChildFiltered = 999
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(0)

    activityStore.childActiveView = 'RewardComponents'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(999)
  })
})
