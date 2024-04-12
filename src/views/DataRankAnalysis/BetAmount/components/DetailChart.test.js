import { it, describe, expect, vi, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import DetailChart from '@/views/DataRankAnalysis/BetAmount/components/DetailChart.vue'
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
        date: '2024-03-22'
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
        date: '2024-03-23'
      }
    ],
    rank: [
      {
        ag_name: 'dgiambii',
        bet_amount_total: '20500.0000',
        commissionable_total: '20491.8000',
        user_id: 455673606,
        user_name: 'guspig43',
        user_level: 'shu測試',
        tags: [30010, 30412, 30358, 30406, 30407, 50001, 9459, 9289, 99079, 9283, 30414, 40003]
      },
      {
        ag_name: 'djimmy',
        bet_amount_total: '11100.0000',
        commissionable_total: '10500.0000',
        user_id: 455648693,
        user_name: 'jimmyrmb01',
        user_level: 'QAJimmy(勿動)',
        tags: [30412, 30406, 30416, 30010, 60110, 40012, 30407, 40003]
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
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(['2024/03/22', '2024/03/23'])
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
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(['2024/03/22', '2024/03/23'])
    expect(wrapper.vm.chartOptions.series).toStrictEqual(expectResult)
  })
})
