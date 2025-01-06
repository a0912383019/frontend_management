<script setup>
import { ref, watch, onMounted, toRefs, reactive } from 'vue'
import { generateRGBColors, generateMultipleColors } from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import {
  tooltipDarkConfig,
  tooltipAddSign,
  tooltipAddSignInFront
} from '@/utils/highchartsConfig.js'
import { latest_chart_color } from '@/../public/js/system_config.js'
import { dayjs } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useActivityAnalysisStore } from '@/stores'

const activityStore = useActivityAnalysisStore()
const { chartApiParams } = activityStore

const { t } = useI18n()

const props = defineProps({
  apiObject: {
    apiSuccess: Boolean,
    messageKey: String,
    result: Array
  },
  title: {
    type: String
  },
  signPositionFront: {
    type: Boolean,
    default: false
  },
  sign: {
    type: String,
    default: ''
  }
})
const { apiObject } = toRefs(props)

const apiSuccess = ref(apiObject.value.apiSuccess)
const messageKey = ref(apiObject.value.messageKey)

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
        textOverflow: 'none', // 防止省略號(...)
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
      if (props.signPositionFront) {
        return tooltipAddSignInFront({ data: this.points, date: this.x, sign: props.sign })
      } else {
        return tooltipAddSign({ data: this.points, date: this.x, sign: props.sign })
      }
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

// 轉換資料
const transformChartSeries = (data) => {
  clearChart()

  chartOptions.xAxis.categories = data.map((ele) => {
    if (ele.interval_title.includes('~')) {
      const dateformat = ele.interval_title.split('~')

      return (
        dayjs(dateformat[0]).format(t('date.format_date_rule')) +
        ' ~ ' +
        dayjs(dateformat[1]).format(t('date.format_date_rule'))
      )
    } else {
      return ele.interval_title
    }
  })

  let dataClone = { ...data[0] }
  delete dataClone.interval_title
  let activityIdList = Object.keys(dataClone.activities)

  const firstActivity = dataClone.activities[activityIdList[0]]
  const valueKey = Object.keys(firstActivity).find((key) => key !== 'activity_name')
  if (!valueKey) {
    console.error('api result key error')
    apiSuccess.value = false
    messageKey.value = 'chartFailed'
    return
  }

  let dataSet = {}

  let colorCount = activityIdList.length
  let colorArr = []
  if (colorCount > 20) {
    colorArr = generateMultipleColors(colorCount)['bg']
  }

  activityIdList.forEach((ele, idx) => {
    dataSet[ele] = {
      name: dataClone.activities[ele].activity_name,
      type: 'line',
      color: colorCount > 20 ? colorArr[idx] : generateRGBColors(latest_chart_color[idx], 1),
      lineWidth: 2,
      marker: {
        symbol: 'circle',
        radius: 3
      },
      data: data.map((item) => {
        return parseFloat(item.activities[ele][valueKey])
      })
    }
  })

  chartOptions.chart.marginLeft = chartApiParams.cut_type === 'week' ? 80 : 51

  Object.keys(dataSet).forEach((item) => {
    chartOptions.series.push(dataSet[item])
  })
}

const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series = []
}

const handleApiResponse = () => {
  apiSuccess.value = apiObject.value.apiSuccess
  messageKey.value = apiObject.value.messageKey

  if (apiObject.value.apiSuccess) {
    if (apiObject.value.result.length === 0) {
      apiSuccess.value = false
      messageKey.value = 'noResult'
    } else {
      transformChartSeries(apiObject.value.result)
    }
  }
}

watch([() => apiObject.value.apiSuccess, () => apiObject.value.messageKey], () => {
  handleApiResponse()
})

onMounted(() => {
  handleApiResponse()
})
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle class="mb-15" :title="props.title"> </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <div class="cursor-pointer">
        <highcharts :options="chartOptions"></highcharts>
      </div>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
