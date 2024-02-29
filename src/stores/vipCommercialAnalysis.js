import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'

export const useVipCommercialAnalysisStore = defineStore('vipCommercialAnalysis', () => {
  const { date_range_picker_config_4, date_range_picker_config_8, date_range_picker_config_9 } =
    useDateStore()

  // vip tag 初始值
  const defaultVipTag = '10001,10003'

  // 星期初始值
  const defaultWeeks = '1,2,3,4,5,6,7'

  // filter: 活躍度分析
  const livelyAnalysisFilter = reactive({
    searchName: '',
    searchDate: dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD'),
    custom: false,
    vipTag: defaultVipTag,
    customUserList: [],
    fuzzySearch: false
  })

  // filter: 活躍時段分析
  const activeTimeAnalysisFilter = reactive({
    searchName: '',
    searchDate: formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    ),
    custom: false,
    containWeeks: defaultWeeks,
    vipTag: defaultVipTag,
    customUserList: [],
    fuzzySearch: false
  })

  // filter: 週報表
  const weekReportFilter = reactive({
    financialMonth: dayjs(date_range_picker_config_9.startDate).format('MM'),
    financialWeek: 1,
    financialYear: dayjs(date_range_picker_config_9.startDate).format('YYYY'),
    date: dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'),
    vipTag: defaultVipTag
  })

  // filter: 週統計報表
  const weekTotalReportFilter = reactive({
    startDate: dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'),
    endDate: dayjs(date_range_picker_config_9.endDate).format('YYYY-MM'),
    vipTag: defaultVipTag
  })

  // 重置資料
  const resetState = () => {
    livelyAnalysisFilter.searchDate = dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD')

    weekTotalReportFilter.startDate = dayjs(date_range_picker_config_9.startDate).format('YYYY-MM')
    weekTotalReportFilter.endDate = dayjs(date_range_picker_config_9.endDate).format('YYYY-MM')
  }

  return {
    defaultVipTag,
    defaultWeeks,
    livelyAnalysisFilter,
    activeTimeAnalysisFilter,
    weekReportFilter,
    weekTotalReportFilter,
    resetState
  }
})
