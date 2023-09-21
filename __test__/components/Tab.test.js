import { it, describe, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import Tab from '@/components/Tab.vue'

describe('Tab', () => {
  let wrapper = null

  const tabData = [
    {
      name: 'LifeCycleAnalysis',
      label: '會員生命週期分析'
    },
    {
      name: 'StepTrendAnalysis',
      label: '趨勢分析'
    }
  ]
  beforeEach(() => {
    wrapper = mount(Tab, {
      props: {
        tabData,
        activeName: 'LifeCycleAnalysis'
      },
      global: {
        plugins: [i18n]
      }
    })
  })

  it('是否存在列表', () => {
    expect(wrapper.find('.tabs').exists()).toBe(true)
  })

  it('選取列表第一筆，class是否有active', () => {
    let select = wrapper.find('.tabs li:nth-child(1)').classes()
    expect(select).toContain('active')
  })

  it('測試handleTabChange', async () => {
    wrapper.find('.tabs li:nth-child(2)').trigger('click')
    wrapper.vm.handleTabChange('StepTrendAnalysis')
    await wrapper.setProps({ activeName: 'StepTrendAnalysis' })
    expect(wrapper.find('.tabs li:nth-child(2)').classes()).toContain('active')
  })
})
