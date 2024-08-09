import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useGlobalStore } from '@/stores'

export const useUserAccountSettingStore = defineStore('userAccountSetting', () => {
  const globalStore = useGlobalStore()

  const selectUserTypeOptions = computed(() => {
    return appendOptions(globalStore.userTypeConfig)
  })

  const selectUserStatusOptions = computed(() => {
    return appendOptions(globalStore.userStatusConfig)
  })

  const appendOptions = (obj) => {
    let options = []
    const keys = Object.keys(obj)

    keys.forEach((key) => {
      options.push({
        value: key,
        label: obj[key]
      })
    })

    return options
  }

  return { selectUserTypeOptions, selectUserStatusOptions }
})
