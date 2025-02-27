import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import ElementPlus from 'element-plus'
import { createTestingPinia } from '@pinia/testing'
import AnalysisTable from '@/views/ActivityAnalysisList/components/activityDetail/childAnalysis/components/AnalysisTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { apiQueryActivityCompareOverview } from '@/api'
import { createRouterMock } from 'vue-router-mock'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

vi.mock('@/api', () => ({
  apiQueryActivityCompareOverview: vi.fn()
}))

describe('AnalysisTable', () => {
  let wrapper = null

  beforeEach(() => {
    const router = createRouterMock({
      spy: {
        create: (fn) => vi.fn(fn),
        reset: (spy) => spy.mockClear()
      }
    })

    apiQueryActivityCompareOverview.mockResolvedValue({
      data: {
        status: { return_code: '0000' },
        result: {
          before: {
            start_date: '2024-04-25',
            end_date: '2024-05-08',
            average: {
              deposit: '511.0051',
              commissionable: '18592.6267',
              payoff: '-880.8929',
              offer: '2.7538',
              profit: '-883.6467'
            },
            ratio: {
              commissionable_count: '0.0564',
              commissionable: '0.0234',
              deposit: '0.0062'
            },
            count: {
              deposit: 0,
              active: 3,
              label: 0,
              register: 0
            },
            growth_rate: {
              deposit: null,
              commissionable: null,
              payoff: null,
              offer: null,
              profit: null,
              ratio_commissionable_count: null,
              ratio_commissionable: null,
              ratio_deposit: null,
              deposit_count: null,
              active_count: null,
              label_count: null,
              register_count: null
            }
          },
          after: {
            start_date: '2100-01-01',
            end_date: '2100-01-01',
            average: {
              deposit: '0',
              commissionable: '0',
              payoff: '0',
              offer: '0',
              profit: '0'
            },
            ratio: {
              commissionable_count: '0',
              commissionable: '0',
              deposit: '0'
            },
            count: {
              deposit: 0,
              active: 0,
              label: 0,
              register: 0
            },
            growth_rate: {
              deposit: '-100.0000',
              commissionable: '-100.0000',
              payoff: '100.0000',
              offer: '-100.0000',
              profit: '100.0000',
              ratio_commissionable_count: '-100.0000',
              ratio_commissionable: '-100.0000',
              ratio_deposit: '-100.0000',
              deposit_count: null,
              active_count: '-100.0000',
              label_count: null,
              register_count: null
            }
          },
          current: {
            start_date: '2024-09-26',
            end_date: '2024-12-24',
            average: {
              deposit: '2424.3392',
              commissionable: '13958.8004',
              payoff: '-267.1201',
              offer: '4169.5218',
              profit: '-4436.6445'
            },
            ratio: {
              commissionable_count: '0.0336',
              commissionable: '0.0063',
              deposit: '0.0064'
            },
            count: {
              deposit: 0,
              active: 4,
              label: 0,
              register: 0
            },
            growth_rate: {
              deposit: '374.4256',
              commissionable: '-24.9229',
              payoff: '69.6762',
              offer: '151308.1837',
              profit: '69.6762',
              ratio_commissionable_count: '-40.4255',
              ratio_commissionable: '-73.0769',
              ratio_deposit: '3.2258',
              deposit_count: null,
              active_count: '33.3333',
              label_count: null,
              register_count: null
            }
          }
        }
      }
    })

    wrapper = shallowMount(AnalysisTable, {
      global: {
        plugins: [i18n, router, ElementPlus, createTestingPinia({ createSpy: vi.fn })],
        components: {
          FontAwesomeIcon
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
    expect(wrapper.findAllComponents(CustomTable)).toHaveLength(2)

    wrapper.vm.apiSuccess = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(CdpMessage)).toHaveLength(2)
    expect(wrapper.findComponent(CustomTable).exists()).toBeFalsy()
  })

  it('performanceTableColumns & proportionTableColumns', () => {
    const performanceTableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        minWidth: '12%',
        prop: 'activity_duration'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '資料區間',
        minWidth: '17%',
        prop: 'data_duration'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '日均存款',
        minWidth: '14%',
        prop: 'deposit_day_avg'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '日均有效投注',
        minWidth: '14%',
        prop: 'commissionable_day_avg'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '日均損益',
        minWidth: '14%',
        prop: 'profit_day_avg'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '日均優惠獎金',
        minWidth: '14%',
        prop: 'bonus_day_avg'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '日均實際損益',
        minWidth: '15%',
        prop: 'profit_day_avg'
      }
    ]
    const proportionTableColumns = [
      {
        align: 'center',
        headerAlign: 'center',
        minWidth: '12%',
        prop: 'activity_duration'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '資料區間',
        minWidth: '17%',
        prop: 'data_duration'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '有效投注人數占比',
        minWidth: '13%',
        prop: 'commissionable_people_proportion'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '整體有效投注占比',
        minWidth: '13%',
        prop: 'commissionable_proportion'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '整體存款佔比',
        minWidth: '10%',
        prop: 'deposit_proportion'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '存款人數',
        minWidth: '9%',
        prop: 'deposit_count'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '實動人數',
        minWidth: '8%',
        prop: 'active_member'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '標籤人數',
        minWidth: '8%',
        prop: 'people_tags_count'
      },
      {
        align: 'center',
        headerAlign: 'center',
        label: '註冊30天內人數',
        minWidth: '10%',
        prop: 'register_in_30_days'
      }
    ]

    expect(wrapper.vm.performanceTableColumns).toStrictEqual(performanceTableColumns)
    expect(wrapper.vm.proportionTableColumns).toStrictEqual(proportionTableColumns)
  })

  it('api correctly', async () => {
    await flushPromises()

    const performanceTableData = [
      {
        activity_duration: '活動前',
        bonus_day_avg: '2.75',
        bonus_day_avg_rate: '0',
        commissionable_day_avg: '18,592.63',
        commissionable_day_avg_rate: '0',
        data_duration: '2024/04/25 ~ 2024/05/08',
        deposit_day_avg: '511.01',
        deposit_day_avg_rate: '0',
        payoff_day_avg: '<span class="text-danger">-880.89</span>',
        payoff_day_avg_rate: '0',
        profit_day_avg: '<span class="text-danger">-883.65</span>',
        profit_day_avg_rate: '0'
      },
      {
        activity_duration: '活動中',
        bonus_day_avg: '4,169.52',
        bonus_day_avg_rate: '151,308',
        commissionable_day_avg: '13,958.8',
        commissionable_day_avg_rate: '-25',
        data_duration: '2024/09/26 ~ 2024/12/24',
        deposit_day_avg: '2,424.34',
        deposit_day_avg_rate: '374',
        payoff_day_avg: '<span class="text-danger">-267.12</span>',
        payoff_day_avg_rate: '70',
        profit_day_avg: '<span class="text-danger">-4,436.64</span>',
        profit_day_avg_rate: '70'
      },
      {
        activity_duration: '活動後',
        bonus_day_avg: '--',
        bonus_day_avg_rate: '--',
        commissionable_day_avg: '--',
        commissionable_day_avg_rate: '--',
        data_duration: '⎻⎻⎻⎻/⎻⎻/⎻⎻ ~ ⎻⎻⎻⎻/⎻⎻/⎻⎻',
        deposit_day_avg: '--',
        deposit_day_avg_rate: '--',
        payoff_day_avg: '--',
        payoff_day_avg_rate: '--',
        profit_day_avg: '--',
        profit_day_avg_rate: '--'
      }
    ]
    expect(wrapper.vm.performanceTableData).toStrictEqual(performanceTableData)

    const proportionTableData = [
      {
        active_member: 3,
        active_member_rate: '0',
        activity_duration: '活動前',
        commissionable_people_proportion: '0.06%',
        commissionable_people_proportion_rate: '0',
        commissionable_proportion: '0.02%',
        commissionable_proportion_rate: '0',
        data_duration: '2024/04/25 ~ 2024/05/08',
        deposit_count: 0,
        deposit_count_rate: '0',
        deposit_proportion: '0.01%',
        deposit_proportion_rate: '0',
        people_tags_count: 0,
        people_tags_count_rate: '0',
        register_in_30_days: 0,
        register_in_30_days_rate: '0'
      },
      {
        active_member: 4,
        active_member_rate: '33',
        activity_duration: '活動中',
        commissionable_people_proportion: '0.03%',
        commissionable_people_proportion_rate: '-40.43',
        commissionable_proportion: '0.01%',
        commissionable_proportion_rate: '-73.08',
        data_duration: '2024/09/26 ~ 2024/12/24',
        deposit_count: 0,
        deposit_count_rate: '0',
        deposit_proportion: '0.01%',
        deposit_proportion_rate: '3.23',
        people_tags_count: 0,
        people_tags_count_rate: '0',
        register_in_30_days: 0,
        register_in_30_days_rate: '0'
      },
      {
        active_member: '--',
        active_member_rate: '--',
        activity_duration: '活動後',
        commissionable_people_proportion: '--',
        commissionable_people_proportion_rate: '--',
        commissionable_proportion: '--',
        commissionable_proportion_rate: '--',
        data_duration: '⎻⎻⎻⎻/⎻⎻/⎻⎻ ~ ⎻⎻⎻⎻/⎻⎻/⎻⎻',
        deposit_count: '--',
        deposit_count_rate: '--',
        deposit_proportion: '--',
        deposit_proportion_rate: '--',
        people_tags_count: '--',
        people_tags_count_rate: '--',
        register_in_30_days: '--',
        register_in_30_days_rate: '--'
      }
    ]
    expect(wrapper.vm.proportionTableData).toStrictEqual(proportionTableData)
  })
})
