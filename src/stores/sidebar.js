import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSessionStorageEntity } from '@/utils/commonUtils'

export const useSidebarStore = defineStore(
  'store_sidebar',
  () => {
    const mockMenuUrlPathData = [
      {
        item_name: '首頁',
        url_path: 'home'
      },
      {
        item_name: '會員標籤查詢',
        url_path: 'customer-tag-list'
      },
      {
        item_name: '會員經營分析',
        url_path: 'manage-analysis'
      },
      {
        item_name: '存款機率預測',
        url_path: 'registered-no-deposit-analysis'
      },
      {
        item_name: 'VIP營運分析',
        url_path: 'vip-commercial-analysis'
      },
      {
        item_name: '目標族群分析',
        url_path: 'target-group-analysis-list'
      },
      {
        item_name: '遊戲標籤分析',
        url_path: 'game-tag-analysis'
      },
      {
        item_name: '活動成效分析',
        url_path: 'activity-analysis-list'
      },
      {
        item_name: '優惠成效分析',
        url_path: 'offer-analysis-list'
      },
      {
        item_name: '數據排名分析',
        url_path: 'rank-analysis'
      },
      {
        item_name: '自訂標籤設置',
        url_path: 'custom-tags-setting'
      },
      {
        item_name: '標籤同步管理',
        url_path: 'tag-synchronization'
      },
      {
        item_name: '匯出報表清單',
        url_path: 'user-export-report'
      },
      {
        item_name: '帳戶資訊',
        url_path: 'user-detail-info'
      },
      {
        item_name: '使用者帳戶管理',
        url_path: 'admin-user-list'
      }
    ]

    const getMockMenuUrlPath = (data) => {
      return mockMenuUrlPathData.find((item) => {
        return item.item_name === data.item_name
      })
    }

    const menuLists = ref([]) //存放menu資料
    //整理storage選單資料
    const generateSidebarMenu = () => {
      // 依據使用者選取的取廳別產生對應的sidebar廳別功能
      menuLists.value = []
      const storageMenu = getSessionStorageEntity('system_config').menu_config
      menuLists.value = storageMenu.map((item) => {
        return {
          ...item,
          url_path: getMockMenuUrlPath(item).url_path
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
