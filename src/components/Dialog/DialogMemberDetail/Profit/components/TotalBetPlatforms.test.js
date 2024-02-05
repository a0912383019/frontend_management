import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import TotalBetPlatforms from '@/components/Dialog/DialogMemberDetail/Profit/components/TotalBetPlatforms.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('TotalBetPlatforms.vue', () => {
  let wrapper = null
  let result

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        result: [
          {
            lobby_name: '皇冠體育',
            total_bet_amount: '1284753'
          },
          {
            lobby_name: 'AG視訊',
            total_bet_amount: '332000'
          },
          {
            lobby_name: 'TP彩票',
            total_bet_amount: '247771'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(TotalBetPlatforms, {
      global: {
        plugins: [
          HighchartsVue,
          i18n,
          router,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    const categories = ['皇冠體育', 'AG視訊', 'TP彩票']
    const data = [
      { color: 'rgb(245,105,84,0.7)', y: 1284753 },
      { color: 'rgb(0,166,90,0.7)', y: 332000 },
      { color: 'rgb(243,156,18,0.7)', y: 247771 }
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(data)
  })
})
