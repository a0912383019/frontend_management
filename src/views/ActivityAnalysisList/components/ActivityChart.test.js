import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import ActivityChart from '@/views/ActivityAnalysisList/components/ActivityChart.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import HighchartsVue from 'highcharts-vue'
import { useActivityAnalysisStore } from '@/stores'
import { dayjs } from 'element-plus'

describe('ActivityChart', () => {
  let wrapper = null

  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('components', async () => {
    wrapper = shallowMount(ActivityChart, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        apiObject: {
          apiSuccess: false,
          messageKey: 'loading',
          result: []
        }
      }
    })
    expect(wrapper.findComponent(CdpMessage).exists()).toBe(true)
    expect(wrapper.findComponent(SectionTitle).exists()).toBe(true)
  })

  it('apitransform correctly', () => {
    wrapper = shallowMount(ActivityChart, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        apiObject: {
          apiSuccess: true,
          messageKey: 'loading',
          result: [
            {
              interval_title: '2024-11-11~2024-11-17',
              activities: {
                39: {
                  activity_name: 'yuttt',
                  commissionable_growth_rate: '0'
                },
                40: {
                  activity_name: 'noviatest1205-1',
                  commissionable_growth_rate: '0'
                },
                41: {
                  activity_name: '勿刪-勿刪-勿刪-Danny',
                  commissionable_growth_rate: '4.4509'
                }
              }
            },
            {
              interval_title: '2024-11-18~2024-11-24',
              activities: {
                39: {
                  activity_name: 'yuttt',
                  commissionable_growth_rate: '0'
                },
                40: {
                  activity_name: 'noviatest1205-1',
                  commissionable_growth_rate: '0'
                },
                41: {
                  activity_name: '勿刪-勿刪-勿刪-Danny',
                  commissionable_growth_rate: '-79.0229'
                }
              }
            }
          ]
        }
      }
    })

    const categories = ['2024/11/11 ~ 2024/11/17', '2024/11/18 ~ 2024/11/24']
    const series = [
      {
        color: 'rgb(241,78,78,1)',
        data: [0, 0],
        lineWidth: 2,
        marker: {
          radius: 3,
          symbol: 'circle'
        },
        name: 'yuttt',
        type: 'line'
      },
      {
        color: 'rgb(0,192,236,1)',
        data: [0, 0],
        lineWidth: 2,
        marker: {
          radius: 3,
          symbol: 'circle'
        },
        name: 'noviatest1205-1',
        type: 'line'
      },
      {
        color: 'rgb(69,137,166,1)',
        data: [4.4509, -79.0229],
        lineWidth: 2,
        marker: {
          radius: 3,
          symbol: 'circle'
        },
        name: '勿刪-勿刪-勿刪-Danny',
        type: 'line'
      }
    ]
    expect(wrapper.vm.apiSuccess).toBeTruthy()
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
  })

  it('analysisDateText', () => {
    wrapper = shallowMount(ActivityChart, {
      global: {
        plugins: [i18n, HighchartsVue]
      },
      props: {
        apiObject: {
          apiSuccess: true,
          result: []
        }
      }
    })
    const activityStore = useActivityAnalysisStore()
    const startDate = '2024-01-01'
    const endDate = '2024-01-31'
    activityStore.chartApiParams.start_date = startDate
    activityStore.chartApiParams.end_date = endDate

    let newStartDate = dayjs(startDate).format('YYYY/MM/DD')
    let newEndDate = dayjs(endDate).format('YYYY/MM/DD')
    const analysisDateText = `分析區間 ${newStartDate} ~ ${newEndDate}`
    expect(wrapper.vm.analysisDateText).toStrictEqual(analysisDateText)
  })
})
