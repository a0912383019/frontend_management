import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import TagStatistics from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/tagStatistics/TagStatistics.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/tagStatistics/CustomTable.vue'
import HighchartsVue from 'highcharts-vue'
import { apiQueryActivityTagsRank, apiQueryActivityCommissionableGrowthSpanTags } from '@/api'
import { createTestingPinia } from '@pinia/testing'
import { createRouterMock } from 'vue-router-mock'

vi.mock('@/api', () => ({
  apiQueryActivityTagsRank: vi.fn(),
  apiQueryActivityCommissionableGrowthSpanTags: vi.fn()
}))

describe('TagStatistics', () => {
  let wrapper = null

  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })

    let system_config = {
      tags_config: {
        30412: {
          tag_type: 1,
          tag_name: '測試',
          tag_description: '測試敘述',
          tag_category: 1,
          sort_index: 1000000,
          tag_enabled: true,
          mutual_tags_code: ''
        },
        30096: {
          tag_type: 1,
          tag_name: 'VIP客',
          tag_description: '人工定義為高價值會員',
          tag_category: 1,
          sort_index: 1000001,
          tag_enabled: true,
          mutual_tags_code: ''
        },
        30010: {
          tag_type: 3,
          tag_name: '體育客',
          tag_description: '會員近15個實動日，在體育類遊戲總有效投註量最多',
          tag_category: 1,
          sort_index: 3000012,
          tag_enabled: true,
          mutual_tags_code: '30009,30010,30011,30013,30014'
        }
      }
    }
    sessionStorage.setItem('system_config', JSON.stringify(system_config))

    apiQueryActivityTagsRank.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: [
          {
            tag_code: 30412,
            count: 63
          },
          {
            tag_code: 30096,
            count: 18
          },
          {
            tag_code: 30010,
            count: 12
          }
        ]
      }
    })
    apiQueryActivityCommissionableGrowthSpanTags.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: [
          {
            lower: 0,
            upper: 0,
            tag_count: [
              {
                tag_code: 30412,
                count: 45
              },
              {
                tag_code: 30096,
                count: 0
              },
              {
                tag_code: 30010,
                count: 1
              }
            ]
          },
          {
            lower: -100,
            upper: -80,
            tag_count: [
              {
                tag_code: 30412,
                count: 11
              },
              {
                tag_code: 30096,
                count: 0
              },
              {
                tag_code: 30010,
                count: 1
              }
            ]
          },
          {
            lower: -80,
            upper: -60,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 0
              },
              {
                tag_code: 30010,
                count: 1
              }
            ]
          },
          {
            lower: -60,
            upper: -40,
            tag_count: [
              {
                tag_code: 30412,
                count: 2
              },
              {
                tag_code: 30096,
                count: 0
              },
              {
                tag_code: 30010,
                count: 1
              }
            ]
          },
          {
            lower: -40,
            upper: -20,
            tag_count: [
              {
                tag_code: 30412,
                count: 1
              },
              {
                tag_code: 30096,
                count: 0
              },
              {
                tag_code: 30010,
                count: 1
              }
            ]
          },
          {
            lower: -20,
            upper: 0,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 1
              },
              {
                tag_code: 30010,
                count: 0
              }
            ]
          },
          {
            lower: 0,
            upper: 20,
            tag_count: [
              {
                tag_code: 30412,
                count: 4
              },
              {
                tag_code: 30096,
                count: 1
              },
              {
                tag_code: 30010,
                count: 0
              }
            ]
          },
          {
            lower: 20,
            upper: 40,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 1
              },
              {
                tag_code: 30010,
                count: 0
              }
            ]
          },
          {
            lower: 40,
            upper: 60,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 1
              },
              {
                tag_code: 30010,
                count: 0
              }
            ]
          },
          {
            lower: 60,
            upper: 80,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 1
              },
              {
                tag_code: 30010,
                count: 0
              }
            ]
          },
          {
            lower: 80,
            upper: 100,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 1
              },
              {
                tag_code: 30010,
                count: 0
              }
            ]
          },
          {
            lower: 100,
            upper: 0,
            tag_count: [
              {
                tag_code: 30412,
                count: 0
              },
              {
                tag_code: 30096,
                count: 12
              },
              {
                tag_code: 30010,
                count: 7
              }
            ]
          }
        ]
      }
    })

    wrapper = shallowMount(TagStatistics, {
      global: {
        plugins: [
          i18n,
          router,
          ElementPlus,
          HighchartsVue,
          createTestingPinia({ createSpy: vi.fn })
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
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.unmount()
  })

  it('components', async () => {
    await flushPromises()
    expect(wrapper.findComponent(SectionTitle).exists()).toBeTruthy()
    expect(wrapper.findComponent(CdpMessage).exists()).toBeFalsy()
    expect(wrapper.findComponent(CustomTable).exists()).toBeTruthy()

    wrapper.vm.tagsRankApiSuccess = false
    wrapper.vm.commissionableGrowthApiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBeTruthy()
    expect(wrapper.findComponent(CustomTable).exists()).toBeFalsy()
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '標籤名稱',
        minWidth: '55%',
        prop: 'tag_name'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '人數',
        minWidth: '25%',
        prop: 'unit_people'
      },
      {
        align: 'center',
        colClass: 'cdp-checkbox__blue checkbox-svg',
        minWidth: '20%',
        prop: 'selection'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('api correctly', async () => {
    await flushPromises()
    expect(wrapper.vm.tagsRankApiSuccess).toBeTruthy()
    const tableData = [
      {
        bar_color: 'rgb(245,105,84,0.7)',
        is_selected: true,
        tag_code: '30412',
        tag_name: '測試',
        unit_people: 63
      },
      {
        bar_color: 'rgb(0,166,90,0.7)',
        is_selected: true,
        tag_code: '30096',
        tag_name: 'VIP客',
        unit_people: 18
      },
      {
        bar_color: 'rgb(243,156,18,0.7)',
        is_selected: true,
        tag_code: '30010',
        tag_name: '體育客',
        unit_people: 12
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)
    const tagColorObj = {
      30010: 'rgb(243,156,18,0.7)',
      30096: 'rgb(0,166,90,0.7)',
      30412: 'rgb(245,105,84,0.7)'
    }
    expect(wrapper.vm.tagColorObj).toStrictEqual(tagColorObj)
    expect(wrapper.vm.commissionableGrowthApiSuccess).toBeTruthy()
    const categories = [
      '比較週均無貨量',
      '-100%(含) ~ -80%(不含)',
      '-80%(含) ~ -60%(不含)',
      '-60%(含) ~ -40%(不含)',
      '-40%(含) ~ -20%(不含)',
      '-20%(含) ~ 0%(不含)',
      '0%(含) ~ 20%(不含)',
      '20%(含) ~ 40%(不含)',
      '40%(含) ~ 60%(不含)',
      '60%(含) ~ 80%(不含)',
      '80%(含) ~ 100%(不含)',
      '100%(含) 以上'
    ]
    expect(wrapper.vm.chartOptions.xAxis.categories).toStrictEqual(categories)
    const series = [
      {
        color: 'rgb(243,156,18,0.7)',
        data: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 7],
        name: '體育客',
        tagCode: '30010',
        visible: true
      },
      {
        color: 'rgb(0,166,90,0.7)',
        data: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 12],
        name: 'VIP客',
        tagCode: '30096',
        visible: true
      },
      {
        color: 'rgb(245,105,84,0.7)',
        data: [45, 11, 0, 2, 1, 0, 4, 0, 0, 0, 0, 0],
        name: '測試',
        tagCode: '30412',
        visible: true
      }
    ]
    expect(wrapper.vm.chartOptions.series).toStrictEqual(series)
  })

  it('generateCheckboxBar', () => {
    const row = { bar_color: '#ff0000' }
    const barColor = wrapper.vm.generateCheckboxBar({ row })
    expect(barColor).toEqual({ '--my-color-var': '#ff0000' })
  })

  it('selectAll', async () => {
    await flushPromises()
    wrapper.vm.selectAll(false)
    wrapper.vm.tableData.forEach((ele) => {
      expect(ele.is_selected).toBeFalsy()
    })
    wrapper.vm.chartOptions.series.forEach((ele) => {
      expect(ele.visible).toBeFalsy()
    })

    wrapper.vm.selectAll(true)
    wrapper.vm.tableData.forEach((ele) => {
      expect(ele.is_selected).toBeTruthy()
    })
    wrapper.vm.chartOptions.series.forEach((ele) => {
      expect(ele.visible).toBeTruthy()
    })
  })
})
