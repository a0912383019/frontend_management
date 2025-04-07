import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

describe('useSystemStore', () => {
  const date = new Date(2000, 1, 1, 13)

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(date)
    vi.mock('@/stores/dateConfig.js', () => ({
      useDateStore: vi.fn()
    }))
    const mockLastDate = {
      date_range_picker_config_1: {
        startDate: dayjs(1513823919228).add(1, 'day').subtract(1, 'month'),
        endDate: dayjs(1513823919228)
      },
      date_range_picker_config_4: {
        endDate: dayjs(1513823919228)
      }
    }
    useDateStore.mockReturnValue(mockLastDate)
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('initializes with correct values', () => {
    const manageAnalysisStore = useManageAnalysisStore()

    expect(manageAnalysisStore.searchName).toBe('')
    expect(manageAnalysisStore.queryDate).toStrictEqual('2017-12-21')
    expect(manageAnalysisStore.fuzzySearch).toBe(false)
    expect(manageAnalysisStore.useCustomList).toBe(false)
    expect(manageAnalysisStore.stepType).toBe(null)
    expect(manageAnalysisStore.detailType).toBe(null)
    expect(manageAnalysisStore.apiDraw).toBe(1)
    expect(manageAnalysisStore.apiStart).toBe(0)
    expect(manageAnalysisStore.apiLength).toBe(15)
    expect(manageAnalysisStore.apiRecordsTotal).toBe(0)
    expect(manageAnalysisStore.querySortRule.sort).toStrictEqual('deposit_amount')
    expect(manageAnalysisStore.querySortRule.order).toStrictEqual('DESC')
    expect(manageAnalysisStore.deatilRangeDate).toStrictEqual('2017-11-22 ~ 2017-12-21')
    expect(manageAnalysisStore.stepTrendRangeDate).toStrictEqual('2017-11-22 ~ 2017-12-21')
    expect(manageAnalysisStore.filterTimestamp).toStrictEqual(date.getTime())
    expect(manageAnalysisStore.filterDateTimestamp).toStrictEqual(date.getTime())
    expect(manageAnalysisStore.filterDateStepTrendTimestamp).toStrictEqual(date.getTime())
    expect(manageAnalysisStore.filterCustomUserList).toStrictEqual([])
  })

  it('updates state when mutated', () => {
    const manageAnalysisStore = useManageAnalysisStore()

    manageAnalysisStore.searchName = 'Julia'
    manageAnalysisStore.queryDate = '2023-01-01'
    manageAnalysisStore.fuzzySearch = true
    manageAnalysisStore.useCustomList = true
    manageAnalysisStore.stepType = 'someStep'
    manageAnalysisStore.detailType = 'someDetail'
    manageAnalysisStore.apiDraw = 2
    manageAnalysisStore.apiStart = 10
    manageAnalysisStore.apiLength = 20
    manageAnalysisStore.apiRecordsTotal = 50
    manageAnalysisStore.querySortRule.sort = 'someSort'
    manageAnalysisStore.querySortRule.order = 'ASC'
    manageAnalysisStore.deatilRangeDate = 'someDateRange1'
    manageAnalysisStore.stepTrendRangeDate = 'someDateRange2'
    manageAnalysisStore.filterTimestamp = 123433
    manageAnalysisStore.filterDateTimestamp = 223451
    manageAnalysisStore.filterDateStepTrendTimestamp = 273532
    manageAnalysisStore.filterCustomUserList = ['user1', 'user2']

    expect(manageAnalysisStore.searchName).toStrictEqual('Julia')
    expect(manageAnalysisStore.queryDate).toStrictEqual('2023-01-01')
    expect(manageAnalysisStore.fuzzySearch).toBe(true)
    expect(manageAnalysisStore.useCustomList).toBe(true)
    expect(manageAnalysisStore.stepType).toStrictEqual('someStep')
    expect(manageAnalysisStore.detailType).toStrictEqual('someDetail')
    expect(manageAnalysisStore.apiDraw).toBe(2)
    expect(manageAnalysisStore.apiStart).toBe(10)
    expect(manageAnalysisStore.apiLength).toBe(20)
    expect(manageAnalysisStore.apiRecordsTotal).toBe(50)
    expect(manageAnalysisStore.querySortRule.sort).toStrictEqual('someSort')
    expect(manageAnalysisStore.querySortRule.order).toStrictEqual('ASC')
    expect(manageAnalysisStore.deatilRangeDate).toStrictEqual('someDateRange1')
    expect(manageAnalysisStore.stepTrendRangeDate).toStrictEqual('someDateRange2')
    expect(manageAnalysisStore.filterTimestamp).toStrictEqual(123433)
    expect(manageAnalysisStore.filterDateTimestamp).toStrictEqual(223451)
    expect(manageAnalysisStore.filterDateStepTrendTimestamp).toStrictEqual(273532)
    expect(manageAnalysisStore.filterCustomUserList).toStrictEqual(['user1', 'user2'])
  })
})
