import { it, describe, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ManageAnalysis from '@/views/ManageAnalysis/ManageAnalysis.vue'
import { createTestingPinia } from '@pinia/testing'
import PageTitle from '@/components/Title/PageTitle.vue'
import Tab from '@/components/Tab.vue'
import LifeCycleAnalysis from '@/views/ManageAnalysis/components/LifeCycleAnalysis/LifeCycleAnalysis.vue'
import StepTrendAnalysis from '@/views/ManageAnalysis/components/StepTrendAnalysis/StepTrendAnalysis.vue'

describe('ManageAnalysis.vue', () => {
  const wrapper = shallowMount(ManageAnalysis, {
    global: {
      plugins: [
        i18n,
        createTestingPinia({
          createSpy: vi.fn
        })
      ],
      stubs: {
        ElRow: {
          template: '<div><slot /></div>'
        },
        ElCol: {
          template: '<div><slot /></div>'
        },
        KeepAlive: {
          template: '<div><slot /></div>'
        }
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
    expect(wrapper.findComponent(LifeCycleAnalysis).exists()).toBe(true)
    expect(wrapper.findComponent(StepTrendAnalysis).exists()).toBe(false)
    //模擬切換tab
    wrapper.vm.currentTabs = 'StepTrendAnalysis'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentTabs).toStrictEqual('StepTrendAnalysis')
    expect(wrapper.findComponent(LifeCycleAnalysis).exists()).toBe(false)
    expect(wrapper.findComponent(StepTrendAnalysis).exists()).toBe(true)
  })
})
