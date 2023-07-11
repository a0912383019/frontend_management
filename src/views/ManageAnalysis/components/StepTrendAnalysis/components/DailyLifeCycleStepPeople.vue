<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import dayjs from 'dayjs'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { apiQueryStepTotalPeople } from '@/api/manageAnalysis.js'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import { FormatNumber, generateRGBColors } from '@/utils/commonUtils.js'
import { showDatasetsLabels } from '@/utils/pluginUtils.js'
import DialogStepDetail from '@/views/ManageAnalysis/components/StepTrendAnalysis/components/DialogStepDetail.vue'
import CdpMessage from '@/components/CdpMessage.vue'
// import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
// import 'chartjs-adapter-dayjs-3'

import Chart from 'chart.js/auto'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { tableConfig } = storeToRefs(globalStore)

const manageAnalysisStore = useManageAnalysisStore()
const { stepTrendRangeDate, filterDateStepTrendTimestamp } = storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //會員生明細api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const refDialogStepDetail = ref(null)

const refChart = ref(null)

let chart

//tooltips觸發後紀錄目前的資訊
const currentTooltipEntity = reactive({
  date: '',
  step: null
})

const chartPrevIndex = ref(null)

const legendCloseCount = ref(0) //目前關閉的lengend數量

const chartSetting = {
  id: 'peopleChart',
  type: 'line',
  data: {
    xLabels: [],
    datasets: []
  },
  plugins: [
    {
      afterDatasetsDraw: function (chart) {
        showDatasetsLabels(chart, 12, 7, 30)
      }
    }
  ],
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        ticks: {
          padding: 10,
          callback: (label) => {
            // console.log(label, index, labels)
            // 只顯示整數，若數字過千以k縮寫表示
            if (Math.floor(label) === label) {
              return Math.abs(label) >= 1000 ? label / 1000 + 'k' : label
            }
          }
        }
      }
    },
    onClick: (event, legendItem) => {
      // console.log(event, legendItem, event.chart.legend.legendItems)
      // event.chart.legend.legendItems.forEach((item) => {
      //   // console.log(item)
      //   item.hidden = true
      // })
      // console.log(event, legendItem)
      // console.log(legendItem.length)
      if (legendItem.length !== 0) {
        let legendItemDatasetIndex = legendItem[0].datasetIndex
        chart.data.datasets.forEach((item, index) => {
          // console.log(index, legendItemDatasetIndex, item)
          if (legendItemDatasetIndex !== chartPrevIndex.value) {
            if (index === legendItemDatasetIndex) {
              chart.data.datasets[index].hidden = false
            } else {
              chart.data.datasets[index].hidden = true
            }
            //只顯示當前的datalabel
            chartSetting.plugins[0] = {
              afterDatasetsDraw: function (chart) {
                showDatasetsLabels(chart, 12, 7, 30, 0, [legendItemDatasetIndex])
              }
            }
            //只會顯示當前的一個，所以關閉的數量是，所有數量減掉顯示的一個
            legendCloseCount.value = chart.data.datasets.length - 1
          } else {
            chart.data.datasets[index].hidden = false
            //顯示全部的datalabel
            chartSetting.plugins[0] = {
              afterDatasetsDraw: function (chart) {
                showDatasetsLabels(chart, 12, 7, 30)
              }
            }
            legendCloseCount.value = 0
          }
        })
        if (legendItemDatasetIndex === chartPrevIndex.value) {
          chartPrevIndex.value = null
        } else {
          chartPrevIndex.value = legendItemDatasetIndex
        }
        chart.update()
      } else {
        refDialogStepDetail.value.handleOpenDialog(currentTooltipEntity)
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        onClick: (event, legendItem) => {
          const { text } = legendItem
          let legendShowArrayIndex = [] //要顯示的legend的index

          chart.data.datasets.forEach((item, index) => {
            if (item.label === text && legendCloseCount.value === chart.data.datasets.length - 1) {
              //如果是目前legend顯示的最後一筆，不關閉
              item.hidden = false
            } else if (item.label === text) {
              item.hidden = !item.hidden
            }
            if (item.hidden === false && legendShowArrayIndex.indexOf(index) === -1) {
              //如果顯示則legendShowArrayIndex新增此legend index
              legendShowArrayIndex.push(index)
            }
          })

          //紀錄目前關閉的數量
          legendCloseCount.value = chart.data.datasets.length - legendShowArrayIndex.length

          //只顯示當前的datalabel
          chartSetting.plugins[0] = {
            afterDatasetsDraw: function (chart) {
              showDatasetsLabels(chart, 12, 7, 30, 0, legendShowArrayIndex)
            }
          }
          chart.update()
        }
      },
      tooltip: {
        mode: 'nearest',
        position: 'nearest',
        intersect: false,
        displayColors: true,
        callbacks: {
          label: (tooltipItem) => {
            // console.log(tooltipItem, data)
            let title = tooltipItem['dataset']['label'] + ' : '
            let value = FormatNumber(tooltipItem['raw']) + t('unit.people')

            currentTooltipEntity['date'] = tooltipItem['label']
            currentTooltipEntity['step'] = parseInt(tooltipItem['datasetIndex'] + 1) // index需加1以對應至正確的階段

            return title + value
          }
        }
      }
    }
  }
}

