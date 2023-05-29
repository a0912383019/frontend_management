import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isLoading = ref(false)

  const activeHall = reactive({
    hall_name: '',
    hall_code: ''
  })

  return { isLoading, activeHall }
})
