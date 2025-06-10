import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRegisteredNoDepositAnalysisStore = defineStore(
  'registeredNoDepositAnalysis',
  () => {
    // 目前存款狀態
    const selectDepositValue = ref('all')

    // IP重複次數
    const slideVlaue = ref([0, 10])
    const ipDuplicateRange = ref(slideVlaue.value.join(';'))

    return {
      selectDepositValue,
      slideVlaue,
      ipDuplicateRange
    }
  }
)
