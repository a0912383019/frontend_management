import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActivityAnalysisStore = defineStore('activityAnalysis', () => {
  const searchActivity = ref('')

  const filtered = ref(0)

  const initFilter = () => {
    filtered.value = 0
    searchActivity.value = ''
  }

  // 用來監聽是否新增或是修改活動
  const activityAddChange = 0

  return { searchActivity, filtered, initFilter, activityAddChange }
})
