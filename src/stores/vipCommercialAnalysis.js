import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'

export const useVipCommercialAnalysisStore = defineStore('vipCommercialAnalysis', () => {
  const { date_range_picker_config_4, date_range_picker_config_9 } = useDateStore()

  // vip tag 初始值
  const defaultVipTag = '10001,10003'

  // filter: 活躍度分析
  const livelyAnalysisFilter = reactive({
    member: '',
    date: dayjs(date_range_picker_config_4['endDate']).format('YYYY-MM-DD'),
    custom: false,
    searchTag: defaultVipTag,
    custom_user_list: [],
    fuzzySearch: false
  })

  // filter: 週統計報表
  const weekTotalReportFilter = reactive({
    start_date: dayjs(date_range_picker_config_9['startDate']).format('YYYY-MM'),
    end_date: dayjs(date_range_picker_config_9['endDate']).format('YYYY-MM'),
    vip_tag: defaultVipTag
  })

  // 重置資料
  const resetState = () => {
    livelyAnalysisFilter['date'] = dayjs(date_range_picker_config_4['endDate']).format('YYYY-MM-DD')

    weekTotalReportFilter['start_date'] = dayjs(date_range_picker_config_9['startDate']).format(
      'YYYY-MM'
    )
    weekTotalReportFilter['end_date'] = dayjs(date_range_picker_config_9['endDate']).format(
      'YYYY-MM'
    )
  }

  return {
    defaultVipTag,
    livelyAnalysisFilter,
    weekTotalReportFilter,
    resetState
  }
})
