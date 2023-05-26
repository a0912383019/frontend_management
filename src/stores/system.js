import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { apiLogout } from '@/api/system.js'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'

export const useSystemStore = defineStore('system', () => {
  const globalStore = useGlobalStore()
  const { t } = useI18n()
  const router = useRouter()
  async function storeLogout() {
    console.log('logout')
    globalStore.isLoading = true
    try {
      const reslut = await apiLogout()
      console.log(reslut)
      router.push({ name: 'Login' })
      ElNotification({
        title: '',
        message: t('msg.logout'),
        type: 'success'
      })
    } catch (error) {
      router.push({ name: 'Login' })
    }
    globalStore.isLoading = false
    // 不管logout的ajax成功或失敗，都清除所有sessionStorage與localStorage
    sessionStorage.clear()
    localStorage.clear()
  }

  return { storeLogout }
})
