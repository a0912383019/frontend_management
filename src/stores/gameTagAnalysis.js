// 遊戲標籤分析
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameTagAnalysis = defineStore('gameTagAnalysis', () => {
  const filterFormData = reactive({
    date: '', // 日期
    searchTag: '', //包含標籤
    excludeTag: '' //排除標籤
  })
  const filterTimestamp = ref(new Date().getTime()) //時間戳，供其他組件監聽，當有變化時做相對的處理

  return {
    filterFormData,
    filterTimestamp
  }
})
