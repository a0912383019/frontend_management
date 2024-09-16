import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import { useGlobalStore, useSidebarStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiLogout, apiHalls } from '@/api'
import { apiRefresh, apiGoRefresh, apiGetSystemConfig } from '@/api/system.js'
import { i18n } from '@/global/i18n'
import { errorRespond, getSessionStorageEntity } from '@/utils/commonUtils.js'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const router = useRouter()
  const globalStore = useGlobalStore()
  const sidebarStore = useSidebarStore()
  const vipCommercialAnalysisStore = useVipCommercialAnalysisStore()
  const { t, locale: i18nLocale } = i18n.global

  const storeLogout = async () => {
    globalStore.isLoading = true
    try {
      await apiLogout()
      ElNotification({
        title: '',
        message: t('msg.logout'),
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    } finally {
      globalStore.isLoading = false

      // 登出後，讓 pinia 資料回覆預設值
      vipCommercialAnalysisStore.resetState()

      // 不管logout的ajax成功或失敗，都清除所有sessionStorage與localStorage
      sessionStorage.clear()
      localStorage.clear()
      router.push({ name: 'Login' })
    }
  }

  // call system config
  const storeGetSystemConfig = async (fromRoute = 1, simulate = false) => {
    // global hall_code 為空，從sessionStorage user_info中取得資料中的第一個廳別
    // 模擬畫面需要重新抓取，因為每個使用者的hall 不一樣
    if (globalStore.activeHall.hall_code === '' || simulate) {
      let { access_hall } = getSessionStorageEntity('user_info')
      let accessHalls = access_hall.split(',')
      let hall_name, hall_code

      // 取得第一個有效的廳
      for (let i = 0; i < accessHalls.length; i++) {
        if (
          hallConfigDict.value[accessHalls[i]]
        ) {
          const { hall_name: hn, hall_code: hc } = hallConfigDict.value[accessHalls[i]]
          hall_name = hn
          hall_code = hc
          break
        }
      }
      globalStore.activeHall.hall_name = hall_name
      globalStore.activeHall.hall_code = hall_code
    }
    try {
      const result = await apiGetSystemConfig({
        hall_name: globalStore.activeHall.hall_code,
        locale: i18nLocale.value
      })
      const { return_code } = result.data.status
      if (return_code === '0000') {
        sessionStorage.setItem('system_config', JSON.stringify(result.data.result))
        globalStore.systemConfigIsOk = fromRoute === 0 ? 0 : Math.floor(Math.random() * 1000)
        sidebarStore.generateSidebarMenu() // 更新sidebar item
        return true
      } else {
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
        return false
      }
    } catch (error) {
      console.error(error)
      sessionStorage.clear()
      localStorage.clear()
      router.push({ name: 'Login' })
      return false
    }
  }

  // call refreshToken
  const storeRefreshToken = async () => {
    globalStore.isLoading = true
    try {
      const [phpResponse, goResponse] = await Promise.all([apiRefresh(), apiGoRefresh()])
      const { return_code: phpReturnCode } = phpResponse.data.status
      const { return_code: goReturnCode } = goResponse.data.status
      const { access_token: phpAccessToken } = phpResponse.data
      const {
        user_type,
        access_hall,
        token_type,
        access_token: goAccessToken
      } = goResponse.data.result
      globalStore.isLoading = false
      if (phpReturnCode === '0000' && goReturnCode === '0000') {
        let user_info_entity = getSessionStorageEntity('user_info')
        user_info_entity.user_type = user_type // 更新使用者身份權限
        user_info_entity.access_hall = access_hall // 更新使用者可存取廳別
        sessionStorage.setItem('user_info', JSON.stringify(user_info_entity))
        sessionStorage.access_token = token_type + ' ' + phpAccessToken // 將新取得的access_token更新至sessionStorage
        sessionStorage.access_token_go = token_type + ' ' + goAccessToken // 將新取得的access_token更新至sessionStorage
        return Promise.resolve(true) //表示Promise物件執行成功，可往下繼續執行
      } else {
        return Promise.reject(false) //表示Promise物件執行失敗，拒絕後續的程式執行
      }
    } catch (error) {
      console.error(error)
      globalStore.isLoading = false
      if (error.response.status === 401) {
        // 若api回應401 http error code，導至登入頁
        sessionStorage.clear()
        localStorage.clear()
        router.push({ name: 'Login' })
        let failMsg = `${error.response.status} : ${error.response.data.message}`
        return Promise.reject(failMsg) //表示Promise物件執行失敗，拒絕後續的程式執行
      }
      return Promise.reject(error)
    }
  }

  const hallConfigDict = ref({})
  const queryHalls = async () => {
    hallConfigDict.value = []
    try {
      const result = await apiHalls()

      const { return_code } = result.data.status
      if (return_code === '0000' && result.data.result.length !== 0) {
        hallConfigDict.value = transformHallDict(result.data.result)
      } else {
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } catch (error) {
      console.error(error)
      if (error.response.status === 401) {
        sessionStorage.clear()
        localStorage.clear()
        router.push({ name: 'Login' })
      }
    }
  }

  const transformHallDict = (data) => {
    let hallDict = {}
    data.forEach((ele) => {
      hallDict[ele.login_code] = {
        hall_name: ele.name,
        hall_code: ele.login_code,
        hall_id: ele.hall_id
      }
    })

    return hallDict
  }

  const makeSystemConfig = async (fromRoute = 1, simulate = false) => {
    globalStore.isLoading = true // 顯示Loading視窗
    await queryHalls()
    await storeGetSystemConfig(fromRoute, simulate)
    globalStore.isLoading = false
  }

  return {
    storeLogout,
    storeGetSystemConfig,
    storeRefreshToken,
    queryHalls,
    makeSystemConfig,
    hallConfigDict
  }
})
