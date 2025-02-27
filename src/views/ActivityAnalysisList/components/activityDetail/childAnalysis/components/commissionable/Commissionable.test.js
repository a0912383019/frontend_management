import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import { createTestingPinia } from '@pinia/testing'
import Commissionable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/commissionable/Commissionable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import HighchartsVue from 'highcharts-vue'
import { apiQueryActivityMemberParticipation, apiQueryActivityBetAmountGrowthSpan } from '@/api'
import { createRouterMock } from 'vue-router-mock'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

vi.mock('@/api', () => ({
  apiQueryActivityMemberParticipation: vi.fn(),
  apiQueryActivityBetAmountGrowthSpan: vi.fn()
}))

describe('Commissionable', () => {
  let wrapper = null

  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })

    apiQueryActivityMemberParticipation.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: {
          activity_analysis_date: '2024-09-26 ~ 2024-12-24',
          member_count: 107,
          achieve_member_count: 17,
          participation_percent: '15.8879'
        }
      }
    })
    apiQueryActivityBetAmountGrowthSpan.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: [
          {
            lower: 0,
            upper: 0,
            span_count: 83
          },
          {
            lower: -100,
            upper: -80,
            span_count: 9
          },
          {
            lower: -80,
            upper: -60,
            span_count: 1
          },
          {
            lower: -60,
            upper: -40,
            span_count: 2
          },
          {
            lower: -40,
            upper: -20,
            span_count: 2
          },
          {
            lower: -20,
            upper: 0,
            span_count: 1
          },
          {
            lower: 0,
            upper: 20,
            span_count: 0
          },
          {
            lower: 20,
            upper: 40,
            span_count: 0
          },
          {
            lower: 40,
            upper: 60,
            span_count: 1
          },
          {
            lower: 60,
            upper: 80,
            span_count: 1
          },
          {
            lower: 80,
            upper: 100,
            span_count: 0
          },
          {
            lower: 100,
            upper: 0,
            span_count: 7
          }
        ]
      }
    })

    wrapper = shallowMount(Commissionable, {
      global: {
        plugins: [
          i18n,
          ElementPlus,
          HighchartsVue,
          router,
          createTestingPinia({ createSpy: vi.fn })
        ],
        components: {
          FontAwesomeIcon
        },
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
    expect(wrapper.findComponent(SectionTitle).exists()).toBeTruthy()
    expect(wrapper.findComponent(CdpMessage).exists()).toBeFalsy()
    expect(wrapper.findComponent(CustomTable).exists()).toBeTruthy()

    wrapper.vm.memberPartiApiSuccess = false
    wrapper.vm.commissionableApiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CdpMessage).exists()).toBeTruthy()
    expect(wrapper.findComponent(CustomTable).exists()).toBeFalsy()
  })

  it('tableColumns', () => {
    const tableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        label: '欄位名稱',
        minWidth: '45%',
        prop: 'col_name'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '數值',
        minWidth: '55%',
        prop: 'col_value'
      }
    ]
    expect(wrapper.vm.tableColumns).toStrictEqual(tableColumns)
  })

  it('api correctly', async () => {
    await flushPromises()
    expect(apiQueryActivityMemberParticipation).toBeCalledTimes(1)
    expect(apiQueryActivityBetAmountGrowthSpan).toBeCalledTimes(1)

    const tableData = [
      {
        col_name: '活動期間(活動中)',
        col_value: '2024/09/26 ~ 2024/12/24'
      },
      {
        col_name: '名單人數',
        col_value: 107
      },
      {
        col_name: '達檻人數',
        col_value: 17
      },
      {
        col_name: '參與率',
        col_value: '16%'
      }
    ]
    expect(wrapper.vm.tableData).toStrictEqual(tableData)

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
        color: 'rgb(241,78,78,0.7)',
        name: 0,
        y: 83
      },
      {
        color: 'rgb(0,192,236,0.7)',
        name: 1,
        y: 9
      },
      {
        color: 'rgb(69,137,166,0.7)',
        name: 2,
        y: 1
      },
      {
        color: 'rgb(251,201,201,0.7)',
        name: 3,
        y: 2
      },
      {
        color: 'rgb(209,214,222,0.7)',
        name: 4,
        y: 2
      },
      {
        color: 'rgb(200,200,240,0.7)',
        name: 5,
        y: 1
      },
      {
        color: 'rgb(255,107,0,0.7)',
        name: 6,
        y: 0
      },
      {
        color: 'rgb(235,214,173,0.7)',
        name: 7,
        y: 0
      },
      {
        color: 'rgb(255,172,112,0.7)',
        name: 8,
        y: 1
      },
      {
        color: 'rgb(12,197,195,0.7)',
        name: 9,
        y: 1
      },
      {
        color: 'rgb(179,219,67,0.7)',
        name: 10,
        y: 0
      },
      {
        color: 'rgb(248,224,0,0.7)',
        name: 11,
        y: 7
      }
    ]
    expect(wrapper.vm.chartOptions.series[0].data).toStrictEqual(series)
  })

  it('handleInput', () => {
    // 應該移除非數字和負號的字元
    wrapper.vm.handleInput('abc123')
    expect(wrapper.vm.participateRate).toBe('123')

    wrapper.vm.handleInput('!@#$56&*()')
    expect(wrapper.vm.participateRate).toBe('56')

    // 應該確保負號只能出現在開頭
    wrapper.vm.handleInput('12-3')
    expect(wrapper.vm.participateRate).toBe('123')

    wrapper.vm.handleInput('-45')
    expect(wrapper.vm.participateRate).toBe('-45')

    wrapper.vm.handleInput('--78')
    expect(wrapper.vm.participateRate).toBe('-78')

    // 應該限制最小值為-100
    wrapper.vm.handleInput('-150')
    expect(wrapper.vm.participateRate).toBe('-100')
  })

  it('handleSerach', async () => {
    await flushPromises()
    expect(apiQueryActivityMemberParticipation).toBeCalledTimes(1)

    wrapper.vm.queryActivityMemberParticipation()
    await flushPromises()
    expect(apiQueryActivityMemberParticipation).toBeCalledTimes(2)
  })
})
