<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodDepositWithdrawAmount } from '@/api/dialogMemberDetail.js'
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
    type: 'area',
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
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipShared({ data: this.points, date: this.x, hallCode: activeHall.hall_code })
    }
  },
  plotOptions: {
    area: {
      fillOpacity: 0.5
    },
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
const queryMemberPeriodDepositWithdrawAmount = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodDepositWithdrawAmount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      transformMemberPeriodDepositWithdrawAmount(result.data.result)
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
const transformMemberPeriodDepositWithdrawAmount = (data) => {
  clearChart()
  let chartData = {
    deposit_amount: {
      name: t('data_name.deposit'),
      dashStyle: 'Dash',
      lineWidth: 2,
      color: 'rgba(245,105,84,1)',
      data: []
    },
    withdraw_amount: {
      name: t('data_name.withdraw'),
      dashStyle: 'LongDash',
      lineWidth: 2,
      color: 'rgba(60,141,188,1)',
      data: []
    },
    accumulate_profit: {
      name: t('customer_detail_info.accumulate_net_amount'),
      dashStyle: 'ShortDash',
      lineWidth: 2,
      color: 'rgba(0,166,90,1)',
      data: [],
      zIndex: -1
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
  data.forEach((item) => {
    chartData['deposit_amount']['data'].push(parseFloat(item.deposit_amount))
    chartData['withdraw_amount']['data'].push(parseFloat(item.withdraw_amount))
    chartData['accumulate_profit']['data'].push(parseFloat(item.accumulate_profit))
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
  queryMemberPeriodDepositWithdrawAmount()
})
watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryMemberPeriodDepositWithdrawAmount()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.deposit_and_withdraw')">
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
