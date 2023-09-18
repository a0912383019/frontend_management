import { it, describe, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import StepTrendAnalysis from '@/views/ManageAnalysis/components/StepTrendAnalysis/StepTrendAnalysis.vue'
import { createTestingPinia } from '@pinia/testing'
import router from '@/router'
import LifeCycleStepProfitOverview from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/LifeCycleStepProfitOverview.vue'
import DailyLifeCycleStepPeople from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/DailyLifeCycleStepPeople.vue'

describe('StepTrendAnalysis.vue', () => {
    const wrapper = shallowMount(StepTrendAnalysis, {
        global: {
            plugins: [i18n, router, createTestingPinia(
                {
                    createSpy: vi.fn
                }
            )]
        }
    })

    //mock ref functions
    wrapper.vm.$refs.life.query_step_trend_analysis_overview_tbl = vi.fn()
    wrapper.vm.$refs.daily.query_step_total_people = vi.fn()

    it('watch是否正常', () => {
        wrapper.vm.activeHall.hall_code = 'bmw'
        expect(wrapper.findComponent(LifeCycleStepProfitOverview).exists()).toBe(true)
        expect(wrapper.findComponent(DailyLifeCycleStepPeople).exists()).toBe(true)
    })
})
