<script setup>
import { ref, reactive, onMounted } from 'vue'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores'
import { apiQueryMemberRecentLively } from '@/api'
import { errorRespond, FormatNumber } from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'

const props = defineProps({
  data: Object
})

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

// api是否成功
const apiSuccess = ref(true)

// 依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    type: 'area',
    height: 250
  },
  legend: {
    enabled: false // 关闭图例
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
        fontSize: '12px'
      }
    }
  },
  yAxis: {
    min: 0,
    max: 1,
    gridLineColor: '#e8e8e8'
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipShared({ data: this.points, date: this.x, precision: 3 })
    }
  },
  plotOptions: {
    area: {
      color: 'rgba(245,105,84,1)',
      fillOpacity: 0.4
    },
    series: {
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 'normal'
        }
      }
    }
  },
  series: []
})

// 取得資料
const queryMemberRecentLively = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberRecentLively({
      hall_name: activeHall.hall_code,
      user_id: props.data.user_id,
      start_date: props.data.startDate,
      end_date: props.data.endDate
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformMemberRecentLively(result.data.result)
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'chartFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed'
    }
  }
}

// 轉換資料
const transformMemberRecentLively = (data) => {
  clearChart()
  const chartSeries = {
    name: t('member_active_level.active_level'),
    lineWidth: 2,
    data: data.map((ele) => parseFloat(FormatNumber(ele.action_score, '', 3)))
  }

  const chartXAxis = data.map((ele) => dayjs(ele.data_date).format(t('date.format_date_rule')))
  chartOptions.series.push(chartSeries)
  chartOptions.xAxis.categories = chartXAxis
}

const clearChart = () => {
  chartOptions.xAxis.categories = []
  chartOptions.series = []
}

onMounted(() => {
  queryMemberRecentLively()
})
</script>
<template>
  <div>
    <SectionTitle
      :title="$t('member_active_level.daily_active_level')"
      class="mb-15"
    ></SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <highcharts v-else :options="chartOptions"></highcharts>
  </div>
</template>
<style lang="scss" scoped></style>
