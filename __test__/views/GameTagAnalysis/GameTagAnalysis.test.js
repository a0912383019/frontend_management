import { it, describe, expect, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import GameTagAnalysis from '@/views/GameTagAnalysis/GameTagAnalysis.vue'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import Filter from '@/views/GameTagAnalysis/components/Filter.vue'
import AmountAnalysis from '@/views/GameTagAnalysis/components/AmountAnalysis/AmountAnalysis.vue'
import PayoffAnalysis from '@/views/GameTagAnalysis/components/PayoffAnalysis/PayoffAnalysis.vue'

describe('GameTagAnalysis', () => {
  let wrapper = null

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試api資料
  it('expect mock api', async () => {
    wrapper = shallowMount(GameTagAnalysis, {
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
      }
    })
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.findComponent(Filter).exists()).toBe(true)
    expect(wrapper.vm.currentTabComponent).toBe(AmountAnalysis)
    
    //觸發watch
    wrapper.vm.currentTabs = 'PayoffAnalysis'
    expect(wrapper.vm.currentTabComponent).toBe(PayoffAnalysis)
  })
})
