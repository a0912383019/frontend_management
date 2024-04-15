<script setup>
import { ref, watch, onMounted, toRefs, reactive } from 'vue'
import { useGlobalStore, useDataRankAnalysisStore } from '@/stores'
import { generateRGBColors, generateMultipleColors } from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { latest_chart_color } from '@/../public/js/system_config.js'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dataRankStore = useDataRankAnalysisStore()

const props = defineProps({
  apiObject: {
    apiSuccess: Boolean,
    messageKey: String,
    result: Object
  },
  sectionWidth: Number
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
    tickWidth: 1,
    categories: [],
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
  series: []
})

//轉換資料
const transformBetAmountDailyRank = (data) => {
  clearChart()
  chartOptions.xAxis.categories = data.daily.map((ele) => {
    const { fin_year, fin_month, fin_week } = ele.date
    return `${fin_year}/${dayjs(fin_year + '/' + fin_month + '/01').format('MM')}/W${fin_week}`
  })

  // 儲存排名會員名稱
  let userNameList = []
  for (let i = 0; i < data.rank.length; i++) {
    userNameList.push(data.rank[i].user_name)
  }

  let series = []
  let color = []

  // 會員超過20人產生隨機50種顏色
  if (userNameList.length > 20) {
    color = generateMultipleColors(50)['bg']
  }
  for (let i = 0; i < userNameList.length; i++) {
    let userData = {
      name: '(' + (i + 1) + ') ' + userNameList[i],
      type: 'line',
      data: data.daily.map((ele) => {
        // 根據會員名稱遍歷取得該會員資料
        const index = ele.users.findIndex((item) => item.user_name === userNameList[i])
        if (index !== -1) {
          return Number(ele.users[index].commissionable)
        }
      }),
      // 超過20個會員資料時顏色使用隨機
      color: userNameList.length > 20 ? color[i] : generateRGBColors(latest_chart_color[i], 1),
      lineWidth: 3,
      marker: {
        symbol: 'circle', // 點點樣式
        radius: 5 // 點點大小
      },
      yAxis: 0
    }
    series.push(userData)
  }
  chartOptions.series = series
}

const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series = []
}

watch([() => apiObject.value.apiSuccess, () => apiObject.value.messageKey], () => {
  apiSuccess.value = apiObject.value.apiSuccess
  messageKey.value = apiObject.value.messageKey
  if (apiObject.value.apiSuccess) {
    if (apiObject.value.result.rank.length === 0) {
      apiSuccess.value = false
      messageKey.value = 'noResult'
    } else {
      transformBetAmountDailyRank(apiObject.value.result)
    }
  }
})

onMounted(() => {
  if (apiObject.value.apiSuccess && Object.keys(apiObject.value.result).length !== 0) {
    if (apiObject.value.result.rank.length === 0) {
      apiSuccess.value = false
      messageKey.value = 'noResult'
    } else {
      transformBetAmountDailyRank(apiObject.value.result)
    }
  }
})
</script>
<template>
  <section class="section">
    <SectionTitle class="mb-15" :title="$t('rank_analysis.ranking_member_weekly_bet_amount')">
      <template #tooltip>
        <div class="font-size-14">
          {{ $t('rank_analysis.display_search_fin_week_previous_month_data') }}
        </div>
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <div class="cursor-pointer">
        <highcharts
          :options="chartOptions"
          v-if="dataRankStore.currentTab === 'Growth'"
        ></highcharts>
        <highcharts
          :options="chartOptions"
          v-if="dataRankStore.currentTab === 'Decline'"
        ></highcharts>
      </div>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
