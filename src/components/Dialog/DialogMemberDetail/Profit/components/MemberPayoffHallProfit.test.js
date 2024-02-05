import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import MemberPayoffHallProfit from '@/components/Dialog/DialogMemberDetail/Profit/components/MemberPayoffHallProfit.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('MemberPayoffHallProfit.vue', () => {
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
            accumulate_profit: '-34688.5',
            data_date: '2023-10-31',
            payoff: '34499.3',
            profit_loss: '-34688.5'
          },
          {
            accumulate_profit: '-59099.97',
            data_date: '2023-11-01',
            payoff: '21873.49',
            profit_loss: '-24411.47'
          },
          {
            accumulate_profit: '-1184.97',
            data_date: '2023-11-02',
            payoff: '-58287.95',
            profit_loss: '57915'
          },
          {
            accumulate_profit: '-11645.77',
            data_date: '2023-11-03',
            payoff: '2237.98',
            profit_loss: '-10460.8'
          },
          {
            accumulate_profit: '-65350.94',
            data_date: '2023-11-04',
            payoff: '53465.99',
            profit_loss: '-53705.17'
          },
          {
            accumulate_profit: '-85981.05',
            data_date: '2023-11-05',
            payoff: '20175.42',
            profit_loss: '-20630.11'
          },
          {
            accumulate_profit: '-75261.63',
            data_date: '2023-11-06',
            payoff: '-12234.23',
            profit_loss: '10719.42'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(MemberPayoffHallProfit, {
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
    const categories = [
      '2023/10/31',
      '2023/11/01',
      '2023/11/02',
      '2023/11/03',
      '2023/11/04',
      '2023/11/05',
      '2023/11/06'
    ]
    const series = [
      {
        name: '會員損益',
        dashStyle: 'ShortDot',
        lineWidth: 2,
        color: 'rgba(245,105,84,1)',
        data: [34499.3, 21873.49, -58287.95, 2237.98, 53465.99, 20175.42, -12234.23]
      },
      {
        name: '廳主實際損益',
        dashStyle: 'Dash',
        lineWidth: 2,
        color: 'rgba(60,141,188,1)',
        data: [-34688.5, -24411.47, 57915, -10460.8, -53705.17, -20630.11, 10719.42]
      },
      {
        name: '廳主累積實際損益',
        dashStyle: 'LongDashDotDot',
        lineWidth: 2,
        color: 'rgba(0,166,90,1)',
        data: [-34688.5, -59099.97, -1184.97, -11645.77, -65350.94, -85981.05, -75261.63]
      }
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
    expect(wrapper.vm.chartOptions.plotOptions.series.dataLabels.enabled).toBe(true)
    expect(wrapper.vm.chartOptions.xAxis.tickmarkPlacement).toStrictEqual('on')
  })
})
