import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'

export const useDataRankAnalysisStore = defineStore('dataRankAnalysis', () => {
  const { date_range_picker_config_8, date_range_picker_config_9 } = useDateStore()

  // filter: 貨量排名
  const betAmountFilter = reactive({
    searchDate: formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    ),
    rank: 10
  })

  // filter: 貨量成長/衰退排名
  const growthDecayFilter = reactive({
    financialMonth: dayjs(date_range_picker_config_9.startDate).format('MM'),
    financialWeek: 1,
    financialYear: dayjs(date_range_picker_config_9.startDate).format('YYYY'),
    searchDate: dayjs(date_range_picker_config_9.startDate).format('YYYY-MM'),
    rank: 10
  })

  // 重置資料
  const resetState = () => {
    betAmountFilter.searchDate = formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    )
    betAmountFilter.rank = 10
  }

  return {
    betAmountFilter,
    growthDecayFilter,
    resetState
  }
})
