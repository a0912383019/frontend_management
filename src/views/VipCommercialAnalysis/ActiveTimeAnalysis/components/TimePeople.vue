<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { tooltipDarkConfig, tooltipAddSignForCol } from '@/utils/highchartsConfig.js'
import { apiActiveTimePeople } from '@/api/vipCommercialAnalysis.js'
import { stringToIntArray, errorRespond } from '@/utils/commonUtils.js'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { activeTimeAnalysisFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const apiSuccess = ref(true) //api是否成功

// 依照不同的messageKey產生不同的message
const messageKey = ref('loading')

const xAxisName = computed(()=>{
  let chart_labels = []
  for (let i = 0; i < 24; i++) {
    chart_labels.push(
      t('vip_commercial_analysis.clock_interval', {
        count: i,
        convert_hour: i % 12 === 0 ? 12 : i % 12,
        am_pm: i < 12 ? 'AM' : 'PM'
      })
    )
  }

  return chart_labels
})

const chartOptions = reactive({
  chart: {
    type: 'column',
    height: 600
  },
  xAxis: {
    categories: xAxisName,
    gridLineWidth: 1
  },
  yAxis: {
    min: 0
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        formatter: function () {
          return this.y
        }
      }
    }
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    useHTML: true,
    formatter() {
      return tooltipAddSignForCol({ data: this, sign: t('unit.people') })
    }
  },
  series: [
    {
      data: [],
      color: 'rgb(245,105,84,0.7)',
      borderColor: 'rgb(245,105,84,1)',
      borderWidth: 2,
      events: {
        click: function (event) {
          console.log(event)
        }
      }
    }
  ]
})

// 取得活躍時段人數
const queryActiveTimePeople = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiActiveTimePeople({
      hall_name: activeHall.hall_code,
      contain_weeks: stringToIntArray(activeTimeAnalysisFilter.containWeeks),
      vip_tag: stringToIntArray(activeTimeAnalysisFilter.vipTag),
      search_date: activeTimeAnalysisFilter.searchDate,
      search_name: activeTimeAnalysisFilter.searchName,
      fuzzy_search: activeTimeAnalysisFilter.fuzzySearch,
      use_custom_list: activeTimeAnalysisFilter.useCustomList
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformActiveTimePeople(result.data.result)
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed'
    }
  }
}

function transformActiveTimePeople(data) {
  chartOptions.series[0].data = data
}

onMounted(() => {
  queryActiveTimePeople()
})
defineExpose({ queryActiveTimePeople })
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle class="mb-15" :title="$t('vip_commercial_analysis.active_time_people_num')">
      <template #tooltip>
        <div class="tooltip-date">
          <div>{{ $t('date.statistic_time_based_ET') }}</div>
        </div>
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" :height="320" v-if="apiSuccess === false" />
    <template v-else>
      <highcharts :options="chartOptions"></highcharts>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
