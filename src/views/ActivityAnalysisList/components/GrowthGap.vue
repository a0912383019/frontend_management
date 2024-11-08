<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import ActivityChart from '@/views/ActivityAnalysisList/components/ActivityChart.vue'
import {
  apiQueryGrowthGapActiveCommissionable,
  apiQueryGrowthGapActiveReal,
  apiQueryGrowthGapActiveProfit
} from '@/api'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { chartApiParams } = activityStore

const apiObjectCommissionable = reactive({
  apiSuccess: false,
  messageKey: 'loading',
  result: {}
})

const apiObjectReal = reactive({
  apiSuccess: false,
  messageKey: 'loading',
  result: {}
})

const apiObjectProfit = reactive({
  apiSuccess: false,
  messageKey: 'loading',
  result: {}
})

const queryActivityApi = async (api, apiObject) => {
  apiObject.apiSuccess = false
  apiObject.messageKey = 'loading'
  let hasError = false
  try {
    const result = await api({
      hall_name: activeHall.hall_code,
      start_search_year: 2024,
      start_search_month: 6,
      start_search_week: 1,
      start_date: chartApiParams.start_date,
      end_search_year: 2024,
      end_search_month: 9,
      end_search_week: 1,
      end_date: chartApiParams.end_date,
      cut_type: chartApiParams.cut_type,
      reward_flag: chartApiParams.reward_flag,
      reward_date_flag: 0,
      search_activity: chartApiParams.search_activity
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiObject.apiSuccess = true
      if (result.data.result.length !== 0) {
        apiObject.result = result.data.result
      } else {
        apiObject.messageKey = 'noResult'
        apiObject.apiSuccess = false
      }
    } else if (return_code === '0001') {
      apiObject.messageKey = 'noResult'
      apiObject.apiSuccess = false
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      hasError = true
    }
    return hasError
  } catch (error) {
    hasError = true
    console.error(error)
    if (error.response.status === 403) {
      apiObject.messageKey = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      apiObject.messageKey = 'queryFailed' //更改message內容
    }
    return hasError
  }
}

const queryCharts = () => {
  let canvasPromises = [
    queryActivityApi(apiQueryGrowthGapActiveCommissionable, apiObjectCommissionable),
    queryActivityApi(apiQueryGrowthGapActiveReal, apiObjectReal),
    queryActivityApi(apiQueryGrowthGapActiveProfit, apiObjectProfit)
  ]

  Promise.allSettled(canvasPromises).then((results) => {
    let errorCount = 0
    results.forEach((result) => {
      errorCount += Number(result.value)
    })

    if (errorCount === 0) {
      ElNotification({
        title: t('msg.query_successful'),
        type: 'success'
      })
    } else if (errorCount === 3) {
      ElNotification({
        title: t('msg.query_failed'),
        type: 'error'
      })
    } else {
      ElNotification({
        title: t('msg.query_failed_part'),
        type: 'error'
      })
    }
  })
}

watch([() => activityStore.chartFiltered, () => activityStore.currentTabs], () => {
  if (
    activityStore.chartFilteredArr[1] !== activityStore.chartFiltered &&
    activityStore.currentTabs === 'GrowthGap'
  ) {
    activityStore.chartFilteredArr[1] = activityStore.chartFiltered
    queryCharts()
  }
})

onMounted(() => {
  if (activityStore.chartFiltered !== 0) {
    activityStore.chartFilteredArr[1] = activityStore.chartFiltered
    queryCharts()
  }
})
</script>
<template>
  <ActivityChart
    :title="$t('activity_analysis.activity_commissionable')"
    :apiObject="apiObjectCommissionable"
  />
  <ActivityChart
    :title="$t('activity_analysis.activity_active_people')"
    :apiObject="apiObjectReal"
  />
  <ActivityChart
    :title="$t('activity_analysis.activity_net_profit')"
    :apiObject="apiObjectProfit"
  />
</template>
<style lang="scss" scoped></style>
