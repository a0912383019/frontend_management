import { it, describe, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
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
    wrapper = shallowMount(Tab, {
      props: {
        tabData,
        activeName: 'LifeCycleAnalysis'
      }
    })
  })

  // 是否存在列表
  it('Does the list exist?', () => {
    expect(wrapper.find('.tabs').exists()).toBe(true)
  })

  // 選取列表第一筆，class是否有active
  it('Select the first item in the list, whether the class is active', () => {
    let select = wrapper.find('.tabs li:nth-child(1)').classes()
    expect(select).toContain('active')
  })

  // 測試handleTabChange
  it('Test handleTabChange', async () => {
    wrapper.find('.tabs li:nth-child(2)').trigger('click')
    wrapper.vm.handleTabChange('StepTrendAnalysis')
    await wrapper.setProps({ activeName: 'StepTrendAnalysis' })
    expect(wrapper.find('.tabs li:nth-child(2)').classes()).toContain('active')
  })
})
