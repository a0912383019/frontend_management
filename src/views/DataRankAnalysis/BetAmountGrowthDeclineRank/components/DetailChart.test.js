import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DetailChart from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/DetailChart.vue'
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
            bet_amount: '11100.0000',
            commissionable: '10500.0000'
          },
          {
            user_id: 455673606,
            user_name: 'guspig43',
            bet_amount: '0',
            commissionable: '0'
          }
        ],
        date: {
          fin_year: 2024,
          fin_month: 3,
          fin_week: 2
        }
      },
      {
        users: [
          {
            user_id: 455648693,
            user_name: 'jimmyrmb01',
            bet_amount: '0',
            commissionable: '0'
          },
          {
            user_id: 455673606,
            user_name: 'guspig43',
            bet_amount: '20500.0000',
            commissionable: '20491.8000'
          }
        ],
        date: {
          fin_year: 2024,
          fin_month: 3,
          fin_week: 3
        }
      }
    ],
    rank: [
      {
        ag_name: 'dgiambii',
        bet_amount_growth_percent: '100.0000',
        bet_amount_total: '20500.0000',
        bet_amount_total_compare: '0',
        commissionable_growth_percent: '100.0000',
        commissionable_total: '27659.4978',
        commissionable_total_compare: '0',
        user_id: 455673606,
        user_name: 'guspig43',
        level: '未分層',
        tags: [30010, 30412, 30358, 30406, 30407, 50001, 9459, 9289, 99079, 9283, 30414, 40003]
      },
      {
        ag_name: 'djimmy',
        bet_amount_growth_percent: '100.0000',
        bet_amount_total: '17657.5900',
        bet_amount_total_compare: '0',
        commissionable_growth_percent: '100.0000',
        commissionable_total: '17650.5270',
        commissionable_total_compare: '0',
        user_id: 455648693,
        user_name: 'jimmyrmb01',
        level: 'QAJimmy(勿動)',
        tags: [30010, 30412, 30406, 30407, 9283, 9289, 99079, 9459, 30414, 40003]
      }
    ]
  }
  const expectResult = [
    {
      name: '(1) guspig43',
      type: 'line',
      data: [0, 20491.8],
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
      data: [10500, 0],
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
        sectionWidth: 500
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
          sectionWidth: 500
        }
      }
    })
    //等待異步完成
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(false)
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(['2024/03/W2', '2024/03/W3'])
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
        sectionWidth: 500
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
        sectionWidth: 500
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
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(['2024/03/W2', '2024/03/W3'])
    expect(wrapper.vm.chartOptions.series).toStrictEqual(expectResult)
  })
})
