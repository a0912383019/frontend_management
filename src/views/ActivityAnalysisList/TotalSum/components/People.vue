<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryTotalActiveReal } from '@/api'
import { useGlobalStore } from '@/stores'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { errorRespond } from '@/utils/commonUtils.js'

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
      return `<div style="display: flex;">
        <div style="width: 14px; height: 14px; background-color:
        ${this.color}; display: inline-block; margin-right: 6px"></div><span>
        ${this.name}</span></div>`
    }
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickmarkPlacement: 'on',
    tickColor: '#e8e8e8',
    categories: [],
    tickWidth: 1,
    labels: {
      style: {
        fontSize: '14px'
      }
    }
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipShared({ data: this.points, date: this.x, hallCode: activeHall.hall_code })
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
  series: [
    {
      name: '(1) qazosya',
      type: 'line',
      data: [0, 0, 1235, 239852, 0, 0, 0],
      color: 'rgb(241,78,78,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(2) lilytest2',
      type: 'line',
      data: [0, 21878.2617, 39133.548, 20.1, 54239.295, 0, 0],
      color: 'rgb(0,192,236,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(3) angel999',
      type: 'line',
      data: [0, 0, 0, 71200, 0, 0, 0],
      color: 'rgb(69,137,166,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(4) testdenny723',
      type: 'line',
      data: [0, 0, 0, 11115.6776, 32986.8, 0, 0],
      color: 'rgb(251,201,201,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(5) eurzosy',
      type: 'line',
      data: [0, 0, 0, 0, 38843.226, 0, 0],
      color: 'rgb(209,214,222,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(6) vengo',
      type: 'line',
      data: [0, 0, 0, 0, 32060, 0, 0],
      color: 'rgb(200,200,240,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(7) vndzosy',
      type: 'line',
      data: [0, 0, 0, 31074, 61.2, 0, 0],
      color: 'rgb(255,107,0,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(8) rmbalvis',
      type: 'line',
      data: [0, 0, 1100, 1750, 5200, 0, 100],
      color: 'rgb(235,214,173,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(9) chihesb001',
      type: 'line',
      data: [2047.1808, 0, 2455.0256, 0, 0, 0, 1710.3156],
      color: 'rgb(255,172,112,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    },
    {
      name: '(10) fxxdavan',
      type: 'line',
      data: [0, 0, 3204.72, 2800, 0, 0, 0],
      color: 'rgb(12,197,195,1)',
      lineWidth: 3,
      marker: {
        symbol: 'circle',
        radius: 5
      },
      yAxis: 0
    }
  ]
})

// 取得資料
const queryTotalActiveReal = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false

  try {
    const result = await apiQueryTotalActiveReal({
      hall_name: 'esx',
      start_search_year: 2024,
      start_search_month: 7,
      start_search_week: 5,
      start_date: '2024-07-31',
      end_search_year: 2024,
      end_search_month: 8,
      end_search_week: 1,
      end_date: '2024-08-08',
      cut_type: 'week',
      reward_flag: 0,
      reward_date_flag: 0,
      search_activity: []
    })

    const { return_code } = result.data.status

    if (return_code === '0000') {
      apiSuccess.value = true
      // transformActivityMemberPeriodBetAmount(result.data.result)
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

onMounted(() => {
  queryTotalActiveReal()
})
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle
      class="mb-16"
      :title="$t('activity_analysis.activity_active_people')"
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
