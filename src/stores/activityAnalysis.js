import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'
import { ElNotification } from 'element-plus'
import { i18n } from '@/global/i18n'

export const useActivityAnalysisStore = defineStore('activityAnalysis', () => {
  const { t } = i18n.global

  // 活動成效分析頁籤
  const currentTabs = ref('Overview')

  const searchActivity = ref('')
  const islistFiltered = ref(0)

  // 用來監聽是否新增或是修改活動
  const activityAddChange = 0

  // 活動分析明細-子活動資料
  const childListData = ref([])

  // 活動分析明細-子活動分析->目前選取的子活動
  const currentChildAnalysis = reactive({
    name: null,
    id: null
  })

  // 活動分析明細-子活動分析->進階篩選選項
  const optionChildList = ref(null)

  // 活動分析明細-子活動分析->取得篩選後的子活動
  const findSelectedOption = () => {
    const selectedOption = optionChildList.value.find(
      (option) => option.value === currentChildAnalysis.id
    )
    currentChildAnalysis.name = selectedOption.label
    currentChildAnalysis.id = selectedOption.value
  }

  // 子活動分析-進階篩選
  const isChildFiltered = ref(0)

  // 子活動分析-已獲獎/未獲獎按鈕
  const childActiveView = ref('RewardComponents')

  // 子活動分析-下方頁籤
  const currentDetailTab = ref('Commissionable')

  // 子活動分析-詳細名單-進階篩選
  const searchChildDetailMemberName = ref('')
  const isChildDetailListFiltered = ref(0)

  // 初始化子活動分析
  const initChildData = () => {
    childListData.value = []
    currentChildAnalysis.name = null
    currentChildAnalysis.id = null
    optionChildList.value = null
    isChildFiltered.value = 0
    currentDetailTab.value = 'Commissionable'
    searchChildDetailMemberName.value = ''
    isChildDetailListFiltered.value = 0
    childActiveView.value = 'RewardComponents'
  }

  const chartFiltered = 0
  const { date_range_picker_config_2 } = useDateStore()

  const calculateDayDifference = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    const timeDifference = endDate - startDate // 毫秒差
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24) // 換算為天數
    return dayDifference
  }

  // 成長率 成長差額 總和 -> 各頁籤篩選狀態
  const chartFilteredArr = reactive({
    Overview: { status: 0 },
    GrowthRate: { status: 0 },
    GrowthGap: { status: 0 },
    TotalSum: { status: 0 }
  })

  // 進階篩選options的預設值
  const filterData = reactive({
    selectDuration: 'week',
    analysisDate: '',
    selectReward: 1,
    activityNameList: []
  })

  const chartApiParams = reactive({
    start_date: dayjs(date_range_picker_config_2.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(date_range_picker_config_2.endDate).format('YYYY-MM-DD'),
    cut_type: 'week',
    reward_flag: 1,
    search_activity: []
  })

  const transformChartParams = () => {
    const dateArr = filterData.analysisDate.split('~')
    chartApiParams.start_date = dateArr[0].trim()
    chartApiParams.end_date = dateArr[1].trim()
    chartApiParams.cut_type = filterData.selectDuration
    chartApiParams.reward_flag = filterData.selectReward
    chartApiParams.search_activity = filterData.activityNameList
  }

  // 重置資料
  const resetState = () => {
    islistFiltered.value = 0
    searchActivity.value = ''
    currentTabs.value = 'Overview'

    filterData.chartFiltered = 0
    filterData.selectDuration = 'week'
    filterData.analysisDate = ''
    filterData.selectReward = 1
    filterData.activityNameList = ''
  }

  // 處理時間變化
  const dateRestraintion = (dateRange, optionProxy, filterProxy) => {
    optionProxy.value.forEach((option) => {
      option.disabled = false
    })

    const dateArr = dateRange.split('~')
    const start = dateArr[0].trim()
    const end = dateArr[1].trim()

    const diffDays = calculateDayDifference(start, end)
    const diffMonth = diffDays / 31

    if (diffMonth > 3 && diffMonth <= 12) {
      if (filterProxy.selectDuration === 'week') {
        filterProxy.selectDuration = 'month'
        ElNotification({
          title: t('activity_analysis.week_duration_validation_msg'),
          type: 'warning'
        })
      }
      optionProxy.value[0].disabled = true
    } else if (diffMonth > 12 && diffMonth <= 36) {
      if (filterProxy.selectDuration === 'week' || filterProxy.selectDuration === 'month') {
        filterProxy.selectDuration = 'season'
        ElNotification({
          title: t('activity_analysis.month_duration_validation_msg'),
          type: 'warning'
        })
      }
      optionProxy.value[0].disabled = true
      optionProxy.value[1].disabled = true
    } else if (diffMonth > 36) {
      if (
        filterProxy.selectDuration === 'week' ||
        filterProxy.selectDuration === 'month' ||
        filterProxy.selectDuration === 'season'
      ) {
        filterProxy.selectDuration = 'year'
        ElNotification({
          title: t('activity_analysis.season_duration_validation_msg'),
          type: 'warning'
        })
      }
      optionProxy.value[0].disabled = true
      optionProxy.value[1].disabled = true
      optionProxy.value[2].disabled = true
    }
  }

  return {
    searchActivity,
    islistFiltered,
    activityAddChange,
    childListData,
    currentChildAnalysis,
    optionChildList,
    findSelectedOption,
    isChildFiltered,
    initChildData,
    currentDetailTab,
    chartFiltered,
    currentTabs,
    chartFilteredArr,
    filterData,
    chartApiParams,
    transformChartParams,
    resetState,
    searchChildDetailMemberName,
    isChildDetailListFiltered,
    childActiveView,
    dateRestraintion
  }
})
