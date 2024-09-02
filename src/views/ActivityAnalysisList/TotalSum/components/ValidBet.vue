<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { apiQueryTotalActiveCommissionable } from '@/api'
import { useGlobalStore } from '@/stores'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipAddSign } from '@/utils/highchartsConfig.js'
import { errorRespond, formatDateDuration, generateRGBColors } from '@/utils/commonUtils.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const apiSuccess = ref(false)
const messageKey = ref('loading')

const chartOptions = reactive({
  chart: {
    type: 'line',
    height: 500
  },
  legend: {
    verticalAlign: 'top',
    useHTML: true,
    symbolWidth: 0,
    labelFormatter: function () {
      return `
        <div style="display: flex;">
          <div style="
            width: 14px; 
            height: 14px; 
            background-color:${this.color}; 
            display: inline-block; 
            margin-right: 6px;
          "></div>
          <span>${this.name}</span>
        </div>
      `
    }
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickmarkPlacement: 'on',
    tickColor: '#e8e8e8',
    categories: [],
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipAddSign({ data: this.points, date: this.x, sign: t('currency.currency_%') })
    },
    stickOnContact: true // 需要加這個才能使overflow 生效
  },
  plotOptions: {
    series: {
      events: {
        click: function (event) {
          // 因為每次執行 series的 function都會重新 redraw導致速度很慢
          var _redraw = this.chart.redraw
          this.chart.redraw = function () {}
          // 获取当前点击的系列的 name
          const clickedSeriesName = event.point.series.name

          let showLines = 0
          this.chart.series.forEach((series) => {
            if (showLines > 1) {
              return false // 如果已经找到需要显示的 series 超过1个，就跳出循环
            } else if (series.visible === true) {
              showLines++
            }
          })

          for (let i = 0, len = this.chart.series.length; i < len; i++) {
            const series = this.chart.series[i]
            if (showLines > 1) {
              series.update({ visible: series.name === clickedSeriesName })
            } else {
              series.update({ visible: true })
            }
          }

          this.chart.redraw = _redraw
          this.chart.redraw()
        }
      }
    }
  },
  series: []
})

// 取得資料
const queryTotalActiveCommissionable = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false

  try {
    const result = await apiQueryTotalActiveCommissionable({
      hall_name: 'esx',
      start_search_year: 2024,
      start_search_month: 6,
      start_search_week: 1,
      start_date: '2024-06-03',
      end_search_year: 2024,
      end_search_month: 9,
      end_search_week: 1,
      end_date: '2024-09-02',
      cut_type: 'week',
      reward_flag: 1,
      reward_date_flag: 0,
      search_activity: [50, 48, 33, 28]
    })

    const { return_code } = result.data.status

    if (return_code === '0000') {
      apiSuccess.value = true
      transformActivityMemberPeriodTotalSumBetAmount(result.data.result)
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
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

//轉換資料
const transformActivityMemberPeriodTotalSumBetAmount = (data) => {
  clearChart()

  let valueKey = 'commissionable_sum'
  let dataClone = { ...data[0] }
  let dataKey = Object.keys(dataClone)
  delete dataKey[4]
  let dataSet = {}

  dataKey.forEach((ele, idx) => {
    dataSet[ele] = {
      name: dataClone[ele].activity_name,
      type: 'line',
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      lineWidth: 2,
      marker: {
        symbol: 'circle',
        radius: 3
      },
      data: data.map((item) => parseFloat(item[ele][valueKey]))
    }
  })

  chartOptions.xAxis.categories = data.map((ele) => {
    let date = ele.interval_title.split('~')
    return formatDateDuration(
      dayjs(date[0]).format(t('date.format_date_rule')) +
        '~' +
        dayjs(date[1]).format(t('date.format_date_rule'))
    )
  })

  Object.keys(dataSet).forEach((item) => {
    chartOptions.series.push(dataSet[item])
  })
}
const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series = []
}

onMounted(() => {
  queryTotalActiveCommissionable()
})
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle
      class="mb-16"
      :title="$t('activity_analysis.activity_commissionable')"
    ></SectionTitle>
    <highcharts :options="chartOptions"></highcharts>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
  </section>
</template>
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
</style>
