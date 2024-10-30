import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

export const useActivityAnalysisStore = defineStore('activityAnalysis', () => {
  const searchActivity = ref('')

  const islistFiltered = ref(0)

  const initListFilter = () => {
    islistFiltered.value = 0
    searchActivity.value = ''
    currentTabs.value = 'Overview'
  }

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

  const isChildFiltered = ref(0)

  const initChildData = () => {
    childListData.value = []
    currentChildAnalysis.name = null
    currentChildAnalysis.id = null
    optionChildList.value = null
    isChildFiltered.value = 0
  }

  const currentDetailTab = ref('TagStatistics')

  const chartFiltered = 0
  const currentTabs = ref('Overview')
  const { date_range_picker_config_2 } = useDateStore()

  // 成長率 成長差額 總和 -> 各頁籤篩選狀態
  const chartFilteredArr = reactive({
    GrowthRate: { status: 0 },
    GrowthGap: { status: 0 },
    TotalSum: { status: 0 }
  })

  // 進階篩選options的預設值
  const filterData = reactive({
    selectDuration: 'week',
    analysisDate: '',
    selectReward: 1,
    activityNameList: ''
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
    chartApiParams.search_activity = filterData.activityNameList.split(',')
  }

  // 重置資料
  const resetState = () => {
    filterData.chartFiltered = 0
    filterData.selectDuration = 'week'
    filterData.analysisDate = ''
    filterData.selectReward = 1
    filterData.activityNameList = ''
  }

  return {
    searchActivity,
    islistFiltered,
    initListFilter,
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
    resetState
  }
})
