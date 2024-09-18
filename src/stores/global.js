import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import {
  RFM_NAPL_step_config,
  iconStep,
  user_types,
  user_type_dict,
  user_status_dict
} from '@/../public/js/system_config.js'
import { i18n } from '@/global/i18n'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const { t } = i18n.global
    // loading顯示狀態
    const isLoading = ref(false)

    // 給使用到 generateTagsBadage的組件做切換廳判斷
    const hallChange = ref(false)

    // 切換廳需區分是否從首頁切
    const lastRoute = ref('')

    const storeHandleApiError = () => {
      const router = useRouter()
      //當api錯誤時，會執行的內容
      //清除所有sessionStorage與localStorage
      sessionStorage.clear()
      localStorage.clear()
      router.push({ name: 'Login' })
    }

    // 當前選取的廳別
    const activeHall = reactive({
      hall_name: '',
      hall_code: ''
    })

    // lobby_group
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

    // 階段資料config
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

    // 使用者config
    // const general_user = 0 // 一般使用者
    // const advanced_user = 1 // 進階使用者
    // const hall_admin = 8 // 遊戲廳管理員
    // const system_admin = 9 // 系統管理員
    // const gm_user = -1;  // GM

    const userTypeConfig = computed(() => {
      const config = user_type_dict
      config[user_types.general_user] = t('user_detail_info.user_type_0')
      config[user_types.advanced_user] = t('user_detail_info.user_type_1')
      config[user_types.hall_admin] = t('user_detail_info.user_type_8')
      config[user_types.system_admin] = t('user_detail_info.user_type_9')
      config[user_types.gm_user] = 'GM'
      return config
    })

    const userStatusConfig = computed(() => {
      const config = user_status_dict
      config[0] = t('common.enabled')
      config[1] = t('common.disabled')
      return config
    })

    // 活躍度總覽
    const activityStep = computed(() => {
      let activityStep = [
        {
          title: t('member_active_level.active_level_5'),
          icon: iconStep(5).icon,
          bgColor: 'cdp-bg-cadmium__orange-1',
          iconColor: iconStep(5).color,
          icons: []
        },
        {
          title: t('member_active_level.active_level_4'),
          icon: iconStep(4).icon,
          bgColor: 'cdp-bg-glaucous-1',
          iconColor: iconStep(4).color,
          icons: []
        },
        {
          title: t('member_active_level.active_level_3'),
          icon: iconStep(3).icon,
          bgColor: 'cdp-bg-forest__green__crayola-1',
          iconColor: iconStep(3).color,
          icons: []
        },
        {
          title: t('member_active_level.active_level_2'),
          icon: iconStep(2).icon,
          bgColor: 'cdp-bg-indian__red-1',
          iconColor: iconStep(2).color,
          icons: []
        },
        {
          title: t('member_active_level.active_level_1'),
          icon: iconStep(1).icon,
          bgColor: 'cdp-bg-amethyst-1',
          iconColor: iconStep(1).color,
          icons: []
        },
        {
          title: t('member_active_level.active_level_0'),
          icon: iconStep(0).icon,
          bgColor: 'cdp-bg-light__slate__gray-1',
          iconColor: iconStep(0).color,
          icons: []
        }
      ]

      let icons = activityStep.map((ele) => {
        return {
          icon: ele.icon,
          iconColor: ele.iconColor
        }
      })
      activityStep.forEach((ele) => {
        ele.icons = icons
      })

      return activityStep
    })

    const systemConfigIsOk = ref(0)

    const currencySign = '¥'

    return {
      isLoading,
      storeHandleApiError,
      activeHall,
      lobbyGroupConfig,
      tableConfig,
      systemConfigIsOk,
      activityStep,
      hallChange,
      lastRoute,
      userTypeConfig,
      userStatusConfig,
      currencySign
    }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['activeHall']
    }
  }
)
