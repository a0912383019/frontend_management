<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberLobbyGame } from '@/api/manageAnalysis.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import {
  generateRGBColors,
  dynamicBackgroundColors,
  getHallCurrencySign,
  FormatNumber
} from '@/utils/commonUtils.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { ElNotification } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { dialogMemberDetailRangeDate, filterDateDialogMemberDetailTimestamp } =
  storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')
const refChart = ref(null)
let chart

const chartSetting = {
  id: 'lobbyGameChart',
  type: 'doughnut',
  plugins: [ChartDataLabels],
  data: {
    labels: [],
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {},
    plugins: {
      datalabels: {
        formatter: function (value) {
          return FormatNumber(value)
        },
        display: 'auto',
        color: '#000',
        font: {
          weight: 'bold'
        },
        padding: 10,
        clamp: true,
        clip: true
      },
      legend: {
        position: 'right',
        maxWidth: 220
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let value =
              getHallCurrencySign('BBIN', activeHall.hall_code) + FormatNumber(tooltipItem['raw'])
            let title = tooltipItem['label'] + ' : '
            return title + value
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
  // console.log('Chart', chart)
}
//取得資料
const queryLobbyGameChart = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberLobbyGame({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: manageAnalysisStore.memberData.user_id,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    // console.log('apiQueryMemberLobbyGame', result)
    if (return_code === '0000') {
      transformLobbyGameChart(result.data.result)
      apiSuccess.value = true
      setTimeout(() => {
        registerChart()
      }, 1)
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
    } else {
      messageKey.value = 'chartFailed'
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
const transformLobbyGameChart = (data) => {
  // console.log('transformLobbyGameChart', data)
  let chartLabels = []
  let chartData = []
  let chartDataBgColor = []
  let chartDataBorderColor = []
  for (let i = 0; i < data.length; i++) {
    if (i >= 10) {
      // 只顯示貨量前10名的遊戲
      break
    }
    let label = data[i].lobby_name + '-' + data[i].game_name
    chartLabels.push(label)
    chartData.push(parseFloat(data[i].total_bet_amount))

    let color = ''
    let borderColor = ''
    if (i < chart_fixed_bgColor.length) {
      color = generateRGBColors(chart_fixed_bgColor[i], 0.7) // 使用定義好的顏色
      borderColor = color.substring(0, color.lastIndexOf(',')) + ',1)'
    } else {
      color = dynamicBackgroundColors(0.7) // 隨機產生顏色
      while (chartDataBgColor.indexOf(color) > -1) {
        // 判斷該顏色是否已經存在
        color = dynamicBackgroundColors(0.7) // 若顏色已存在陣列中，則隨機產生新顏色
      }
      borderColor = color.substring(0, color.lastIndexOf(',')) + ',1)'
    }
    chartDataBgColor.push(color)
    chartDataBorderColor.push(borderColor)
  }
  chartSetting.data.labels = []
  chartSetting.data.labels = chartLabels

  let chartDatasets = [
    {
      data: chartData,
      backgroundColor: chartDataBgColor,
      borderWidth: 1,
      hoverBorderWidth: 3,
      borderColor: chartDataBorderColor
    }
  ]
  chartSetting.data.datasets = []
  chartSetting.data.datasets = chartDatasets
}

onMounted(() => {
  queryLobbyGameChart()
})
watch(
  () => filterDateDialogMemberDetailTimestamp.value,
  () => {
    queryLobbyGameChart()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.total_bet_by_game')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 10 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" :height="250" bg="white" v-if="apiSuccess === false" />
    <div v-else>
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
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
