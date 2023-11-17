import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import { i18n } from '@/global/i18n'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const { t } = i18n.global
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

    //lobby_group
    const lobbyGroupConfig = computed(() => {
      const config = {}
      config['live'] = t('lobby_group.live')
      config['prob'] = t('lobby_group.prob')
      config['card'] = t('lobby_group.card')
      config['sport'] = t('lobby_group.sport')
      config['lottery'] = t('lobby_group.lottery')
      config['mahjong'] = t('lobby_group.mahjong')
      return config
    })

    //階段資料config
    const tableConfig = computed(() => {
      const config = RFM_NAPL_step_config
      config[null]['step_name'] = t('member_life_cycles.unclassified')
      config[null]['step_description'] = t('member_life_cycles.unclassified')
      config[0]['step_name'] = t('member_life_cycles.unregistered')
      config[1]['step_name'] = t('member_life_cycles.active')
      config[1]['step_description'] = t('member_life_cycles.active_description')
      config[2]['step_name'] = t('member_life_cycles.newBorn')
      config[2]['step_description'] = t('member_life_cycles.newBorn_description')
      config[3]['step_name'] = t('member_life_cycles.growing')
      config[3]['step_description'] = t('member_life_cycles.growing_description')
      config[4]['step_name'] = t('member_life_cycles.churning_return')
      config[4]['step_description'] = t('member_life_cycles.churning_return_description')
      config[5]['step_name'] = t('member_life_cycles.churned_return')
      config[5]['step_description'] = t('member_life_cycles.churned_return_description')
      config[6]['step_name'] = t('member_life_cycles.churning')
      config[6]['step_description'] = t('member_life_cycles.churning_description')
      config[7]['step_name'] = t('member_life_cycles.churned')
      config[7]['step_description'] = t('member_life_cycles.churned_description')
      return config
    })

    const systemConfigIsOk = ref(0)

    return {
      isLoading,
      storeHandleApiError,
      activeHall,
      lobbyGroupConfig,
      tableConfig,
      systemConfigIsOk
    }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['activeHall']
    }
  }
)
