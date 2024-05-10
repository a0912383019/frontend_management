import { it, describe, expect, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AnalysisResult from '@/views/TargetGroupAnalysis/components/AnalysisResult/AnalysisResult.vue'
import DailyBetAmountProfit from '@/views/TargetGroupAnalysis/components/AnalysisResult/DailyBetAmountProfit.vue'
import TotalPeople from '@/views/TargetGroupAnalysis/components/AnalysisResult/TotalPeople.vue'
import ActiveDepositPeople from '@/views/TargetGroupAnalysis/components/AnalysisResult/ActiveDepositPeople.vue'

describe('AnalysisResult.vue', () => {
  let wrapper = null
  let targetid = 'ttui-uuid-9999'

  beforeEach(() => {
    wrapper = shallowMount(AnalysisResult, {
      global: {
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        targetId: targetid
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', () => {
    expect(wrapper.findComponent(DailyBetAmountProfit).exists()).toBe(true)
    expect(wrapper.findComponent(DailyBetAmountProfit).attributes().targetid).toStrictEqual(targetid)

    expect(wrapper.findComponent(TotalPeople).exists()).toBe(true)
    expect(wrapper.findComponent(TotalPeople).attributes().targetid).toStrictEqual(targetid)

    expect(wrapper.findComponent(ActiveDepositPeople).exists()).toBe(true)
    expect(wrapper.findComponent(ActiveDepositPeople).attributes().targetid).toStrictEqual(targetid)
  })
})
