<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberLobby } from '@/api/manageAnalysis.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import {
  generateRGBColors,
  dynamicBackgroundColors,
  getHallCurrencySign,
  FormatNumber,
  formatNumberWithK
} from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipFormatter } from '@/utils/highchartsConfig'
import { showPolarDatasetsLabels } from '@/utils/pluginUtils.js'
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

const chartTotal = ref(0) //圓餅圖資料總和
const pieSliceCount = ref(0) //圓餅圖切片傯數

const chartSetting = {
  id: 'lobbyChart',
  type: 'polarArea',
  plugins: [ChartDataLabels],
  data: {
    labels: [],
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      r: {
        ticks: {
          callback(label) {
            // return Math.abs(label) >= 1000 ? label / 1000 + 'k' : label
            return formatNumberWithK(label)
          }
        }
      }
    },
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
        padding: 30,
        clamp: true,
        clip: true
        // display: function (context) {
        //   console.log(chartSetting.data.datasets)
        //   return showPolarDatasetsLabels({
        //     currentData: context.dataset.data[context.dataIndex],
        //     dataTotal: chartTotal.value,
        //     pieSliceCount: pieSliceCount.value
        //   })
        // }
      },
      legend: {
        position: 'right'
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
const queryLobbyChart = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberLobby({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: manageAnalysisStore.memberData.user_id,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    // console.log(result)
    if (return_code === '0000') {
      transformLobbyChart(result.data.result)
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
const transformLobbyChart = (data) => {
  // console.log(data)
  let chart_labels = []
  let chart_data = []
  let chart_data_bgColor = []
  let chart_data_borderColor = []

  //highcharts
  // chartOptions.series.push({
  //   data: [],
  //   pointPlacement: 'between'
  // })

  for (let i = 0; i < data.length; i++) {
    if (i >= 10) {
      // 只顯示貨量前10名的平台
      break
    }
    chart_labels.push(data[i].lobby_name)
    chart_data.push(parseFloat(data[i].total_bet_amount))
    chartTotal.value = chartTotal.value + parseFloat(data[i].total_bet_amount)

    let color = ''
    let borderColor = ''
    if (i < chart_fixed_bgColor.length) {
      color = generateRGBColors(chart_fixed_bgColor[i], 0.7) // 使用定義好的顏色
      borderColor = color.substring(0, color.lastIndexOf(',')) + ',1)'
    } else {
      color = dynamicBackgroundColors(0.7) // 隨機產生顏色
      while (chart_data_bgColor.indexOf(color) > -1) {
        // 判斷該顏色是否已經存在
        color = dynamicBackgroundColors(0.7) // 若顏色已存在陣列中，則隨機產生新顏色
      }
      borderColor = color.substring(0, color.lastIndexOf(',')) + ',1)'
    }
    chart_data_bgColor.push(color)
    chart_data_borderColor.push(borderColor)

    //highcharts
    // 1
    // chartOptions.series[0].data.push({
    //   name: data[i].lobby_name,
    //   y: parseFloat(data[i].total_bet_amount),
    //   color
    // })
    // 2
    // chartOptions.series.push({
    //   name: data[i].lobby_name,
    //   data: [parseFloat(data[i].total_bet_amount)],
    //   color,
    //   pointPlacement: 'between'
    // })
  }

  pieSliceCount.value = chart_labels.length
  chartSetting.data.labels = []
  chartSetting.data.labels = chart_labels
  let chart_datasets = [
    {
      data: chart_data,
      backgroundColor: chart_data_bgColor,
      borderWidth: 1,
      hoverBorderWidth: 3,
      borderColor: chart_data_borderColor
    }
  ]
  chartSetting.data.datasets = []
  chartSetting.data.datasets = chart_datasets
}

// const chartOptions = {
//   chart: {
//     type: 'column',
//     polar: true
//   },

//   // pane: {
//   //   startAngle: 0,
//   //   endAngle: 360
//   // },

//   xAxis: {
//     lineColor: '#e8e8e8',
//     // tickInterval: 45,
//     min: 0,
//     max: 360,
//     labels: {
//       format: ' '
//     }
//   },

//   yAxis: {
//     gridLineColor: '#e8e8e8',
//     // tickInterval: 45,
//     min: 0,
//     max: 360,
//     labels: {
//       formatter() {
//         // return this.value
//         return Math.abs(this.value) >= 1000 ? this.value / 1000 + 'k' : this.value
//       }
//     }
//   },

//   plotOptions: {
//     column: {
//       pointPadding: 0,
//       groupPadding: 0,
//       // showInLegend: true,
//       dataLabels: {
//         enabled: true,
//         // format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
//         formatter: function () {
//           // console.log(this)
//           return FormatNumber(this.y)
//         },
//         useHTML: true
//       }
//     }
//   },

//   legend: {
//     layout: 'vertical',
//     align: 'right',
//     verticalAlign: 'middle',
//     useHTML: true,
//     symbolRadius: 0,
//     symbolWidth: 0,
//     symbolHeight: 0
//   },

//   tooltip: {
//     ...tooltipDarkConfig,
//     useHTML: true,
//     formatter(eve) {
//       console.log(this, eve)
//       return tooltipFormatter({ data: this, hallCode: activeHall.hall_code })
//     }
//   },

//   series: []
// }

onMounted(() => {
  queryLobbyChart()
})
watch(
  () => filterDateDialogMemberDetailTimestamp.value,
  () => {
    queryLobbyChart()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.total_bet_by_platform')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 10 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" :height="250" bg="white" v-if="apiSuccess === false" />
    <div v-else>
      <!-- <highcharts :options="chartOptions"></highcharts> -->
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
