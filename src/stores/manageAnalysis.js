//單元：會員經營分析
import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'

const { date_range_picker_config_1, date_range_picker_config_4 } = useDateStore()

export const useManageAnalysisStore = defineStore('manageAnalysis', () => {
  //會員階段人數變化，進階篩選內的欄位資料
  const searchName = ref('') //搜尋的名稱
  const queryDate = dayjs(date_range_picker_config_4['startDate']).format('YYYY-MM-DD') //查詢日期
  const useCustomList = ref(false) //手動匯入名單
  const fuzzySearch = ref(false) //模糊搜尋

  //對應api query_life_cycle_analysis_avg_data 的life_cycle_analysis_step和detail_type欄位
  const stepType = ref(null) //life_cycle_analysis_step
  const detailType = ref(null) //detail_type

  //會員生命週期日期區間
  const deatilRangeDate = ref(
    formatDateDuration(
      dayjs(date_range_picker_config_1['startDate']).format('YYYY-MM-DD') +
        '~' +
        dayjs(date_range_picker_config_1['endDate']).format('YYYY-MM-DD')
    )
  )

  //趨勢分析日期區間
  const stepTrendRangeDate = ref(
    formatDateDuration(
      dayjs(date_range_picker_config_1['startDate']).format('YYYY-MM-DD') +
        '~' +
        dayjs(date_range_picker_config_1['endDate']).format('YYYY-MM-DD')
    )
  )

  const filterTimestamp = ref(new Date().getTime()) //FilterMemberName.vue的時間戳，供其他組件監聽，當有變化時做相對的處理

  const filterDateTimestamp = ref(new Date().getTime()) //階段總覽FilterDate.vue的時間戳

  const filterDateStepTrendTimestamp = ref(new Date().getTime()) //趨勢分析FilterDate.vue的時間戳

  const filterCustomUserList = ref([])

  return {
    searchName,
    queryDate,
    fuzzySearch,
    useCustomList,
    stepType,
    detailType,
    deatilRangeDate,
    stepTrendRangeDate,

    filterTimestamp,
    filterDateTimestamp,
    filterDateStepTrendTimestamp,

    filterCustomUserList
  }
})
