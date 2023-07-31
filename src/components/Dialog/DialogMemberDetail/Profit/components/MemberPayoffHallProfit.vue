<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodPayoffProfitAmount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { ElNotification, dayjs } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //會員生命週期階段api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    type: 'spline',
    height: 300
  },
  legend: {
    verticalAlign: 'top'
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickmarkPlacement: 'on',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    categories: []
  },
  yAxis: {
    gridLineColor: '#e8e8e8'
    // showFirstLabel: false,
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      // console.log(this)
      return tooltipShared({ data: this.points, date: this.x, hallCode: activeHall.hall_code })
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: false,
        formatter: function () {
          return FormatNumber(this.y)
        }
      }
    }
  },
  series: []
})

//取得資料
const queryMemberPeriodPayoffProfitAmount = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodPayoffProfitAmount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    // console.log('queryMemberPeriodPayoffProfitAmount', result)
    const { return_code } = result.data.status

    if (return_code !== '0001') {
      if (return_code === '0000') {
        if (result.data.result.length !== 0) {
          apiSuccess.value = true
          transformMemberPeriodPayoffProfitAmount(result.data.result)
        } else {
          messageKey.value = 'noResult'
        }
      } else {
        messageKey.value = 'chartFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } else {
      messageKey.value = 'noResult'
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
const transformMemberPeriodPayoffProfitAmount = (data) => {
  clearChart()
  let chartData = {
    payoff: {
      name: t('customer_detail_info.member_payoff'),
      dashStyle: 'Dash',
      lineWidth: 2,
      color: 'rgba(245,105,84,1)',
      data: []
    },
    profit_loss: {
      name: t('customer_detail_info.hall_profit'),
      dashStyle: 'LongDash',
      lineWidth: 2,
      color: 'rgba(60,141,188,1)',
      data: []
    },
    accumulate_profit: {
      name: t('customer_detail_info.accumulate_hall_profit'),
      dashStyle: 'ShortDash',
      lineWidth: 2,
      color: 'rgba(0,166,90,1)',
      data: []
    }
  }
  //當資料量太大時，關閉dataLabels
  if (data.length > 40) {
    chartOptions.plotOptions.series.dataLabels.enabled = false
    chartOptions.xAxis.tickmarkPlacement = 'between'
  } else {
    chartOptions.plotOptions.series.dataLabels.enabled = true
    chartOptions.xAxis.tickmarkPlacement = 'on'
  }
  // console.log(data.length, chartOptions.plotOptions.series.dataLabels.enabled)
  data.forEach((item) => {
    chartData['accumulate_profit']['data'].push(parseFloat(item.accumulate_profit))
    chartData['payoff']['data'].push(parseFloat(item.payoff))
    chartData['profit_loss']['data'].push(parseFloat(item.profit_loss))
    chartOptions.xAxis.categories.push(dayjs(item.data_date).format(t('date.format_date_rule')))
  })
  Object.keys(chartData).forEach((item) => {
    chartOptions.series.push(chartData[item])
  })
}

const clearChart = () => {
  chartOptions['xAxis']['categories'] = []
  chartOptions['series'] = []
}

onMounted(() => {
  queryMemberPeriodPayoffProfitAmount()
})
watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryMemberPeriodPayoffProfitAmount()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.member_payoff_hall_profit')">
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <div class="cursor-pointer">
        <highcharts :options="chartOptions"></highcharts>
      </div>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
