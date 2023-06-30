import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const { t } = useI18n()
    const router = useRouter()
    //loading顯示狀態
    const isLoading = ref(false)

    const storeHandleApiError = () => {
      //當api錯誤時，會執行的內容
      // 清除所有sessionStorage與localStorage
      sessionStorage.clear()
      localStorage.clear()
      sessionStorage.access_token = '9999' // 9999表示token有誤，需重新登入取得新token
      router.push({ name: 'Login' })
    }

    //當前選取的廳別
    const activeHall = reactive({
      hall_name: '',
      hall_code: ''
    })

    //階段資料config
    const tableConfig = computed(() => {
      const config = RFM_NAPL_step_config
      config[1]['step_name'] = t('member_life_cycles.active')
      config[2]['step_name'] = t('member_life_cycles.newBorn')
      config[3]['step_name'] = t('member_life_cycles.growing')
      config[4]['step_name'] = t('member_life_cycles.churning_return')
      config[5]['step_name'] = t('member_life_cycles.churned_return')
      config[6]['step_name'] = t('member_life_cycles.churning')
      config[7]['step_name'] = t('member_life_cycles.churned')
      return config
    })

    return { isLoading, storeHandleApiError, activeHall, tableConfig }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['activeHall']
    }
  }
)
