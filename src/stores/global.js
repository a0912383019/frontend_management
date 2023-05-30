import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  //loading顯示狀態
  const isLoading = ref(false)

  //當前選取的廳別
  const activeHall = reactive({
    hall_name: '',
    hall_code: ''
  })

  return { isLoading, activeHall }
})
