<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import ActivityChart from '@/views/ActivityAnalysisList/components/ActivityChart.vue'
import {
  apiQueryTotalActiveCommissionable,
  apiQueryTotalActiveReal,
  apiQueryTotalActiveProfit
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
      analysis_date: chartApiParams.start_date + '~' + chartApiParams.end_date,
      interval_type: chartApiParams.cut_type,
      is_reward: chartApiParams.reward_flag,
      activity_id_list: chartApiParams.search_activity
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiObject.apiSuccess = true
      if (result.data.result.length !== 0) {
        apiObject.result = result.data.result
      } else {
        apiObject.messageKey = 'noResult'
      }
    } else if (return_code === '0001') {
      apiObject.messageKey = 'noResult'
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      apiObject.messageKey = 'chartFailed'
      hasError = true
    }
    return hasError
  } catch (error) {
    hasError = true
    console.error(error)
    if (error.response.status === 403) {
      apiObject.messageKey = 'noPermission'
      globalStore.storeHandleApiError()
    } else {
      apiObject.messageKey = 'queryFailed'
    }
    return hasError
  }
}

const queryCharts = () => {
  let canvasPromises = [
    queryActivityApi(apiQueryTotalActiveCommissionable, apiObjectCommissionable),
    queryActivityApi(apiQueryTotalActiveReal, apiObjectReal),
    queryActivityApi(apiQueryTotalActiveProfit, apiObjectProfit)
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
    activityStore.chartFilteredArr[activityStore.currentTabs].status !==
      activityStore.chartFiltered &&
    activityStore.currentTabs === 'TotalSum'
  ) {
    activityStore.chartFilteredArr[activityStore.currentTabs].status = activityStore.chartFiltered
    queryCharts()
  }
})

onMounted(() => {
  if (activityStore.chartFiltered !== 0) {
    activityStore.chartFilteredArr[activityStore.currentTabs].status = activityStore.chartFiltered
    queryCharts()
  }
})
</script>
<template>
  <ActivityChart
    :title="$t('rank_analysis.commissionable')"
    :apiObject="apiObjectCommissionable"
    sign="¥"
    :signPositionFront="true"
  />
  <ActivityChart
    :title="$t('data_name.active_member')"
    :apiObject="apiObjectReal"
  />
  <ActivityChart
    :title="$t('rank_analysis.total_profit_loss')"
    :apiObject="apiObjectProfit"
    sign="¥"
    :signPositionFront="true"
  />
</template>
<style lang="scss" scoped></style>
