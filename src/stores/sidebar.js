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
      menuLists.value = storageMenu
        .map((item) => {
          // 待舊版 php捨棄從資料庫移除
          if (item.item_id === 'user_detail_info' || item.item_id === 'tag_synchronization') {
            return null
          }
          return {
            ...item
          }
        })
        .filter(Boolean) // sidebar過濾帳戶資訊(user_detail_info),已移至上方會員名稱下拉,等正式上線後端拿掉欄位即可移除
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
