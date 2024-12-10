import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { useActivityAnalysisStore } from '@/stores'
import ElementPlus from 'element-plus'
import ChildAnalysis from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/ChildAnalysis.vue'
import { createTestingPinia } from '@pinia/testing'
import SwitchWithTooltip from '@/components/Switch/SwitchWithTooltip.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'
import RewardComponents from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/RewardComponents.vue'
import NotRewardComponents from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/NotRewardComponents.vue'

describe('ChildAnalysis', () => {
  let wrapper = null
  const childActivityName = 'yuyutet'
  let activityStore

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    activityStore = useActivityAnalysisStore(pinia)
    activityStore.currentChildAnalysis = {
      name: childActivityName
    }
    wrapper = shallowMount(ChildAnalysis, {
      global: {
        plugins: [i18n, ElementPlus],
        stubs: {
          KeepAlive: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('components', async () => {
    expect(wrapper.findComponent(SwitchWithTooltip).exists()).toBeTruthy()
    expect(wrapper.findComponent(CurrencySignText).exists()).toBeTruthy()
    expect(wrapper.findComponent(RewardComponents).exists()).toBeTruthy()
    expect(wrapper.findComponent(NotRewardComponents).exists()).toBeFalsy()

    activityStore.childActiveView = 'NotRewardComponents'
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(RewardComponents).exists()).toBeFalsy()
    expect(wrapper.findComponent(NotRewardComponents).exists()).toBeTruthy()
  })

  it('test variables', () => {
    expect(wrapper.vm.isRewarded).toBeTruthy()
    const componentMap = {
      RewardComponents,
      NotRewardComponents
    }
    expect(wrapper.vm.componentMap).toStrictEqual(componentMap)
    expect(wrapper.vm.currentActiveComponent).toStrictEqual(RewardComponents)
    expect(wrapper.vm.switchBtnWidth).toStrictEqual(72)
  })

  it('switchRewarded', () => {
    expect(activityStore.childActiveView).toStrictEqual('RewardComponents')
    wrapper.vm.switchRewarded(false)
    expect(activityStore.childActiveView).toStrictEqual('NotRewardComponents')
  })
})
