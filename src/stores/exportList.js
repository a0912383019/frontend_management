import { defineStore } from 'pinia'
import { useGlobalStore } from '@/stores'
import { apiQueryAgNameUserLevel } from '@/api'
import { ref, reactive } from 'vue'

export const useExportListStore = defineStore('exportList', () => {
  const globalStore = useGlobalStore()

  const levelList = ref([])

  // 取得代理帳號和會員層級
  const queryAgNameUserLevel = async () => {
    const { activeHall } = globalStore
    levelList.value = []
    try {
      const result = await apiQueryAgNameUserLevel({
        hall_name: activeHall.hall_code
      })
      const { return_code } = result.data.status
      if (return_code === '0000') {
        // 會員層級
        let { user_level } = result.data.result
        user_level.forEach((item) => {
          levelList.value[item.user_level_id] = item.user_level_name
        })
      } else {
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } catch (error) {
      console.error(error)
      if (error.response.status === 401) {
        globalStore.storeHandleApiError()
      }
    }
  }

  const tag_description_dict = reactive({ hall: {} })
  return { queryAgNameUserLevel, levelList, tag_description_dict }
})
