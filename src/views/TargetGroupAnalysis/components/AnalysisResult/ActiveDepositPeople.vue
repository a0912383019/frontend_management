<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryActivePeople, apiQueryDepositPeople } from '@/api'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipAddSign } from '@/utils/highchartsConfig.js'
import { dayjs } from 'element-plus'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()
const { groupFilterDate, filtered } = storeToRefs(targetGroup)

const props = defineProps({
  targetId: {
    type: String
  },
  kind: {
    type: String,
    default: 'ActivePeople'
  }
})

const title = computed(() => {
  if (props.kind === 'ActivePeople') {
    return 'target_group_analysis.daily_active_people'
  } else if (props.kind === 'DepositPeople') {
    return 'target_group_analysis.daily_deposit_people'
  }
})

const chartOptions = reactive({
  chart: {
    type: 'line',
    height: 270,
    marginLeft: 50
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
      return tooltipAddSign({ data: this.points, date: this.x, sign: t('unit.people') })
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

const apiSuccess = ref(false) // 會員生命週期階段api是否成功
// 依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

// 取得資料
const queryActiveDeposit = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    let result = null
    if (props.kind === 'ActivePeople') {
      result = await apiQueryActivePeople({
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
    } else if (props.kind === 'DepositPeople') {
      result = await apiQueryDepositPeople({
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

  let groupkey = ''
  let valueKey = ''
  if (props.kind === 'ActivePeople') {
    groupkey = 'custom_tag_data'
    valueKey = 'active_people'
  } else if (props.kind === 'DepositPeople') {
    groupkey = 'custom_tag_deposit_data'
    valueKey = 'deposit_people'
  }
  // 複製第一筆資料
  let dataClone = { ...data[0][groupkey] }
  let dataKey = Object.keys(dataClone)

  let dateArr = data.map((ele) => dayjs(ele.date).format(t('date.format_date_rule'))) // x軸日期
  let dataSet = {}
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
        return parseFloat(item[groupkey][ele][valueKey])
      })
    }
  })

  chartOptions.xAxis.categories = dateArr

  Object.keys(dataSet).forEach((item) => {
    chartOptions.series.push(dataSet[item])
  })
}

const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series = []
}

watch(
  () => filtered.value,
  () => {
    queryActiveDeposit()
  }
)

onMounted(() => {
  queryActiveDeposit()
})
</script>
<template>
  <section class="cdp-section-in h-325">
    <SectionTitle class="mb-5" :title="$t(title)"></SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" class="mt-100" />
    <div v-else class="cursor-pointer">
      <highcharts :options="chartOptions"></highcharts>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    border-radius: 5px;
    border: 1px #e6eaf2 solid;
  }
  &__header {
    color: #fff;
  }
}
.mt-100 {
  margin-top: 90px;
}
</style>
