<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Tab from '@/components/Tab.vue'
import { apiQueryBetAmountAndPayoff } from '@/api'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()
const { groupFilterDate, filtered } = storeToRefs(targetGroup)

const props = defineProps({
  targetId: {
    type: String
  }
})

// 當前顯示的tab
const currentTabs = ref('DailyBetAmount')
const tabList = computed(() => {
  return [
    {
      name: 'DailyBetAmount',
      label: t('target_group_analysis.daily_bet_amount')
    },
    {
      name: 'DailtProfit',
      label: t('target_group_analysis.daily_payoff')
    }
  ]
})

const betAmountOptions = reactive({
  chart: {
    type: 'line',
    height: 250
  },
  legend: {
    verticalAlign: 'top',
    align: 'center',
    useHTML: true,
    symbolRadius: 0,
    symbolWidth: 0,
    symbolHeight: 0,
    labelFormatter: function () {
      return `
        <div class="flex">
          <div style="
            background-color:${this.options.color};
            width: 40px;
            height: 12px;
            margin-right: 6px;
            margin-top: 3px;
          "></div>
          <div>${this.name}</div>
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
    series: {
      dataLabels: {
        enabled: false
      },
      events: {
        // 點擊 legend會導致 x軸 label跑掉
        legendItemClick: function () {
          var _redraw = this.chart.redraw
          this.chart.xAxis[0].update({ redraw: false })

          this.chart.redraw = function () {}
          this.chart.xAxis[0].update({ redraw: true })

          this.chart.redraw = _redraw
        },
        click: function (event) {
          // 因為每次執行 series的 function都會重新 redraw導致速度很慢
          var _redraw = this.chart.redraw
          this.chart.xAxis[0].update({ redraw: false })

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

          this.chart.xAxis[0].update({ redraw: true })

          this.chart.redraw = _redraw
          this.chart.redraw()
        }
      }
    }
  },
  series: []
})

const profitOptions = Object.assign({}, betAmountOptions)

const apiSuccess = ref(false) // 會員生命週期階段api是否成功
// 依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

// 取得資料
const queryBetAmountAndPayoff = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryBetAmountAndPayoff({
      search_date: groupFilterDate.value,
      hall_name: activeHall.hall_code,
      id: props.targetId
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformApiData(result.data.result)
      apiSuccess.value = true
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
      messageKey.value = 'noPermission' // 更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' // 更改message內容
    }
  }
}

const transformApiData = (data) => {
  clearChart()

  // 複製第一筆資料
  let dataClone = { ...data[0].custom_tag_bet_amount_payoff_data }
  let dataKey = Object.keys(dataClone)

  let dateArr = data.map((ele) => dayjs(ele.date).format(t('date.format_date_rule'))) // x軸日期
  let dataSet = {}
  let dataSet2 = {}
  dataKey.map((ele, idx) => {
    dataSet[ele] = {
      name: dataClone[ele].custom_tags_name,
      marker: {
        symbol: 'circle'
      },
      lineWidth: 2,
      fillColor: generateRGBColors(chart_fixed_bgColor[idx], 0.3),
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      data: data.map((item) => {
        return parseFloat(item.custom_tag_bet_amount_payoff_data[ele].bet_amount)
      })
    }
    dataSet2[ele] = {
      name: dataClone[ele].custom_tags_name,
      marker: {
        symbol: 'circle'
      },
      lineWidth: 2,
      fillColor: generateRGBColors(chart_fixed_bgColor[idx], 0.3),
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      data: data.map((item) => {
        return parseFloat(item.custom_tag_bet_amount_payoff_data[ele].payoff)
      })
    }
  })

  betAmountOptions.xAxis.categories = dateArr
  profitOptions.xAxis.categories = dateArr

  Object.keys(dataSet).forEach((item) => {
    betAmountOptions.series.push(dataSet[item])
  })
  Object.keys(dataSet2).forEach((item) => {
    profitOptions.series.push(dataSet2[item])
  })
}

const clearChart = () => {
  betAmountOptions.xAxis.categories = []
  betAmountOptions.series = []
  profitOptions.xAxis.categories = []
  profitOptions.series = []
}

watch(
  () => filtered.value,
  () => {
    queryBetAmountAndPayoff()
  }
)

onMounted(() => {
  queryBetAmountAndPayoff()
})
</script>
<template>
  <section class="cdp-section-in h-350">
    <div class="cdp-dialog__content">
      <el-row :gutter="20" class="mb-16">
        <el-col :span="13">
          <Tab
            :tabData="tabList"
            :activeName="currentTabs"
            v-model="currentTabs"
          ></Tab>
        </el-col>
      </el-row>
      <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" class="mt-100" />
      <div v-if="apiSuccess && currentTabs === 'DailyBetAmount'" class="cursor-pointer">
        <highcharts :options="betAmountOptions"></highcharts>
      </div>
      <div v-if="apiSuccess && currentTabs === 'DailtProfit'" class="cursor-pointer">
        <highcharts :options="profitOptions"></highcharts>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.mt-100 {
  margin-top: 100px;
}
</style>
