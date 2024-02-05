import { it, describe, expect, vi, afterEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import SvgKnob from '@/components/SvgKnob.vue'
import MemberPeriodBetAmount from '@/components/Dialog/DialogMemberDetail/Overview/components/MemberPeriodBetAmount.vue'
import router from '@/router'
import 'vitest-canvas-mock'

describe('MemberPeriodBetAmount.vue', () => {
  let wrapper = null
  let result

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly, mock api 0000', async () => {
    result = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: {
          result_period_bet_amount: [
            {
              data_date: '2023-11-01',
              total_bet_amount: '48990'
            },
            {
              data_date: '2023-11-02',
              total_bet_amount: '116026'
            },
            {
              data_date: '2023-11-03',
              total_bet_amount: '48288'
            },
            {
              data_date: '2023-11-04',
              total_bet_amount: '99102'
            },
            {
              data_date: '2023-11-05',
              total_bet_amount: '69856'
            },
            {
              data_date: '2023-11-06',
              total_bet_amount: '166474'
            },
            {
              data_date: '2023-11-07',
              total_bet_amount: '73381'
            }
          ],
          result_period_device_bet_amount: [
            {
              device: 0,
              total_bet_amount: '119155'
            },
            {
              device: 1,
              total_bet_amount: '582962'
            },
            {
              device: 2,
              total_bet_amount: '49923'
            }
          ]
        }
      }
    }
    vi.spyOn(axiosGoInstance, 'get').mockResolvedValue(result)
    wrapper = shallowMount(MemberPeriodBetAmount, {
      global: {
        plugins: [
          i18n,
          router,
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
          }
        }
      }
    })

    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(false)
    expect(wrapper.findComponent(SvgKnob).exists()).toBe(false)

    //等待異步完成
    await flushPromises()
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.find('canvas').exists()).toBe(true)
    expect(wrapper.findComponent(SvgKnob).exists()).toBe(true)
    const xLabels = [
      '2023/11/01',
      '2023/11/02',
      '2023/11/03',
      '2023/11/04',
      '2023/11/05',
      '2023/11/06',
      '2023/11/07'
    ]
    expect(wrapper.vm.chartSetting.data.xLabels).toStrictEqual(xLabels)

    const chartSettingDatasets = [
      {
        label: '貨量',
        fill: true,
        borderWidth: 3,
        lineTension: 0,
        spanGaps: true,
        borderColor: 'rgba(245,105,84,1)',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: 'rgba(245,105,84,1)',
        pointBackgroundColor: 'rgba(245,105,84,1)',
        data: [48990, 116026, 48288, 99102, 69856, 166474, 73381]
      }
    ]
    expect(wrapper.vm.chartSetting.data.datasets).toStrictEqual(chartSettingDatasets)

    const knobLists = [
      { name: 'PC', amount: 16 },
      { name: 'Mobile', amount: 7 },
      { name: '其他', amount: 78 }
    ]
    expect(wrapper.vm.knobLists).toStrictEqual(knobLists)
  })
})
