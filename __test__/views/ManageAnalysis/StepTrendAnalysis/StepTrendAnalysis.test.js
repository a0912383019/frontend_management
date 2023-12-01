import { it, describe, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import StepTrendAnalysis from '@/views/ManageAnalysis/components/StepTrendAnalysis/StepTrendAnalysis.vue'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import LifeCycleStepProfitOverview from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/LifeCycleStepProfitOverview.vue'
import DailyLifeCycleStepPeople from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/DailyLifeCycleStepPeople.vue'
import { useGlobalStore } from '@/stores/global.js'

describe('StepTrendAnalysis.vue', () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const globalStore = useGlobalStore(pinia)
  globalStore.activeHall = {
    hall_name: 'esb',
    hall_code: 'esb'
  }
  const wrapper = shallowMount(StepTrendAnalysis, {
    global: {
      plugins: [i18n, router]
    }
  })

  //mock ref functions
  const query_step_trend_analysis_overview_tbl = vi.fn()
  wrapper.vm.$refs.life.query_step_trend_analysis_overview_tbl =
    query_step_trend_analysis_overview_tbl

  const query_step_total_people = vi.fn()
  wrapper.vm.$refs.daily.query_step_total_people = query_step_total_people

  // watch是否正常
  it('test watch', async () => {
    expect(query_step_trend_analysis_overview_tbl).toHaveBeenCalledTimes(1)
    expect(query_step_total_people).toHaveBeenCalledTimes(1)
    expect(wrapper.findComponent(LifeCycleStepProfitOverview).exists()).toBe(true)
    expect(wrapper.findComponent(DailyLifeCycleStepPeople).exists()).toBe(true)

    wrapper.vm.activeHall.hall_code = 'bmw'
    await wrapper.vm.$nextTick()
    expect(query_step_trend_analysis_overview_tbl).toHaveBeenCalledTimes(2)
    expect(query_step_total_people).toHaveBeenCalledTimes(2)
  })
})
