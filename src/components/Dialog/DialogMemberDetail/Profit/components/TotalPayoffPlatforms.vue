<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodPlatformPayoff } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipSingleShared } from '@/utils/highchartsConfig.js'
import { ElNotification } from 'element-plus'
import { generateMultipleColors } from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //會員生命週期階段api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    type: 'column',
    height: 300
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    categories: []
  },
  legend: {
    enabled: false
  },
  yAxis: {
    gridLineColor: '#e8e8e8'
  },
  tooltip: {
    ...tooltipDarkConfig,
    shared: true,
    useHTML: true,
    formatter() {
      return tooltipSingleShared({ data: this.points, hallCode: activeHall.hall_code })
    }
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        formatter: function () {
          return FormatNumber(this.y)
        }
      }
    }
  },
  series: [
    {
      data: []
    }
  ]
})

//取得資料
const queryMemberPeriodPlatformPayoff = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodPlatformPayoff({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.memberData.user_id,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      transformMemberPeriodPlatformPayoff(result.data.result)
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.update_failed'),
        type: 'error'
      })
    }
  }
}

//轉換資料
const transformMemberPeriodPlatformPayoff = (data) => {
  clearChart()
  let bgColor = generateMultipleColors(10)['bg']
  for (let i = 0; i < data.length; i++) {
    if (i >= 10) {
      // 只顯示貨量前10名
      break
    }
    let seriesData = {
      color: bgColor[i],
      y: parseFloat(parseFloat(0 - data[i].total_payoff))
    }
    chartOptions.xAxis.categories.push(data[i].lobby_name)
    chartOptions.series[0]['data'].push(seriesData)
  }
}

const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series[0]['data'] = []
}

onMounted(() => {
  queryMemberPeriodPlatformPayoff()
})
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.total_payoff_platforms')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 10 }) }}
      </template>
    </SectionTitle>
    <div class="member">
      <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
      <template v-else>
        <div class="cursor-pointer">
          <highcharts :options="chartOptions"></highcharts>
        </div>
      </template>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
