import { it, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { i18n } from '@/global/i18n'
import { createTestingPinia } from '@pinia/testing'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ElementPlus from 'element-plus'
import Filter from '@/views/DataRankAnalysis/BetAmountGrowthDeclineRank/components/Filter.vue'
import { useDataRankAnalysisStore } from '@/stores'
import axiosGoInstance from '@/api/axiosGoInstance.js'

describe('Filter', () => {
  let wrapper = null
  let rankStore
  let spyGet
  const hide = vi.fn()

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    rankStore = useDataRankAnalysisStore(pinia)
    rankStore.growthDecayFilter = {
      financialMonth: '01',
      financialWeek: 1,
      financialYear: '2024',
      searchDate: '2024-01',
      rank: 10,
      isFirst: true
    }

    const result1 = {
      data: {
        result: [
          {
            month: 1,
            weeks: [
              {
                fin_week: 1,
                week_duration: '2024-01-01 ~ 2024-01-07'
              },
              {
                fin_week: 2,
                week_duration: '2024-01-08 ~ 2024-01-14'
              },
              {
                fin_week: 3,
                week_duration: '2024-01-15 ~ 2024-01-21'
              },
              {
                fin_week: 4,
                week_duration: '2024-01-22 ~ 2024-01-28'
              },
              {
                fin_week: 5,
                week_duration: '2024-01-29 ~ 2024-02-04'
              }
            ]
          }
        ],
        status: {
          return_code: '0000',
          message: 'success'
        }
      }
    }

    spyGet = vi.spyOn(axiosGoInstance, 'get')
    spyGet.mockResolvedValueOnce(result1)

    wrapper = shallowMount(Filter, {
      global: {
        plugins: [i18n, ElementPlus],
        components: {
          FontAwesomeIcon
        }
      }
    })

    wrapper.vm.$refs.popover.hide = hide
  })

  afterEach(() => {
    wrapper.unmount()
  })

  // 測試 closePopover
  it('closePopover', () => {
    wrapper.vm.closePopover()
    expect(hide).toHaveBeenCalled()
  })

  it('selectRankLists data', () => {
    const selectRankLists = [
      {
        value: 10,
        label: '前10名'
      },
      {
        value: 20,
        label: '前20名'
      },
      {
        value: 50,
        label: '前50名'
      }
    ]
    expect(wrapper.vm.selectRankLists).toStrictEqual(selectRankLists)
    expect(wrapper.vm.filterData.searchDate).toBe('2024-01')
    expect(wrapper.vm.filterData.rank).toBe(10)
  })

  it('handleDateChange & handleClick', async () => {
    const result = [
      {
        label: '1(2024/01/01 ~ 2024/01/07)',
        value: '1(2024/01/01 ~ 2024/01/07)'
      },
      {
        label: '2(2024/01/08 ~ 2024/01/14)',
        value: '2(2024/01/08 ~ 2024/01/14)'
      },
      {
        label: '3(2024/01/15 ~ 2024/01/21)',
        value: '3(2024/01/15 ~ 2024/01/21)'
      },
      {
        label: '4(2024/01/22 ~ 2024/01/28)',
        value: '4(2024/01/22 ~ 2024/01/28)'
      },
      {
        label: '5(2024/01/29 ~ 2024/02/04)',
        value: '5(2024/01/29 ~ 2024/02/04)'
      }
    ]

    await wrapper.vm.handleDateChange()
    expect(wrapper.vm.selectWeeks).toStrictEqual(result)
    expect(wrapper.vm.filterData.displayweek).toBe('1(2024/01/01 ~ 2024/01/07)')
    expect(wrapper.vm.filterData.apiWeek).toBe(1)
    expect(rankStore.growthDecayFilter.searchDate).toBe('2024-01')
    expect(rankStore.growthDecayFilter.rank).toBe(10)
    expect(rankStore.growthDecayFilter.financialMonth).toBe('01')
    expect(rankStore.growthDecayFilter.financialWeek).toBe(1)
    expect(rankStore.growthDecayFilter.financialYear).toBe('2024')
    expect(hide).toHaveBeenCalled()
  })

  it('handleWeekChange', async () => {
    const value = '2(2024/01/08 ~ 2024/01/14)'
    const result = 2
    await wrapper.vm.handleWeekChange(value)
    expect(wrapper.vm.filterData.apiWeek).toBe(result)
  })
})
