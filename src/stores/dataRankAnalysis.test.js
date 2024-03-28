import { it, describe, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataRankAnalysisStore, useDateStore } from '@/stores'
import { dayjs } from 'element-plus'
import { formatDateDuration } from '@/utils/commonUtils.js'

describe('useDataRankAnalysisStore', () => {
  let profitIsSearchedAgainNum
  let growthDecayAgainNum
  let betAmountFilter
  let profitFilter
  let growthDecayFilter
  let rankStore
  let date_range_picker_config_8
  let date_range_picker_config_9
  let initDate

  beforeEach(() => {
    setActivePinia(createPinia())
    rankStore = useDataRankAnalysisStore()
    betAmountFilter = rankStore.betAmountFilter
    profitFilter = rankStore.profitFilter
    growthDecayFilter = rankStore.growthDecayFilter

    const dateStore = useDateStore()
    date_range_picker_config_8 = dateStore.date_range_picker_config_8
    date_range_picker_config_9 = dateStore.date_range_picker_config_9

    initDate = formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    )
  })

  // filter: 貨量排名
  it('betAmountFilter', () => {
    expect(betAmountFilter.searchDate).toBe(initDate)
    expect(betAmountFilter.rank).toStrictEqual(10)
  })

  // filter: 正/負盈利排名
  it('profitFilter', () => {
    expect(profitFilter.searchDate).toBe(initDate)
    expect(profitFilter.rank).toStrictEqual(10)
    expect(rankStore.profitIsSearchedAgainNum).toStrictEqual(0)
  })

  // filter: 貨量成長/衰退排名
  it('growthDecayFilter', () => {
    expect(growthDecayFilter.financialMonth).toBe(dayjs(date_range_picker_config_9.startDate).format('MM'))
    expect(growthDecayFilter.financialWeek).toStrictEqual(1)
    expect(growthDecayFilter.financialYear).toBe(dayjs(date_range_picker_config_9.startDate).format('YYYY'))
    expect(growthDecayFilter.searchDate).toBe(dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'))
    expect(growthDecayFilter.rank).toStrictEqual(10)
    expect(growthDecayFilter.isFirst).toBeTruthy()
    expect(rankStore.growthDecayAgainNum).toStrictEqual(0)
  })

  it('resetState', async () => {
    const newDate = '2024-03-02 ~ 2024-03-24'
    betAmountFilter.searchDate = newDate
    betAmountFilter.rank = 20
    growthDecayFilter.financialMonth = '03'
    growthDecayFilter.financialWeek = 4
    growthDecayFilter.financialYear = '2024'
    growthDecayFilter.searchDate = '2024-03'
    growthDecayFilter.rank = 50
    growthDecayFilter.isFirst = false
    rankStore.growthDecayAgainNum = 4
    profitFilter.searchDate = newDate
    profitFilter.rank = 20
    rankStore.profitIsSearchedAgainNum = 6

    // 確認資料是否改變成功
    expect(betAmountFilter.searchDate).toBe(newDate)
    expect(betAmountFilter.rank).toStrictEqual(20)
    expect(growthDecayFilter.financialMonth).toStrictEqual('03')
    expect(growthDecayFilter.financialWeek).toStrictEqual(4)
    expect(growthDecayFilter.financialYear).toStrictEqual('2024')
    expect(growthDecayFilter.searchDate).toStrictEqual('2024-03')
    expect(growthDecayFilter.rank).toStrictEqual(50)
    expect(growthDecayFilter.isFirst).toBeFalsy()
    expect(rankStore.growthDecayAgainNum).toStrictEqual(4)
    expect(profitFilter.searchDate).toStrictEqual(newDate)
    expect(profitFilter.rank).toStrictEqual(20)
    expect(rankStore.profitIsSearchedAgainNum).toStrictEqual(6)

    // 確認資料是否重置
    await rankStore.resetState()
    expect(betAmountFilter.searchDate).toBe(initDate)
    expect(betAmountFilter.rank).toStrictEqual(10)
    expect(growthDecayFilter.financialMonth).toStrictEqual(dayjs(date_range_picker_config_9.startDate).format('MM'))
    expect(growthDecayFilter.financialWeek).toStrictEqual(1)
    expect(growthDecayFilter.financialYear).toStrictEqual(dayjs(date_range_picker_config_9.startDate).format('YYYY'))
    expect(growthDecayFilter.searchDate).toStrictEqual(dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'))
    expect(growthDecayFilter.rank).toStrictEqual(10)
    expect(growthDecayFilter.isFirst).toBeTruthy()
    expect(rankStore.growthDecayAgainNum).toStrictEqual(0)
    expect(profitFilter.searchDate).toStrictEqual(initDate)
    expect(profitFilter.rank).toStrictEqual(10)
    expect(rankStore.profitIsSearchedAgainNum).toStrictEqual(0)
  })
})
