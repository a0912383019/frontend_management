import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'

export const useVipCommercialAnalysisStore = defineStore('vipCommercialAnalysis', () => {
  const { date_range_picker_config_4 } = useDateStore()

  // filter: 活躍度分析
  const livelyAnalysisFilter = reactive({
    member: '',
    date: dayjs(date_range_picker_config_4['endDate']).format('YYYY-MM-DD'),
    custom: false,
    searchTag: '10001,10003',
    fuzzySearch: false
  })

  return {
    livelyAnalysisFilter
  }
})
