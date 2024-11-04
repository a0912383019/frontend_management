import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useActivityAnalysisStore = defineStore('activityAnalysis', () => {
  const searchActivity = ref('')

  const filtered = ref(0)

  const initFilter = () => {
    filtered.value = 0
    searchActivity.value = ''
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

  return {
    searchActivity,
    filtered,
    initFilter,
    activityAddChange,
    childListData,
    currentChildAnalysis,
    optionChildList,
    findSelectedOption,
    isChildFiltered
  }
})
