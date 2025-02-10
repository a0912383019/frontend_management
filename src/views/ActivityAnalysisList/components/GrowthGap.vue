<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import ActivityChart from '@/views/ActivityAnalysisList/components/ActivityChart.vue'
import {
  apiQueryGrowthGapCommissionable,
  apiQueryGrowthGapReal,
  apiQueryGrowthGapProfit
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
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        apiObject.messageKey = 'noResult'
      } else {
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
        apiObject.messageKey = 'chartFailed'
        hasError = true
      }
    }
    return hasError
  } catch (error) {
    hasError = true
    console.error(error)
    if (error.response.status === 403) {
      apiObject.messageKey = 'noPermission'
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      apiObject.messageKey = 'chartFailed'
    }
    return hasError
  }
}

const queryCharts = () => {
  let canvasPromises = [
    queryActivityApi(apiQueryGrowthGapCommissionable, apiObjectCommissionable),
    queryActivityApi(apiQueryGrowthGapReal, apiObjectReal),
    queryActivityApi(apiQueryGrowthGapProfit, apiObjectProfit)
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
    activityStore.currentTabs === 'GrowthGap'
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
