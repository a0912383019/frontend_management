import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'

export const useRegisteredNoDepositAnalysis = defineStore('registeredNoDepositAnalysis', () => {
  const { date_range_picker_config_8 } = useDateStore()

  // 目前存款狀態
  const selectDepositValue = ref('all')

  //更新時間日期區間
  const deatilRangeDate = ref(
    formatDateDuration(
      dayjs(date_range_picker_config_8['startDate']).format('YYYY-MM-DD') +
        '~' +
        dayjs(date_range_picker_config_8['endDate']).format('YYYY-MM-DD')
    )
  )

  // IP重複次數
  const slideVlaue = ref([0, 10])
  const ipDuplicateRange = ref(slideVlaue.value.join(';'))

  return {
    deatilRangeDate,
    selectDepositValue,
    slideVlaue,
    ipDuplicateRange
  }
})
