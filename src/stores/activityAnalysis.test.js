import { setActivePinia, createPinia } from 'pinia'
import { describe, it, beforeEach, expect } from 'vitest'
import { useActivityAnalysisStore } from '@/stores'
import { reactive, ref } from 'vue'

describe('useActivityAnalysisStore', () => {
  let activityAnalysisStore

  beforeEach(() => {
    setActivePinia(createPinia())
    activityAnalysisStore = useActivityAnalysisStore()
  })

  it('variables & findSelectedOption', () => {
    expect(activityAnalysisStore.currentTabs).toStrictEqual('Overview')
    expect(activityAnalysisStore.searchActivity).toStrictEqual('')
    expect(activityAnalysisStore.islistFiltered).toStrictEqual(0)
    expect(activityAnalysisStore.childListData).toEqual([])
    expect(activityAnalysisStore.currentChildAnalysis.name).toBeNull()
    expect(activityAnalysisStore.currentChildAnalysis.id).toBeNull()
    expect(activityAnalysisStore.chartApiParams.cut_type).toStrictEqual('week')

    activityAnalysisStore.currentChildAnalysis.id = 47
    activityAnalysisStore.optionChildList = [
      {
        value: 47,
        label: 'aa'
      },
      {
        value: 48,
        label: 'bb'
      }
    ]
    activityAnalysisStore.findSelectedOption()
    expect(activityAnalysisStore.currentChildAnalysis.name).toStrictEqual('aa')
  })

  it('resetState', () => {
    activityAnalysisStore.searchActivity = '測試活動'
    activityAnalysisStore.islistFiltered = 1
    activityAnalysisStore.currentTabs = 'GrowthRate'

    activityAnalysisStore.resetState()

    expect(activityAnalysisStore.searchActivity).toStrictEqual('')
    expect(activityAnalysisStore.islistFiltered).toStrictEqual(0)
    expect(activityAnalysisStore.currentTabs).toStrictEqual('Overview')
  })

  it('initChildData', () => {
    activityAnalysisStore.childListData = [{ id: 1, name: '活動1' }]
    activityAnalysisStore.currentChildAnalysis.name = '活動1'
    activityAnalysisStore.currentChildAnalysis.id = 1
    activityAnalysisStore.optionChildList = [{ value: 1, label: '活動1' }]

    activityAnalysisStore.initChildData()

    expect(activityAnalysisStore.childListData).toEqual([])
    expect(activityAnalysisStore.currentChildAnalysis.name).toBeNull()
    expect(activityAnalysisStore.currentChildAnalysis.id).toBeNull()
    expect(activityAnalysisStore.optionChildList).toBeNull()
    expect(activityAnalysisStore.isChildFiltered).toStrictEqual(0)
    expect(activityAnalysisStore.currentDetailTab).toStrictEqual('Commissionable')
    expect(activityAnalysisStore.searchChildDetailMemberName).toStrictEqual('')
    expect(activityAnalysisStore.isChildDetailListFiltered).toStrictEqual(0)
    expect(activityAnalysisStore.childActiveView).toStrictEqual('RewardComponents')
  })

  it('chartApiParams', () => {
    activityAnalysisStore.filterData.analysisDate = '2024-01-01 ~ 2024-01-10'
    activityAnalysisStore.filterData.selectDuration = 'month'
    activityAnalysisStore.filterData.selectReward = 2
    activityAnalysisStore.filterData.activityNameList = ['活動A']

    activityAnalysisStore.transformChartParams()

    expect(activityAnalysisStore.chartApiParams.start_date).toStrictEqual('2024-01-01')
    expect(activityAnalysisStore.chartApiParams.end_date).toStrictEqual('2024-01-10')
    expect(activityAnalysisStore.chartApiParams.cut_type).toStrictEqual('month')
    expect(activityAnalysisStore.chartApiParams.reward_flag).toStrictEqual(2)
    expect(activityAnalysisStore.chartApiParams.search_activity).toStrictEqual(['活動A'])
  })

  it('dateRestraintion', () => {
    const optionProxy = ref([{ disabled: false }, { disabled: false }, { disabled: false }])
    const filterProxy = reactive({ selectDuration: 'week' })

    // over 36 months
    activityAnalysisStore.dateRestraintion('2020-01-01 ~ 2024-01-01', optionProxy, filterProxy)
    expect(filterProxy.selectDuration).toStrictEqual('year')
    expect(optionProxy.value).toStrictEqual([
      {
        disabled: true
      },
      {
        disabled: true
      },
      {
        disabled: true
      }
    ])

    filterProxy.selectDuration = 'week'
    // over 12 months smaller than 36 months
    activityAnalysisStore.dateRestraintion('2023-01-01 ~ 2024-12-01', optionProxy, filterProxy)
    expect(filterProxy.selectDuration).toStrictEqual('season')
    expect(optionProxy.value).toStrictEqual([
      {
        disabled: true
      },
      {
        disabled: true
      },
      {
        disabled: false
      }
    ])

    filterProxy.selectDuration = 'week'
    // over 3 months smaller than 12 months
    activityAnalysisStore.dateRestraintion('2023-01-01 ~ 2023-12-01', optionProxy, filterProxy)
    expect(filterProxy.selectDuration).toStrictEqual('month')
    expect(optionProxy.value).toStrictEqual([
      {
        disabled: true
      },
      {
        disabled: false
      },
      {
        disabled: false
      }
    ])
  })
})
