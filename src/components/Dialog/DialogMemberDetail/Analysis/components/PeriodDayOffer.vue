<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodDayOffer } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { FormatNumber, errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { ElNotification, dayjs } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //會員生命週期階段api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    type: 'area',
    height: 300
  },
  legend: {
    verticalAlign: 'top'
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    tickInterval: 1,
    categories: [],
    labels: {
      style: {
        fontSize: '14px'
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
        enabled: false,
        formatter: function () {
          return FormatNumber(this.y)
        }
      }
    }
  },
  series: []
})

//取得資料
const queryMemberPeriodDayOffer = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodDayOffer({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      transformMemberPeriodDayOffer(result.data.result)
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
const transformMemberPeriodDayOffer = (data) => {
  clearChart()
  //複製第一筆資料
  let dataClone = { ...data[0] }
  delete dataClone.data_date
  let dataKey = Object.keys(dataClone)

  let dateArr = data.map((ele) => dayjs(ele.data_date).format(t('date.format_date_rule'))) //x軸日期
  let dataSet = {}
  dataKey.map((ele, idx) => {
    dataSet[ele] = {
      name: dataClone[ele].opcode_name,
      marker: {
        symbol: 'circle'
      },
      lineWidth: 2,
      fillColor: generateRGBColors(chart_fixed_bgColor[idx], 0.3),
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      data: data.map((item) => {
        return parseFloat(item[ele].premium_amount)
      })
    }
  })

  //當資料量太大時，關閉dataLabels
  if (data.length > 40) {
    chartOptions.plotOptions.series.dataLabels.enabled = false
    chartOptions.xAxis.labels.style.fontSize = '12px'
  } else {
    chartOptions.plotOptions.series.dataLabels.enabled = true
    chartOptions.xAxis.labels.style.fontSize = '12.8px'
  }

  chartOptions.xAxis.categories = dateArr
  Object.keys(dataSet).forEach((item) => {
    chartOptions.series.push(dataSet[item])
  })
}

const clearChart = () => {
  chartOptions['xAxis']['categories'] = []
  chartOptions['series'] = []
}

onMounted(() => {
  queryMemberPeriodDayOffer()
})
watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryMemberPeriodDayOffer()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.daily_bonuses')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 5 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <div class="cursor-pointer">
        <highcharts :options="chartOptions"></highcharts>
      </div>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
