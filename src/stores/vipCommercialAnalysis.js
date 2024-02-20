import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'

export const useVipCommercialAnalysisStore = defineStore('vipCommercialAnalysis', () => {
  const { date_range_picker_config_4, date_range_picker_config_9, LAST_DATE } = useDateStore()

  // vip tag 初始值
  const defaultVipTag = '10001,10003'

  // 星期初始值
  const defaultWeeks = '1,2,3,4,5,6,7'

  // filter: 活躍度分析
  const livelyAnalysisFilter = reactive({
    searchName: '',
    searchDate: dayjs(date_range_picker_config_4['endDate']).format('YYYY-MM-DD'),
    custom: false,
    vipTag: defaultVipTag,
    customUserList: [],
    fuzzySearch: false
  })

  const activeTimeAnalysisFilter = reactive({
    searchName: '',
    searchDate:
      dayjs(LAST_DATE).subtract(6, 'day').format('YYYY-MM-DD') +
      ' ~ ' +
      dayjs(LAST_DATE).format('YYYY-MM-DD'),
    custom: false,
    containWeeks: defaultWeeks,
    vipTag: defaultVipTag,
    customUserList: [],
    fuzzySearch: false
  })

  // filter: 週統計報表
  const weekTotalReportFilter = reactive({
    startDate: dayjs(date_range_picker_config_9['startDate']).format('YYYY-MM'),
    endDate: dayjs(date_range_picker_config_9['endDate']).format('YYYY-MM'),
    vipTag: defaultVipTag
  })

  // 重置資料
  const resetState = () => {
    livelyAnalysisFilter.searchDate = dayjs(date_range_picker_config_4['endDate']).format(
      'YYYY-MM-DD'
    )

    weekTotalReportFilter.startDate = dayjs(date_range_picker_config_9['startDate']).format(
      'YYYY-MM'
    )
    weekTotalReportFilter.endDate = dayjs(date_range_picker_config_9['endDate']).format('YYYY-MM')
  }

  return {
    defaultVipTag,
    defaultWeeks,
    livelyAnalysisFilter,
    activeTimeAnalysisFilter,
    weekTotalReportFilter,
    resetState
  }
})
