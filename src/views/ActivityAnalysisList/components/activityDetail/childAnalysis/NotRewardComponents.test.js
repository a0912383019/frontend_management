import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { useActivityAnalysisStore } from '@/stores'
import { createTestingPinia } from '@pinia/testing'
import NotRewardComponents from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/NotRewardComponents.vue'
import AnalysisDetails from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisDetails.vue'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'

describe('NotRewardComponents', () => {
  let wrapper = null
  let activityStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore(pinia)

    wrapper = shallowMount(NotRewardComponents)
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
    expect(wrapper.vm.isRewarded).toBeFalsy()

    // watch
    activityStore.childActiveView = 'RewardComponents'
    activityStore.isChildFiltered = 999
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(0)

    activityStore.childActiveView = 'NotRewardComponents'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.key).toStrictEqual(999)
  })
})
