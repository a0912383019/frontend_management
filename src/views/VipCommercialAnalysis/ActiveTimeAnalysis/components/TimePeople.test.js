import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import HighchartsVue from 'highcharts-vue'
import TimePeople from '@/views/VipCommercialAnalysis/ActiveTimeAnalysis/components/TimePeople.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

describe('TimePeople', () => {
  let wrapper = null
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_code: 'esb',
      hall_name: 'esb'
    }

    const result1 = {
      data: {
        result: [0, 5, 3, 4, 5, 5, 4, 4, 8, 6, 6, 5, 4, 4, 7, 6, 7, 4, 5, 7, 4, 6, 2, 6],
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

    spyGet = vi.spyOn(axiosGoInstance, 'post')
    spyGet.mockResolvedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    wrapper = shallowMount(TimePeople, {
      global: {
        plugins: [HighchartsVue, i18n]
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

  it('Expected API data in the transform function is correct', () => {
    const seriesData = [0, 5, 3, 4, 5, 5, 4, 4, 8, 6, 6, 5, 4, 4, 7, 6, 7, 4, 5, 7, 4, 6, 2, 6]
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(seriesData)
  })

  it('Expected xAxisName result is correct', () => {
    const data = [
      '0點',
      '1點',
      '2點',
      '3點',
      '4點',
      '5點',
      '6點',
      '7點',
      '8點',
      '9點',
      '10點',
      '11點',
      '12點',
      '13點',
      '14點',
      '15點',
      '16點',
      '17點',
      '18點',
      '19點',
      '20點',
      '21點',
      '22點',
      '23點'
    ]
    expect(wrapper.vm.xAxisName).toStrictEqual(data)
  })

  it('Expected emit update:detail result is correct', async () => {
    await wrapper.vm.chartOptions.series[0].events.click('test')
    expect(wrapper.emitted('update:detail')).toStrictEqual([['test']])
  })
})
