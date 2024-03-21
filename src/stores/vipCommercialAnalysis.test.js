import { it, describe, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVipCommercialAnalysisStore, useDateStore } from '@/stores'
import { dayjs } from 'element-plus'
import { formatDateDuration } from '@/utils/commonUtils.js'

describe('useVipCommercialAnalysisStore', () => {
  let defaultVipTag
  let defaultWeeks
  let vipStore
  let date_range_picker_config_4
  let date_range_picker_config_8
  let date_range_picker_config_9

  beforeEach(() => {
    setActivePinia(createPinia())
    vipStore = useVipCommercialAnalysisStore()
    defaultVipTag = vipStore.defaultVipTag
    defaultWeeks = vipStore.defaultWeeks
    const dateStore = useDateStore()
    date_range_picker_config_4 = dateStore.date_range_picker_config_4
    date_range_picker_config_8 = dateStore.date_range_picker_config_8
    date_range_picker_config_9 = dateStore.date_range_picker_config_9
  })

  // filter: 活躍度分析
  it('livelyAnalysisFilter', () => {
    let filter = vipStore.livelyAnalysisFilter
    expect(filter.searchName).toBe('')
    expect(filter.searchDate).toBe(dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD'))
    expect(filter.custom).toBeFalsy(),
      expect(filter.vipTag).toBe(defaultVipTag),
      expect(filter.customUserList).toStrictEqual([]),
      expect(filter.fuzzySearch).toBeFalsy(),
      expect(filter.detailType).toBe(null),
      expect(filter.livelyLevel).toBe(null)
  })

  // filter: 活躍時段分析
  it('activeTimeAnalysisFilter', () => {
    let filter = vipStore.activeTimeAnalysisFilter
    expect(filter.searchName).toBe('')
    expect(filter.searchDate).toBe(
      formatDateDuration(
        dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
          ' ~ ' +
          dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
      )
    )
    expect(filter.custom).toBeFalsy()
    expect(filter.containWeeks).toBe(defaultWeeks)
    expect(filter.vipTag).toBe(defaultVipTag)
    expect(filter.customUserList).toStrictEqual([])
    expect(filter.fuzzySearch).toBeFalsy()
  })

  // filter: 日報表
  it('dayReportFilter', () => {
    let filter = vipStore.dayReportFilter
    expect(filter.searchDate).toBe(dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD'))
    expect(filter.vipTag).toBe(defaultVipTag)
  })

  // filter: 週報表
  it('weekReportFilter', () => {
    let filter = vipStore.weekReportFilter
    expect(filter.financialMonth).toBe(dayjs(date_range_picker_config_9.startDate).format('MM'))
    expect(filter.financialWeek).toBe(1)
    expect(filter.financialYear).toBe(dayjs(date_range_picker_config_9.startDate).format('YYYY'))
    expect(filter.date).toBe(dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'))
    expect(filter.vipTag).toBe(defaultVipTag)
  })

  // filter: 週統計報表
  it('weekTotalReportFilter', () => {
    let filter = vipStore.weekTotalReportFilter
    expect(filter.startDate).toBe(dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'))
    expect(filter.endDate).toBe(dayjs(date_range_picker_config_9.endDate).format('YYYY-MM'))
    expect(filter.vipTag).toBe(defaultVipTag)
  })

  it('resetState', async () => {
    await vipStore.resetState()
    expect(vipStore.livelyAnalysisFilter.searchDate).toBe(
      dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD')
    )
    expect(vipStore.dayReportFilter.searchDate).toBe(
      dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD')
    )
    expect(vipStore.weekTotalReportFilter.startDate).toBe(
      dayjs(date_range_picker_config_9.startDate).format('YYYY-MM')
    )
    expect(vipStore.weekTotalReportFilter.endDate).toBe(
      dayjs(date_range_picker_config_9.endDate).format('YYYY-MM')
    )
  })
})
