<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodLoginGACount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipAddSign } from '@/utils/highchartsConfig.js'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    type: 'line',
    zoomType: 'xy',
    height: 322
  },
  legend: {
    verticalAlign: 'top'
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
  yAxis: [
    {
      title: {
        text: t('data_name.login_num')
      },
      minorTicks: true,
      minorTickColor: '#e8e8e8',
      minorTickPosition: 'outside',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorGridLineWidth: 0,
      gridLineWidth: 0
    },
    {
      title: {
        text: t('data_name.ga_num')
      },
      minorTicks: true,
      minorTickColor: '#e8e8e8',
      minorTickPosition: 'outside',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      opposite: true
    }
  ],
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipAddSign({ data: this.points, date: this.x, sign: t('unit.times') })
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        formatter: function () {
          return FormatNumber(this.y)
        }
      }
    }
  },
  series: []
})

//取得資料
const queryMemberPeriodLoginGACount = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodLoginGACount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      apiSuccess.value = true
      //整理table對應的資料
      transformLoginData(result.data.result)
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

// 轉換資料
const transformLoginData = (data) => {
  clearChart()
  chartOptions.xAxis.categories = data.map((ele) =>
    dayjs(ele.data_date).format(t('date.format_date_rule'))
  )
  const series = [
    {
      name: t('data_name.login_num'),
      type: 'line',
      data: data.map((ele) => Number(ele.login_count)),
      color: 'rgba(245,105,84,1)',
      lineWidth: 2,
      yAxis: 0
    },
    {
      name: t('data_name.ga_num'),
      type: 'line',
      data: data.map((ele) => Number(ele.ga_count)),
      color: 'rgba(60,141,188,1)',
      lineWidth: 2,
      yAxis: 1
    }
  ]
  //當資料量超過兩個月時，關閉dataLabels
  if (data.length > 40) {
    chartOptions.plotOptions.series.dataLabels.enabled = false
    chartOptions.xAxis.labels.style.fontSize = '12px'
  } else {
    chartOptions.plotOptions.series.dataLabels.enabled = true
    chartOptions.xAxis.labels.style.fontSize = '12.8px'
  }
  chartOptions.series = series
}

const clearChart = () => {
  chartOptions['xAxis']['categories'] = []
  chartOptions['series'] = []
}

onMounted(() => {
  queryMemberPeriodLoginGACount()
})
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle class="mb-15" :title="$t('data_name.login_num') + ' / ' + $t('data_name.ga_num')">
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <div class="cursor-pointer">
        <highcharts :options="chartOptions"></highcharts>
      </div>
    </template>
  </section>
</template>
<style lang="scss" scoped>
.cdp-section-in {
  display: flex;
  flex-direction: column;
  height: 100%;
  :deep(.message) {
    margin-top: auto;
    margin-bottom: auto;
  }
}
</style>
