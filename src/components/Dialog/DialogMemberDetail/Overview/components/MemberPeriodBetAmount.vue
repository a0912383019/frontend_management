<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodBetAmount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { dayjs, ElNotification } from 'element-plus'
import { FormatNumber, errorRespond, getHallCurrencySign } from '@/utils/commonUtils.js'
import { showDatasetsLabels } from '@/utils/pluginUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import SvgKnob from '@/components/SvgKnob.vue'
import Chart from 'chart.js/auto'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')
const refChart = ref(null)
let chart

const chartSetting = {
  id: 'betAmountChart',
  type: 'line',
  data: {
    xLabels: [],
    datasets: []
  },
  plugins: [
    {
      afterDatasetsDraw: function (chart) {
        showDatasetsLabels(chart, 12, 5, 60)
      }
    }
  ],
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          padding: 10
        }
      },
      y: {
        ticks: {
          padding: 10,
          beginAtZero: true,
          callback: function (label) {
            // 只顯示整數，若數字過千以k縮寫表示
            if (Math.floor(label) === label) {
              return Math.abs(label) >= 1000 ? label / 1000 + 'k' : label
            }
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        displayColors: true,
        callbacks: {
          label: (tooltipItem) => {
            let value =
              getHallCurrencySign('BBIN', activeHall.hall_code) + FormatNumber(tooltipItem['raw'])
            return t('data_name.bet_amount') + '：' + value
          }
        }
      }
    }
  }
}

//註冊chart
const registerChart = () => {
  let ctx = refChart.value.getContext('2d')
  chart = new Chart(ctx, chartSetting)
}

const queryBetLineChart = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodBetAmount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      const { result_period_bet_amount, result_period_device_bet_amount } = result.data.result
      transformBetAmountChart(result_period_bet_amount)
      transformBetAmountKnob(result_period_device_bet_amount)
      apiSuccess.value = true
      nextTick(() => {
        registerChart()
      })
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

// chart
const transformBetAmountChart = (data) => {
  let chart_labels = []
  let chart_data = []
  data.forEach((item) => {
    chart_labels.push(dayjs(item.data_date).format(t('date.format_date_rule')))
    chart_data.push(parseFloat(item.total_bet_amount))
  })
  chartSetting.data.xLabels = []
  chartSetting.data.xLabels = chart_labels
  let chart_datasets = [
    {
      label: t('data_name.bet_amount'),
      fill: true,
      borderWidth: 3,
      lineTension: 0,
      spanGaps: true,
      borderColor: 'rgba(245,105,84,1)',
      pointRadius: 3,
      pointHoverRadius: 7,
      pointColor: 'rgba(245,105,84,1)',
      pointBackgroundColor: 'rgba(245,105,84,1)',
      data: chart_data
    }
  ]
  chartSetting.data.datasets = []
  chartSetting.data.datasets = chart_datasets
}

// 各裝置貨量佔比knob圖
const knobLists = ref([])
const transformBetAmountKnob = (data) => {
  // console.log('transformBetAmountKnob', data)
  let pc_total_amount = 0,
    mobile_total_amount = 0,
    app_total_amount = 0
  data.forEach((item) => {
    if (item.platform === 0) {
      //PC:0
      pc_total_amount = pc_total_amount + parseFloat(item.total_bet_amount)
    } else if (item.platform === 99) {
      // APP：99
      app_total_amount = app_total_amount + parseFloat(item.total_bet_amount)
    } else {
      // Mobile：1、2、3、4、5，其他：6, 7, 12
      mobile_total_amount = mobile_total_amount + parseFloat(item.total_bet_amount)
    }
  })
  let total_amount = pc_total_amount + mobile_total_amount + app_total_amount
  knobLists.value = []
  knobLists.value = [
    {
      name: t('customer_detail_info.pc'),
      amount: Math.round((pc_total_amount / total_amount) * 100)
    },
    {
      name: t('customer_detail_info.mobile'),
      amount: Math.round((mobile_total_amount / total_amount) * 100)
    },
    {
      name: t('customer_detail_info.app'),
      amount: Math.round((app_total_amount / total_amount) * 100)
    }
  ]
}

onMounted(() => {
  queryBetLineChart()
})
watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryBetLineChart()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.total_bet_by_device')">
    </SectionTitle>
    <CdpMessage
      :messageKey="messageKey"
      bg="white"
      :height="250"
      class="font-size-16"
      v-if="apiSuccess === false"
    />
    <div class="cdp-dialog__chart" v-else>
      <canvas
        ref="refChart"
        style="
          min-height: 250px;
          height: 250px;
          max-height: 250px;
          min-width: 100%;
          max-width: 100%;
        "
      ></canvas>
      <el-row :gutter="15">
        <el-col :span="8" v-for="(item, index) in knobLists" :key="index">
          <div class="flex justify-center">
            <SvgKnob :percent="item.amount" :text="item.name" />
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