//階段每日人數
const query_step_total_people = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  try {
    const result = await apiQueryStepTotalPeople({
      hall_name: activeHall.hall_code,
      search_date: stepTrendRangeDate.value
    })
    const { return_code } = result.data.status
    console.log(result, return_code)
    if (return_code === '0000') {
      apiSuccess.value = true
      transform_step_total_people(result.data.result)
      setTimeout(() => {
        register_chart()
      }, 1)
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

const transform_step_total_people = (result) => {
  // console.log(result)
  let chartLabels = []
  let chartDatasetsDict = {}
  let chartDatasets = []
  result.forEach((item) => {
    chartLabels.push(dayjs(item.data_date).format(t('date.format_date_rule')))
    let stepTotalPeople = item
    delete stepTotalPeople['data_date'] // 移除data_date欄位
    Object.entries(stepTotalPeople).forEach((people) => {
      // console.log(people, peopleIndex, chartDatasetsDict[people[0]])
      if (chartDatasetsDict[people[0]] !== undefined) {
        chartDatasetsDict[people[0]].data.push(people[1])
      } else {
        let step_config = RFM_NAPL_step_config[people[0]]
        chartDatasetsDict[people[0]] = {
          label: tableConfig.value[people[0]]['step_name'],
          fill: false,
          hidden: false,
          borderWidth: 3,
          lineTension: 0,
          spanGaps: true,
          borderColor: generateRGBColors(step_config.step_color, 1),
          pointRadius: 3,
          pointHoverRadius: 7,
          pointColor: generateRGBColors(step_config.step_color, 1),
          backgroundColor: generateRGBColors(step_config.step_color, 1),
          pointBackgroundColor: generateRGBColors(step_config.step_color, 1),
          hoverBorderColor: generateRGBColors(step_config.step_color, 1),
          hoverBorderWidth: 7,
          data: [people[1]]
        }
      }
    })
  })
  Object.values(chartDatasetsDict).forEach((item) => {
    chartDatasets.push(item)
  })
  // console.log('chartDatasets', chartDatasets)
  chartSetting.data.xLabels = []
  chartSetting.data.xLabels = chartLabels
  chartSetting.data.datasets = []
  chartSetting.data.datasets = chartDatasets
  // console.log('transform_step_total_people', chartLabels)
  // console.log(chartDatasets)
}

const register_chart = () => {
  let ctx = refChart.value.getContext('2d')
  chart = new Chart(ctx, chartSetting)
  console.log('Chart', chart)
}

//監聽FilterDate.vue時間戳記
watch(
  () => filterDateStepTrendTimestamp.value,
  () => {
    query_step_total_people()
  }
)

defineExpose({ query_step_total_people })
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('manage_analysis.daily_life_cycle_step_people')">
      <template #tooltip>
        {{ $t('manage_analysis.click_chart_show_step_details') }}
      </template>
    </SectionTitle>
    <DialogStepDetail ref="refDialogStepDetail" />
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <div class="cdp-dialog__chart" v-else>
      <canvas
        ref="refChart"
        style="min-height: 500px; height: 500px; max-height: 500px; max-width: 100%"
      ></canvas>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
