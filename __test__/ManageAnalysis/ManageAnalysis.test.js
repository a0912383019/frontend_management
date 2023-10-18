import { it, describe, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ManageAnalysis from '@/views/ManageAnalysis/ManageAnalysis.vue'
import { createTestingPinia } from '@pinia/testing'
import ElementPlus from 'element-plus'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import LifeCycleAnalysis from '@/views/ManageAnalysis/components/LifeCycleAnalysis/LifeCycleAnalysis.vue'
import StepTrendAnalysis from '@/views/ManageAnalysis/components/StepTrendAnalysis/StepTrendAnalysis.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CdpIcon from '@/components/CdpIcon.vue'
import router from '@/router'
import { library } from '@/utils/fontawsome.js'

describe('ManageAnalysis.vue', () => {
  const wrapper = mount(ManageAnalysis, {
    global: {
      plugins: [
        i18n,
        ElementPlus,
        router,
        createTestingPinia({
          createSpy: vi.fn
        })
      ],
      components: {
        FontAwesomeIcon,
        CdpIcon
      }
    }
  })

  it('ManageAnalysis', () => {
    //元件渲染是否正確
    expect(wrapper.findComponent(PageTitle).exists()).toBe(true)
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.findComponent(LifeCycleAnalysis).exists()).toBe(true)
    expect(wrapper.findComponent(StepTrendAnalysis).exists()).toBe(false)
  })

  it('dict', () => {
    //字典檔是否正確
    const tabData = [
      { name: 'LifeCycleAnalysis', label: '會員生命週期分析' },
      { name: 'StepTrendAnalysis', label: '趨勢分析' }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(tabData)
  })

  it('change tab', async () => {
    //切換tab，currentTabs是否有改變
    const tabs = wrapper.findAll('.tabs-manage-analysis.tabs li')
    await tabs[1].trigger('click')
    expect(wrapper.vm.currentTabs).toStrictEqual('StepTrendAnalysis')
    expect(wrapper.findComponent(LifeCycleAnalysis).exists()).toBe(false)
    expect(wrapper.findComponent(StepTrendAnalysis).exists()).toBe(true)
  })
})
