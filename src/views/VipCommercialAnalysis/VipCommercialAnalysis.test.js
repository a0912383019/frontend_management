import { it, describe, expect, afterEach, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import VipCommercialAnalysis from '@/views/VipCommercialAnalysis/VipCommercialAnalysis.vue'

describe('VipCommercialAnalysis', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(VipCommercialAnalysis, {
      global: {
        plugins: [i18n, ElementPlus]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected tabData is correctly', () => {
    const result = [
      {
        name: 'LivelyAnalysis',
        label: '活躍度分析'
      },
      {
        name: 'ActiveTimeAnalysis',
        label: '活躍時段分析'
      },
      {
        name: 'DayReport',
        label: '日報表'
      },
      {
        name: 'WeekReport',
        label: '週報表'
      },
      {
        name: 'WeekTotalReport',
        label: '週統計報表'
      }
    ]
    expect(wrapper.vm.tabData).toStrictEqual(result)
  })
})
