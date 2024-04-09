import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DetailChart from '@/views/DataRankAnalysis/ProfitRank/components/DetailChart.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { createTestingPinia } from '@pinia/testing'
import HighchartsVue from 'highcharts-vue'

describe('DetailChart.vue', () => {
  let wrapper = null
  const apiResult = {
    daily: [
      {
        users: [
          {
            user_id: 455648693,
            user_name: 'jimmyrmb01',
            accumulate_profit_loss: "9430.0000",
            profit_loss: "9430.0000"
          },
          {
            user_id: 455673606,
            user_name: 'guspig43',
            accumulate_profit_loss: "0",
            profit_loss: "0"
          }
        ],
        date: '2024-04-01'
      },
      {
        users: [
          {
            user_id: 455648693,
            user_name: 'jimmyrmb01',
            accumulate_profit_loss: "9329.2500",
            profit_loss: "100.7500"
          },
          {
            user_id: 455673606,
            user_name: 'guspig43',
            accumulate_profit_loss: "8526.5069",
            profit_loss: "8526.5069"
          }
        ],
        date: '2024-04-02'
      }
    ],
    rank: [
      {
        ag_name: "dcash888",
        level: "未分層",
        profit_loss: "9298.2500",
        user_id: 455673606,
        user_name: 'guspig43',
        tags: [30010, 30412, 30358, 30406, 30407, 50001, 9459, 9289, 99079, 9283, 30414, 40003]
      },
      {
        ag_name: "dqamicotwda",
        level: "未分層",
        profit_loss: "8526.5069",
        user_id: 455648693,
        user_name: 'jimmyrmb01',
        tags: [30010, 30412, 30406, 30407, 9283, 9289, 99079, 9459, 30414, 40003]
      }
    ]
  }
  const expectResult = [
    {
      name: '(1) guspig43',
      type: 'line',
      data: [0, 8526.5069],
      color: 'rgb(241,78,78,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(2) jimmyrmb01',
      type: 'line',
      data: [9430, 9329.25],
      color: 'rgb(0,192,236,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    }
  ]

  afterEach(() => {
    wrapper.unmount()
  })

  it('Expected components render correctly', async () => {
    wrapper = shallowMount(DetailChart, {
      global: {
        plugins: [HighchartsVue, i18n, createTestingPinia({ createSpy: vi.fn })]
      },
      props: {
        apiObject: {
          apiSuccess: false,
          messageKey: 'loading',
          result: {}
        },
        clientWidth: 500
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
  })

  it('Expected api result transform correctly', async () => {
    wrapper = shallowMount(DetailChart, {
      global: {
        plugins: [HighchartsVue, i18n, createTestingPinia({ createSpy: vi.fn })]
      },
      props: {
        apiObject: {
          apiSuccess: true,
          messageKey: 'loading',
          result: apiResult,
          clientWidth: 500
        }
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(['2024/04/01', '2024/04/02'])
    expect(wrapper.vm.chartOptions.series).toStrictEqual(expectResult)
  })

  it('clearChart', async () => {
    wrapper.vm.chartOptions.series = ['series']
    wrapper.vm.chartOptions.xAxis.categories = ['categories']
    await wrapper.vm.clearChart()
    expect(wrapper.vm.chartOptions.series).toStrictEqual([])
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual([])
  })

  it('Expected messagekey correctly', async () => {
    wrapper = shallowMount(DetailChart, {
      global: {
        plugins: [HighchartsVue, i18n, createTestingPinia({ createSpy: vi.fn })]
      },
      props: {
        apiObject: {
          apiSuccess: true,
          messageKey: 'loading',
          result: {
            rank: [],
            daily: []
          }
        },
        clientWidth: 500
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('noResult')
  })

  it('watch props change', async () => {
    wrapper = shallowMount(DetailChart, {
      global: {
        plugins: [HighchartsVue, i18n, createTestingPinia({ createSpy: vi.fn })]
      },
      props: {
        apiObject: {
          apiSuccess: false,
          messageKey: 'loading',
          result: {
            rank: [],
            daily: []
          }
        },
        clientWidth: 500
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('loading')

    // 觸發 watch
    await wrapper.setProps({
      apiObject: {
        apiSuccess: true,
        messageKey: 'loading',
        result: {
          rank: [],
          daily: []
        }
      }
    })
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('noResult')

    // 觸發 watch
    await wrapper.setProps({
      apiObject: {
        apiSuccess: false,
        messageKey: 'loading',
        result: {
          rank: [],
          daily: []
        }
      }
    })
    expect(wrapper.vm.apiSuccess).toBe(false)
    expect(wrapper.vm.messageKey).toBe('loading')

    // 觸發 watch
    await wrapper.setProps({
      apiObject: {
        apiSuccess: true,
        messageKey: 'loading',
        result: apiResult
      }
    })
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(['2024/04/01', '2024/04/02'])
    expect(wrapper.vm.chartOptions.series).toStrictEqual(expectResult)
  })
})
