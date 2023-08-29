<script setup>
import { ref, computed, reactive } from 'vue'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { formatDate, errorRespond } from '@/utils/commonUtils.js'
import { ElNotification, dayjs } from 'element-plus'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import { apiQueryMemberRecentWeekLively } from '@/api/home.js'
import { apiQueryMemberRecentLively } from '@/api/home.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()
const dialogVisible = ref(false)

const globalStore = useGlobalStore()
const { activeHall } = globalStore

// //api是否成功
const weekApiSuccess = ref(false)
const dayApiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const weekMessageKey = ref('shortLoading')
const dayMessageKey = ref('shortLoading')

const userName = ref('')

const lastWeekDuration = computed(() => {
  return (
    dayjs().subtract(15, 'day').startOf('day').format(t('date.format_date_rule')) +
    ' ~ ' +
    dayjs().subtract(9, 'day').startOf('day').format(t('date.format_date_rule'))
  )
})

const thisWeekDuration = computed(() => {
  return (
    dayjs().subtract(8, 'day').startOf('day').format(t('date.format_date_rule')) +
    ' ~ ' +
    dayjs().subtract(2, 'day').startOf('day').format(t('date.format_date_rule'))
  )
})

const activeStepTableData = ref([])
//頁面點擊排名欄位
const activeStepTableColumns = computed(() => {
  return [
    {
      label: t('date.date_duration'),
      prop: 'duration',
      align: 'center'
    },
    {
      label: t('member_active_level.avg_activity_level'),
      prop: 'avgLevel',
      align: 'center',
      width: 300
    }
  ]
})

//取得資料
const queryMemberRecentWeekLively = async (user_id) => {
  weekMessageKey.value = 'shortLoading'
  weekApiSuccess.value = false
  try {
    const result = await apiQueryMemberRecentWeekLively({
      hall_name: activeHall.hall_code,
      member_id: user_id,
      start_date: formatDate(lastWeekDuration.value.split('~')[0].trim()),
      end_date: formatDate(thisWeekDuration.value.split('~')[1].trim())
    })
    const { return_code } = result.data.status

    if (return_code === '0001') {
      weekMessageKey.value = 'chartFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
    }
    if (return_code === '0000' && result.data.result.length !== 0) {
      weekApiSuccess.value = true
      //整理table對應的資料
      transformMemberRecentWeekLively(result.data.result)
    } else {
      weekMessageKey.value = 'noResult'
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
const transformMemberRecentWeekLively = (data) => {
  activeStepTableData.value = [
    {
      duration: thisWeekDuration,
      avgLevel: data[0].avg_action_score
    },
    {
      duration: lastWeekDuration,
      avgLevel: data[1].avg_action_score
    }
  ]
}

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

//取得資料
const queryMemberRecentLively = async (user_id) => {
  dayMessageKey.value = 'shortLoading'
  dayApiSuccess.value = false
  try {
    const result = await apiQueryMemberRecentLively({
      hall_name: activeHall.hall_code,
      member_id: user_id,
      start_date: formatDate(lastWeekDuration.value.split('~')[0].trim()),
      end_date: formatDate(thisWeekDuration.value.split('~')[1].trim())
    })
    const { return_code } = result.data.status

    if (return_code === '0001') {
      dayMessageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
    }
    if (return_code === '0000' && result.data.result.length !== 0) {
      dayApiSuccess.value = true
      //整理table對應的資料
      transformMemberRecentLively(result.data.result)
    } else {
      dayMessageKey.value = 'chartFailed'
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
const transformMemberRecentLively = (data) => {
  clearChart()
  const chartSeries = {
    name: t('member_active_level.active_level'),
    lineWidth: 2,
    data: data.map((ele) => parseFloat(ele.action_score))
  }

  const chartXAxis = data.map((ele) => dayjs(ele.data_date).format(t('date.format_date_rule')))
  chartOptions.series.push(chartSeries)
  chartOptions.xAxis.categories = chartXAxis
}

const clearChart = () => {
  chartOptions['xAxis']['categories'] = []
  chartOptions['series'] = []
}

//開啟 dialog
const handleOpenDialog = (user) => {
  dialogVisible.value = true
  userName.value = user.user_name
  queryMemberRecentWeekLively(user.user_id)
  queryMemberRecentLively(user.user_id)
}

defineExpose({ handleOpenDialog })
</script>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog cdp-member-activity-dialog"
      :append-to-body="true"
      :destroy-on-close="true"
      :alignCenter="true"
    >
      <template #header>
        <span class="cdp-dialog__header">
          {{ $t('member_active_level.active_level_breakdown') }}
          <span class="underline ml-10">
            {{ userName }}
          </span>
        </span>
      </template>
      <div class="cdp-section mb-0">
        <SectionTitle
          class="mb-10"
          :title="t('member_active_level.weekly_active_level')"
        ></SectionTitle>
        <CdpMessage
          :messageKey="weekMessageKey"
          bg="white"
          v-if="weekApiSuccess === false"
          class="mt-25 font-size-16"
        />
        <CustomTable
          v-else
          :hasPagination="false"
          :tableData="activeStepTableData"
          :tableColumns="activeStepTableColumns"
          border
          :serverSide="false"
        >
        </CustomTable>
        <SectionTitle
          class="mt-20 mb-10"
          :title="t('member_active_level.daily_active_level')"
        ></SectionTitle>
        <CdpMessage
          :messageKey="dayMessageKey"
          bg="white"
          v-if="dayApiSuccess === false"
          class="mt-25 font-size-16"
        />
        <highcharts v-else :options="chartOptions"></highcharts>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    background-color: #fff;
  }
  &__header {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: bold;
  }
}

.underline {
  text-decoration: underline;
}
</style>
<style lang="scss">
.cdp-member-activity-dialog {
  &.cdp-dialog {
    width: 100%;
    max-width: 85%;
  }
}
</style>
