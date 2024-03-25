import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'

export const useDataRankAnalysisStore = defineStore('dataRankAnalysis', () => {
  const { date_range_picker_config_8 } = useDateStore()

  // 因為正負盈利頁籤共用進階篩選，所以用此參數判斷是否要重打api
  const profitIsSearchedAgainNum = ref(0)

  // filter: 貨量排名
  const betAmountFilter = reactive({
    searchDate: formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    ),
    rank: 10
  })

  // filter: 盈利排名
  const profitFilter = reactive({
    searchDate: formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    ),
    rank: 10
  })

  // 重置資料
  const resetState = () => {
    let latestWeek = formatDateDuration(
      dayjs(date_range_picker_config_8.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_8.endDate).format('YYYY-MM-DD')
    )
    betAmountFilter.searchDate = latestWeek
    betAmountFilter.rank = 10

    profitFilter.searchDate = latestWeek
    profitFilter.rank = 10
    profitIsSearchedAgainNum.value = 0
  }

  return {
    betAmountFilter,
    profitFilter,
    profitIsSearchedAgainNum,
    resetState
  }
})
