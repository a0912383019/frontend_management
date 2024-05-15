import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DailyBetAmountProfit from '@/views/TargetGroupAnalysis/components/AnalysisResult/DailyBetAmountProfit.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import HighchartsVue from 'highcharts-vue'
import axiosGoInstance from '@/api/axiosGoInstance.js'
import Tab from '@/components/Tab.vue'

describe('DailyBetAmountProfit.vue', () => {
  let wrapper = null
  let targetStore
  let spyGet

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const globalStore = useGlobalStore(pinia)
    globalStore.activeHall = {
      hall_name: 'esb',
      hall_code: 'esb'
    }

    targetStore = useTargetGroupStore(pinia)
    targetStore.filtered = new Date(12342323).getTime()

    let result1 = new Error('err')
    result1.response = { status: 500 }

    let result2 = {
      data: {
        status: {
          return_code: '0000',
          message: 'success'
        },
        result: [
          {
            custom_tag_bet_amount_payoff_data: [
              {
                custom_tags_id: '442a0132-a88f-46f0-ad6d-1b7874a37875',
                custom_tags_name: '一',
                bet_amount: '0',
                payoff: '0'
              },
              {
                custom_tags_id: 'e0d1f374-ec46-4dc2-aa83-60e430f5c841',
                custom_tags_name: '二',
                bet_amount: '0',
                payoff: '0'
              }
            ],
            date: '2024-05-04'
          },
          {
            custom_tag_bet_amount_payoff_data: [
              {
                custom_tags_id: '442a0132-a88f-46f0-ad6d-1b7874a37875',
                custom_tags_name: '一',
                bet_amount: '0',
                payoff: '0'
              },
              {
                custom_tags_id: 'e0d1f374-ec46-4dc2-aa83-60e430f5c841',
                custom_tags_name: '二',
                bet_amount: '460274.0000',
                payoff: '16853.6100'
              }
            ],
            date: '2024-05-05'
          },
          {
            custom_tag_bet_amount_payoff_data: [
              {
                custom_tags_id: '442a0132-a88f-46f0-ad6d-1b7874a37875',
                custom_tags_name: '一',
                bet_amount: '0',
                payoff: '0'
              },
              {
                custom_tags_id: 'e0d1f374-ec46-4dc2-aa83-60e430f5c841',
                custom_tags_name: '二',
                bet_amount: '32773.2700',
                payoff: '12106.7700'
              }
            ],
            date: '2024-05-06'
          },
          {
            custom_tag_bet_amount_payoff_data: [
              {
                custom_tags_id: '442a0132-a88f-46f0-ad6d-1b7874a37875',
                custom_tags_name: '一',
                bet_amount: '0',
                payoff: '0'
              },
              {
                custom_tags_id: 'e0d1f374-ec46-4dc2-aa83-60e430f5c841',
                custom_tags_name: '二',
                bet_amount: '133668.8000',
                payoff: '-22748.8800'
              }
            ],
            date: '2024-05-07'
          }
        ]
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockRejectedValueOnce(result1)
    spyGet.mockResolvedValueOnce(result2)

    vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = shallowMount(DailyBetAmountProfit, {
      global: {
        plugins: [i18n, HighchartsVue],
        stubs: {
          ElRow: {
            template: '<div><slot /></div>'
          },
          ElCol: {
            template: '<div><slot /></div>'
          }
        }
      },
      props: {
        targetId: 'ttui-uuid-9999'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    // 等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(Tab).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('Expect variables & api & watch correctly', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tabList).toStrictEqual([
      {
        label: '每日貨量',
        name: 'DailyBetAmount'
      },
      {
        label: '每日損益',
        name: 'DailtProfit'
      }
    ])
    expect(spyGet).toHaveBeenCalledWith(
      `/api/auth/target_groups/${wrapper.props('targetId')}/betAmount_and_payoff`,
      expect.any(Object)
    )
    expect(spyGet).toBeCalledTimes(1)
    expect(wrapper.vm.apiSuccess).toBe(false)

    // 模擬搜尋，觸發watch
    targetStore.filtered = new Date(22342323).getTime()

    await flushPromises()
    expect(spyGet).toBeCalledTimes(2)
    expect(wrapper.vm.apiSuccess).toBe(true)

    const dateArr = ['2024/05/04', '2024/05/05', '2024/05/06', '2024/05/07']
    expect(wrapper.vm.betAmountOptions.xAxis.categories).toStrictEqual(dateArr)
    expect(wrapper.vm.profitOptions.xAxis.categories).toStrictEqual(dateArr)
    expect(wrapper.vm.betAmountOptions.series).toStrictEqual([
      {
        color: 'rgb(245,105,84,1)',
        data: [0, 0, 0, 0],
        fillColor: 'rgb(245,105,84,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: '一'
      },
      {
        color: 'rgb(0,166,90,1)',
        data: [0, 460274, 32773.27, 133668.8],
        fillColor: 'rgb(0,166,90,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: '二'
      }
    ])
    expect(wrapper.vm.profitOptions.series).toStrictEqual([
      {
        color: 'rgb(245,105,84,1)',
        data: [0, 0, 0, 0],
        fillColor: 'rgb(245,105,84,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: '一'
      },
      {
        color: 'rgb(0,166,90,1)',
        data: [0, 16853.61, 12106.77, -22748.88],
        fillColor: 'rgb(0,166,90,0.3)',
        lineWidth: 2,
        marker: {
          symbol: 'circle'
        },
        name: '二'
      }
    ])
  })

  it('clearChart', async () => {
    wrapper.vm.betAmountOptions.xAxis.categories = ['categories']
    wrapper.vm.betAmountOptions.series = ['series']
    wrapper.vm.profitOptions.xAxis.categories = ['categories']
    wrapper.vm.profitOptions.series = ['series']

    await wrapper.vm.clearChart()
    expect(wrapper.vm.betAmountOptions.xAxis.categories).toStrictEqual([])
    expect(wrapper.vm.betAmountOptions.series).toStrictEqual([])
    expect(wrapper.vm.profitOptions.xAxis.categories).toStrictEqual([])
    expect(wrapper.vm.profitOptions.series).toStrictEqual([])
  })
})
