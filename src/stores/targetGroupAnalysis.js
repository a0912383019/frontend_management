import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { i18n } from '@/global/i18n'

export const useTargetGroupStore = defineStore('targetGroupAnalysis', () => {
  const { t } = i18n.global

  const tagGroupList = ref([])

  const targetNameRule = computed(() => {
    return [
      { required: true, message: t('target_group_analysis.blank_target_group_name_error_msg') },
      { validator: validateTargetName, trigger: 'blur' }
    ]
  })

  const validateTargetName = (rule, value, callback) => {
    if (value.trim() === '') {
      callback(new Error(t('target_group_analysis.blank_target_group_name_error_msg')))
    } else if(value.trim().length >20) {
      callback(new Error(t('target_group_analysis.target_group_name_length_limit_error_msg')))
    } else {
      callback()
    }
  }

  return { tagGroupList ,targetNameRule }
})
