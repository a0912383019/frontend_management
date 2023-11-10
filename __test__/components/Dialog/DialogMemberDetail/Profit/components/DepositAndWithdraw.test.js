import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DepositAndWithdraw from '@/components/Dialog/DialogMemberDetail/Profit/components/DepositAndWithdraw.vue'
import router from '@/router'
import HighchartsVue from 'highcharts-vue'

describe('DepositAndWithdraw.vue', () => {
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
            data_date: '2023-10-31',
            deposit_amount: '14500',
            withdraw_amount: '41800',
            accumulate_profit: '-27300'
          },
          {
            data_date: '2023-11-01',
            deposit_amount: '10000',
            withdraw_amount: '41800',
            accumulate_profit: '-59100'
          },
          {
            data_date: '2023-11-02',
            deposit_amount: '80795',
            withdraw_amount: '0',
            accumulate_profit: '21695'
          },
          {
            data_date: '2023-11-04',
            deposit_amount: '25000',
            withdraw_amount: '104388',
            accumulate_profit: '-57693'
          },
          {
            data_date: '2023-11-05',
            deposit_amount: '35000',
            withdraw_amount: '0',
            accumulate_profit: '-22693'
          },
          {
            data_date: '2023-11-06',
            deposit_amount: '19750',
            withdraw_amount: '57200',
            accumulate_profit: '-60143'
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(DepositAndWithdraw, {
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
      '2023/11/04',
      '2023/11/05',
      '2023/11/06'
    ]
    const series = [
      {
        name: '存款',
        marker: { symbol: 'circle' },
        lineWidth: 2,
        color: 'rgba(245,105,84,1)',
        data: [14500, 10000, 80795, 25000, 35000, 19750]
      },
      {
        name: '取款',
        marker: { symbol: 'diamond' },
        lineWidth: 2,
        color: 'rgba(60,141,188,1)',
        data: [41800, 41800, 0, 104388, 0, 57200]
      },
      {
        name: '累積盈利總額',
        marker: { symbol: 'square' },
        lineWidth: 2,
        color: 'rgba(0,166,90,1)',
        data: [-27300, -59100, 21695, -57693, -22693, -60143],
        zIndex: -1
      }
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
    expect(wrapper.vm.chartOptions.plotOptions.series.dataLabels.enabled).toBe(true)
    expect(wrapper.vm.chartOptions.xAxis.tickmarkPlacement).toStrictEqual('on')
  })
})
