import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import PeriodDayOffer from '@/components/Dialog/DialogMemberDetail/Analysis/components/PeriodDayOffer.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('PeriodDayOffer.vue', () => {
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
            1041: {
              opcode_name: '線上存款優惠',
              premium_amount: '0'
            },
            1053: {
              opcode_name: '活動優惠',
              premium_amount: '0'
            },
            1191: {
              opcode_name: 'New BB體育返點',
              premium_amount: '0'
            },
            1833: {
              opcode_name: '週期俸祿_周月季',
              premium_amount: '0'
            },
            2810: {
              opcode_name: '購寶錢包筆筆送優惠',
              premium_amount: '0'
            },
            data_date: '2023-07-28'
          },
          {
            1041: {
              opcode_name: '線上存款優惠',
              premium_amount: '0'
            },
            1053: {
              opcode_name: '活動優惠',
              premium_amount: '0'
            },
            1191: {
              opcode_name: 'New BB體育返點',
              premium_amount: '0'
            },
            1833: {
              opcode_name: '週期俸祿_周月季',
              premium_amount: '0'
            },
            2810: {
              opcode_name: '購寶錢包筆筆送優惠',
              premium_amount: '0'
            },
            data_date: '2023-07-29'
          },
          {
            1041: {
              opcode_name: '線上存款優惠',
              premium_amount: '0'
            },
            1053: {
              opcode_name: '活動優惠',
              premium_amount: '0'
            },
            1191: {
              opcode_name: 'New BB體育返點',
              premium_amount: '0'
            },
            1833: {
              opcode_name: '週期俸祿_周月季',
              premium_amount: '0'
            },
            2810: {
              opcode_name: '購寶錢包筆筆送優惠',
              premium_amount: '0'
            },
            data_date: '2023-07-30'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(PeriodDayOffer, {
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
    const categories = ['2023/07/28', '2023/07/29', '2023/07/30']
    const series = [
      {
        name: '線上存款優惠',
        marker: { symbol: 'circle' },
        lineWidth: 2,
        fillColor: 'rgb(245,105,84,0.3)',
        color: 'rgb(245,105,84,1)',
        data: [0, 0, 0]
      },
      {
        name: '活動優惠',
        marker: { symbol: 'circle' },
        lineWidth: 2,
        fillColor: 'rgb(0,166,90,0.3)',
        color: 'rgb(0,166,90,1)',
        data: [0, 0, 0]
      },
      {
        name: 'New BB體育返點',
        marker: { symbol: 'circle' },
        lineWidth: 2,
        fillColor: 'rgb(243,156,18,0.3)',
        color: 'rgb(243,156,18,1)',
        data: [0, 0, 0]
      },
      {
        name: '週期俸祿_周月季',
        marker: { symbol: 'circle' },
        lineWidth: 2,
        fillColor: 'rgb(0,192,239,0.3)',
        color: 'rgb(0,192,239,1)',
        data: [0, 0, 0]
      },
      {
        name: '購寶錢包筆筆送優惠',
        marker: { symbol: 'circle' },
        lineWidth: 2,
        fillColor: 'rgb(232,208,152,0.3)',
        color: 'rgb(232,208,152,1)',
        data: [0, 0, 0]
      }
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
  })
})
