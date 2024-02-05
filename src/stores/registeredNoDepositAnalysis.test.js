import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegisteredNoDepositAnalysisStore } from '@/stores/registeredNoDepositAnalysis.js'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

describe('useRegisteredNoDepositAnalysisStore', () => {
  const date = new Date(2000, 1, 1, 13)

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(date)
    vi.mock('@/stores/dateConfig.js', () => ({
      useDateStore: vi.fn()
    }))
    const mockLastDate = {
      date_range_picker_config_8: {
        startDate: dayjs('2023-12-14').add(1, 'day').subtract(1, 'month'),
        endDate: dayjs('2023-12-14')
      }
    }
    useDateStore.mockReturnValue(mockLastDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with correct values', () => {
    const store = useRegisteredNoDepositAnalysisStore()

    expect(store.selectDepositValue).toBe('all')
    expect(store.deatilRangeDate).toBe('2023-11-15 ~ 2023-12-14')
    expect(store.slideVlaue).toStrictEqual([0, 10])
    expect(store.ipDuplicateRange).toBe('0;10')
  })
})
