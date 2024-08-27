<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryGrowthActivity } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { dayjs } from 'element-plus'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import ConfirmBox from '@/components/ConfirmBox.vue'
import { sortTableDate } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()

const apiSuccess = ref(false)
const messageKey = ref('loading')

const tableData = ref([])

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
    categories: ['2024-05-20~2024-05-26', '2024-05-27~2024-06-02', '2024-06-03~2024-06-09'],
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
      name: '測試',
      type: 'line',
      data: [0, -27, 30],
      color: 'rgb(241,78,78,1)',
      lineWidth: 2,
      marker: {
        symbol: 'circle',
        radius: 3
      },
      yAxis: 0
      // tooltip: {
      //   valueSuffix: '%'
      // }
    }
    // {
    //   name: '(2) jeffhsu',
    //   type: 'line',
    //   data: [-719, -384, -398, -475, -475, -475, -2795],
    //   color: 'rgb(0,192,236,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(3) mike',
    //   type: 'line',
    //   data: [-1813.55, -1798.22, -1798.22, -1798.22, -1798.22, -1798.22, -1799.22],
    //   color: 'rgb(69,137,166,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(4) hope04',
    //   type: 'line',
    //   data: [0, 0, -1500, -1500, -1500, -1500, -1500],
    //   color: 'rgb(251,201,201,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(5) chihpkr01',
    //   type: 'line',
    //   data: [-903.468, -903.468, -903.468, -903.468, -903.468, -903.468, -903.468],
    //   color: 'rgb(209,214,222,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(6) chihkhr2',
    //   type: 'line',
    //   data: [-903.1187, -903.1187, -903.1187, -903.1187, -903.1187, -903.1187, -903.1187],
    //   color: 'rgb(200,200,240,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(7) chihesb002',
    //   type: 'line',
    //   data: [0, 0, -448, -448, -448, -448, -448],
    //   color: 'rgb(255,107,0,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(8) rmb14',
    //   type: 'line',
    //   data: [0, 0, -429.3, -430.16, -430.16, -430.16, -430.16],
    //   color: 'rgb(235,214,173,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(9) guspig43',
    //   type: 'line',
    //   data: [138, -1137.64, -405.08, -405.08, -405.08, -405.08, -405.08],
    //   color: 'rgb(255,172,112,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // },
    // {
    //   name: '(10) chihjpy01',
    //   type: 'line',
    //   data: [-387.703, -387.703, -387.703, -387.703, -387.703, -387.703, -387.703],
    //   color: 'rgb(12,197,195,1)',
    //   lineWidth: 3,
    //   marker: {
    //     symbol: 'circle',
    //     radius: 5
    //   },
    //   yAxis: 0
    // }
  ]
})

// 取得資料
const queryGrowthActivity = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  tableData.value = []

  try {
    const result = await apiQueryGrowthActivity({
      hall_name: 'esb',
      start_search_year: 2024,
      start_search_month: 5,
      start_search_week: 3,
      start_date: '2024-05-24',
      end_search_year: 2024,
      end_search_month: 8,
      end_search_week: 3,
      end_date: '2024-08-23',
      cut_type: 'week',
      reward_flag: 1,
      reward_date_flag: 0,
      search_activity: [1]
    })

    const { return_code } = result.data.status
    console.log(return_code)
    // if (return_code === '0000') {
    //   apiSuccess.value = true
    //   if (result.data.result.length !== 0) {
    //     tableData.value = transformActivityList(result.data.result)
    //     upadteCurrentSort({ prop: 'createdTime', order: 'descending' })
    //   }
    // }
  } catch (error) {
    console.error(error)
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

// const transformActivityList = (data) => {
//   let activityList = []
//   data.forEach((ele) => {
//     activityList.push({
//       activityName: ele.activity_name,
//       operator: ele.operator_name,
//       createdTime: dayjs(ele.created_time).format(t('date.format_datetime_rule')),
//       activityId: ele.activity_id,
//       canOperate: ele.can_operate
//     })
//   })
//   return activityList
// }

// 自定義排序執行的內容
// const upadteCurrentSort = ({ prop, order }) => {
//   sortTableDate({ prop, order, tableData: tableData.value })
// }

// watch(
//   () => activityStore.filtered,
//   () => {
//     queryGrowthActivity()
//   }
// )

// watch(
//   () => activityStore.activityAddChange,
//   () => {
//     queryGrowthActivity()
//   }
// )

onMounted(() => {
  queryGrowthActivity()
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
