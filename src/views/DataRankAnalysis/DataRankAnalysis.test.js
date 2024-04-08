import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DataRankAnalysis from '@/views/DataRankAnalysis/DataRankAnalysis.vue'
import { createTestingPinia } from '@pinia/testing'
import ProfitFilter from '@/views/DataRankAnalysis/ProfitRank/components/Filter.vue'
import GrowthDecayFilter from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/Filter.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import BetAmountRank from '@/views/DataRankAnalysis/BetAmount/BetAmount.vue'
import Growth from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/Growth.vue'
import PositiveProfitRank from '@/views/DataRankAnalysis/ProfitRank/PositiveProfitRank.vue'
import { useDataRankAnalysisStore } from '@/stores'

describe('DataRankAnalysis.vue', () => {
  let wrapper = null
  let rankStore
  const resetState = vi.fn()

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    rankStore = useDataRankAnalysisStore(pinia)
    rankStore.resetState = resetState
    wrapper = shallowMount(DataRankAnalysis, {
      global: {
        plugins: [i18n],
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      },
      attachTo: document.body
    })
  })

  afterEach(() => {
    wrapper.unmount()

    // 確認 resetState有被呼叫
    expect(resetState).toHaveBeenCalled()
  })

  it('Expected current tab change and components render correctly', async () => {
    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.findComponent(GrowthDecayFilter).isVisible()).toBeFalsy()
    expect(wrapper.findComponent(ProfitFilter).isVisible()).toBeFalsy()

    expect(wrapper.vm.currentTabs).toStrictEqual('BetAmountRank')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(BetAmountRank)

    // 模擬更改tab
    wrapper.vm.currentTabs = 'Growth'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabs).toStrictEqual('Growth')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(Growth)
    expect(wrapper.findComponent(GrowthDecayFilter).isVisible()).toBeTruthy()
    expect(wrapper.findComponent(ProfitFilter).isVisible()).toBeFalsy()

    // 模擬更改tab
    wrapper.vm.currentTabs = 'PositiveProfitRank'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabs).toStrictEqual('PositiveProfitRank')
    expect(wrapper.vm.currentTabComponent).toStrictEqual(PositiveProfitRank)
    expect(wrapper.findComponent(GrowthDecayFilter).isVisible()).toBeFalsy()
    expect(wrapper.findComponent(ProfitFilter).isVisible()).toBeTruthy()
  })

  it('Expected tab name correctly', async () => {
    await wrapper.vm.$nextTick()

    const tabData = [
      {
        name: 'BetAmountRank',
        label: '貨量排名'
      },
      {
        name: 'Growth',
        label: '貨量成長排名'
      },
      {
        name: 'Decline',
        label: '貨量衰退排名'
      },
      {
        name: 'PositiveProfitRank',
        label: '正盈利排名'
      },
      {
        name: 'NegativeProfitRank',
        label: '負盈利排名'
      }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(tabData)
  })
})
