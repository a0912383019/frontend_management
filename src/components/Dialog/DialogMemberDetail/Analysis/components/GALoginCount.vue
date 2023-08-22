<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodLoginGACount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipAddSign } from '@/utils/highchartsConfig.js'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import { ElNotification, dayjs } from 'element-plus'

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
      member_id: dialogMemberDetailStore.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code !== '0001') {
      if (return_code === '0000') {
        if (result.data.result.length !== 0) {
          apiSuccess.value = true
          //整理table對應的資料
          transformLoginData(result.data.result)
        } else {
          messageKey.value = 'noResult'
        }
      } else {
        messageKey.value = 'chartFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } else {
      messageKey.value = 'noResult'
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

watch(
  () => dialogMemberDetailRangeDate.value,
  () => {
    queryMemberPeriodLoginGACount()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('data_name.login_num') + ' / ' + t('data_name.ga_num')">
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
