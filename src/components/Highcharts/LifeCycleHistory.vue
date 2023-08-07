<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberStepDetail } from '@/api/global.js'
import { useGlobalStore } from '@/stores/global.js'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import { generateRGBColors, errorRespond } from '@/utils/commonUtils.js'
import dayjs from 'dayjs'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-dayjs-3'
import CdpMessage from '@/components/CdpMessage.vue'

const props = defineProps({
  memberId: {
    type: Number
  },
  userName: {
    type: String
  },
  detailDate: {
    type: String
  },
  timestamp: {
    type: Number,
    default: 0
  }
})

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const apiSuccess = ref(false) //會員生明細api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')
const refChart = ref(null)
const legendLists = ref([]) // 自定義legend
const chartTitle = ref(props.userName) // chart的標題
let chart
const chartSetting = {
  id: 'bar',
  type: 'bar',
  data: {
    xLabels: [],
    yLabels: [''],
    datasets: []
  },
  options: {
    indexAxis: 'y',
    layout: {
      padding: 0
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          round: 'day',
          displayFormats: {
            day: t('date.format_date_rule')
          }
        },
        stacked: false,
        ticks: {
          padding: 1
        }
      },
      y: {
        stacked: true,
        ticks: {
          padding: 10,
          display: false
        }
      }
    },
    plugins: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        font: {
          size: 14
        },
        color: '#007bff',
        text: ''
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          filter: function (item, chart) {
            // console.log(item, chart)
          }
        },
        onClick: function (e) {
          e.stopPropagation()
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let { formattedValue, dataset } = context
            formattedValue = JSON.parse(formattedValue)
            let result = `${dataset.label}:`

            result =
              result +
              dayjs(formattedValue[0]).format(t('date.format_date_rule')) +
              ' ~ ' +
              dayjs(formattedValue[1]).format(t('date.format_date_rule'))
            return result
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

const queryMemberStepDetail = async () => {
  try {
    const result = await apiQueryMemberStepDetail({
      hall_name: activeHall.hall_code,
      user_id: props.memberId,
      member_step_detail_date: props.detailDate
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformMemberStepDetail(result.data.result)
      apiSuccess.value = true
      setTimeout(() => {
        registerChart()
      }, 1)
      // let step_legend_dict = {}
    } else if (return_code === '0001') {
      apiSuccess.value = false
      messageKey.value = 'noResults'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      messageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

const transformMemberStepDetail = (data) => {
  let chartXLabels = []
  let chartDatasets = []
  let checkLegendLists = []
  for (let i = 0; i < data.length; i++) {
    let xLabel_date = dayjs(data[i].data_date).format('YYYY-MM-DD')
    chartXLabels.push(xLabel_date)

    //  若資料為最後一筆，多加一筆在後面，以便顯示最後一筆的階段
    if (i + 1 === data.length) {
      let search_last_date = props.detailDate.split('~')[1].trim()
      let xLabel_last_date = dayjs(search_last_date).format('YYYY-MM-DD')
      xLabel_last_date = dayjs(search_last_date).add(1, 'day').format('YYYY-MM-DD')
      chartXLabels.push(xLabel_last_date)
    }

    let stepConfig = RFM_NAPL_step_config[data[i].this_day_step]
    if (stepConfig !== undefined) {
      let datasetConfig = {
        label: stepConfig.step_name,
        backgroundColor: generateRGBColors(stepConfig.step_color, 0.7),
        borderWidth: 1,
        hoverBorderWidth: 3,
        borderColor: generateRGBColors(stepConfig.step_color, 1),
        data: [
          [
            new Date(data[i].data_date),
            i + 1 === data.length
              ? chartXLabels[chartXLabels.length - 1]
              : new Date(data[i + 1].data_date)
          ]
        ]
      }
      chartDatasets.push(datasetConfig)
      if (checkLegendLists.indexOf(stepConfig.step_name) === -1) {
        checkLegendLists.push(stepConfig.step_name)
        legendLists.value.push(datasetConfig)
      }
    }
  }

  chartSetting.data.xLabels = []
  chartSetting.data.xLabels = chartXLabels
  chartSetting.data.datasets = []
  chartSetting.data.datasets = chartDatasets
}

// 清空chart資料
const clearChart = () => {
  console.log('clearChart')
  apiSuccess.value = false
  chartSetting.data.xLabels = []
  chartSetting.data.datasets = []
  chartSetting.options.plugins.title.text = ''
  legendLists.value = []
  chartTitle.value = ''
}

// 查詢api
const queryChartApi = () => {
  queryMemberStepDetail()
  chartTitle.value = props.userName
}

onMounted(() => {
  queryMemberStepDetail()
})

defineExpose({ queryChartApi, clearChart })
</script>
<template>
  <div class="relative" style="min-height: 300px">
    <CdpMessage :messageKey="messageKey" :cover="true" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <div class="chartTitle" v-if="chartTitle">{{ chartTitle }}</div>
      <ul class="legend">
        <li v-for="(item, index) in legendLists" :key="index">
          <div
            class="legend__box"
            :style="{
              backgroundColor: item.backgroundColor,
              borderColor: item.borderColor
            }"
          ></div>
          <div class="legend__title">{{ item.label }}</div>
        </li>
      </ul>
      <canvas
        ref="refChart"
        style="
          min-height: 300px;
          height: 300px;
          max-height: 300px;
          min-width: 100%;
          max-width: 100%;
        "
      ></canvas>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.chartTitle {
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  color: #007bff;
}
.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  pointer-events: none;
  li {
    display: flex;
    align-items: center;
    list-style-type: none;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  &__box {
    width: 42px;
    height: 12px;
    margin-right: 6px;
    border-width: 1px;
    border-style: solid;
  }
  &__title {
    font-size: 13px;
    line-height: 1;
    color: #404040;
  }
}
</style>
