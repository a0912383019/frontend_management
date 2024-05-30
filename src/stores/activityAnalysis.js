import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { i18n } from '@/global/i18n'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import { formatDateDuration } from '@/utils/commonUtils.js'

export const useActivityAnalysisStore = defineStore('activityAnalysis', () => {
  const { t } = i18n.global

  const { date_range_picker_config_1 } = useDateStore()

  //   const tagGroupList = ref([])

  //   const targetNameRule = computed(() => {
  //     return [
  //       { required: true, message: t('target_group_analysis.blank_target_group_name_error_msg') },
  //       { validator: validateTargetName, trigger: 'blur' }
  //     ]
  //   })

  //   const validateTargetName = (rule, value, callback) => {
  //     if (value.trim() === '') {
  //       callback(new Error(t('target_group_analysis.blank_target_group_name_error_msg')))
  //     } else if (value.trim().length > 20) {
  //       callback(new Error(t('target_group_analysis.target_group_name_length_limit_error_msg')))
  //     } else {
  //       callback()
  //     }
  //   }

  const searchDate = ref(
    formatDateDuration(
      dayjs(date_range_picker_config_1.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_1.endDate).format('YYYY-MM-DD')
    )
  )

  const searchActivity = ref('')

  const filtered = ref(0)

  const initFilter = () => {
    filtered.value = 0
    searchActivity.value = ''
    searchDate.value = formatDateDuration(
      dayjs(date_range_picker_config_1.startDate).format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs(date_range_picker_config_1.endDate).format('YYYY-MM-DD')
    )
  }

  return { searchDate, searchActivity, filtered, initFilter }
})
