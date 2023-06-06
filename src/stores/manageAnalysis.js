import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { date_range_picker_config_4 } from '@/utils/dateConfig.js'

export const useManageAnalysisStore = defineStore('manageAnalysis', () => {
  //會員階段人數變化，進階篩選內的欄位資料
  const searchName = ref('') //搜尋的名稱
  const queryDate = dayjs(date_range_picker_config_4['startDate']).format('YYYY-MM-DD') //查詢日期
  const fuzzySearch = ref(false) //模糊搜尋
  const useCustomList = ref(false) //手動匯入名單
  const stepType = ref(null)
  const detailType = ref(null)

  return { searchName, queryDate, fuzzySearch, useCustomList, stepType, detailType }
})
