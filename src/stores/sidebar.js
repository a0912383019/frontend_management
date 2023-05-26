import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSessionStorageEntity } from '@/utils/commonUtils'

export const useSidebarStore = defineStore(
  'store_sidebar',
  () => {
    const menuLists = ref([]) //存放menu資料
    //整理storage選單資料
    const generateSidebarMenu = () => {
      // 依據使用者選取的取廳別產生對應的sidebar廳別功能
      menuLists.value = []
      const storageMenu = getSessionStorageEntity('system_config').menu_config
      menuLists.value = storageMenu.map((item) => {
        return {
          ...item,
          nav_icon: item.nav_icon.split(' ')[1],
          prefix_icon: item.nav_icon.split(' ')[0]
        }
      })
    }

    const isSidebarClose = ref(false) //sidebar預設開啟
    const toggleSidebarOpen = () => {
      isSidebarClose.value = !isSidebarClose.value
    }
    return { menuLists, generateSidebarMenu, isSidebarClose, toggleSidebarOpen }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['isSidebarClose']
    }
  }
)
