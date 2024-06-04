import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { i18n } from '@/global/i18n'
// import { dayjs } from 'element-plus'
// import { useDateStore } from '@/stores/dateConfig.js'
// import { formatDateDuration } from '@/utils/commonUtils.js'

export const useActivityAnalysisStore = defineStore('activityAnalysis', () => {
  // const { t } = i18n.global

  // const { date_range_picker_config_1 } = useDateStore()

  const searchActivity = ref('')

  const filtered = ref(0)

  const initFilter = () => {
    filtered.value = 0
    searchActivity.value = ''
  }

  return { searchActivity, filtered, initFilter }
})
