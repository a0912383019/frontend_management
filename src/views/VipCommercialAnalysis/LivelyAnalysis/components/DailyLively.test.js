import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import HighchartsVue from 'highcharts-vue'
import DailyLively from '@/views/VipCommercialAnalysis/LivelyAnalysis/components/DailyLively.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('DailyLively', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const result1 = {
      data: {
        result: [
          {
            action_score: '0.8554',
            data_date: '2023-11-11'
          },
          {
            action_score: '0.8714',
            data_date: '2023-11-12'
          },
          {
            action_score: '0.8293',
            data_date: '2023-11-13'
          },
          {
            action_score: '0.2788',
            data_date: '2023-11-14'
          },
          {
            action_score: '0.5956',
            data_date: '2023-11-15'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    const result2 = {
      data: {
        status: {
          return_code: '0001',
          message: 'success',
          error_code: '210400000'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(DailyLively, {
      global: {
        plugins: [HighchartsVue, i18n],
        components: {
          FontAwesomeIcon
        }
      },
      props: {
        data: {
          user_name: 'win888e',
          user_id: 6,
          startDate: '2023-12-19',
          endDate: '2024-03-17'
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    // 驗證組件是否存在
    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('Expected chartOptions is correctly', () => {
    const series = [
      {
        name: '活躍度',
        lineWidth: 2,
        data: [0.855, 0.871, 0.829, 0.279, 0.596]
      }
    ]
    const categories = ['2023/11/11', '2023/11/12', '2023/11/13', '2023/11/14', '2023/11/15']
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
  })

  it('clearChart', async () => {
    wrapper.vm.chartOptions.series = ['series']
    wrapper.vm.chartOptions.xAxis.categories = ['categories']
    await wrapper.vm.clearChart()
    expect(wrapper.vm.chartOptions.series).toStrictEqual([])
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual([])
  })
})
