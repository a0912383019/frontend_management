import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTargetGroupStore = defineStore('targetGroupAnalysis', () => {
  const tagGroupList = ref([])

  return { tagGroupList }
})
