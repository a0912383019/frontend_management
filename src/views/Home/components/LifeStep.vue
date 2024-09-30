<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryLatestLifeCycleSummary } from '@/api/home.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { RFM_NAPL_step_config } from '@/../public/js/system_config.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipFormatter } from '@/utils/highchartsConfig.js'
import {
  FormatNumber,
  errorRespond,
  formatDateDuration,
  generateRGBColors
} from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'

const { LAST_DATE } = useDateStore()

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { tableConfig } = storeToRefs(globalStore)

const apiSuccess = ref(true) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const stepDataDuration = ref(
  dayjs(LAST_DATE).subtract(29, 'day').format(t('date.format_date_rule')) +
    '~' +
    dayjs(LAST_DATE).format(t('date.format_date_rule'))
)

const chartOptions = reactive({
  chart: {
    type: 'pie',
    height: 380
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    useHTML: true,
    symbolRadius: 0,
    symbolWidth: 0,
    symbolHeight: 0,
    labelFormatter: function () {
      return `
        <div class="flex">
          <div style="
            background-color:${this.options.color};
            width: 12px;
            height: 12px;
            margin-right: 6px;
            margin-top: 3px;
          "></div>
          <div>${this.name}</div>
        </div>
      `
    }
  },
  tooltip: {
    ...tooltipDarkConfig,
    useHTML: true,
    formatter() {
      return tooltipFormatter({ data: this, unit: t('unit.people'), tooltipIconBorder: true })
    }
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'default',
      borderRadius: 0,
      borderWidth: 1,
      showInLegend: true,
      dataLabels: {
        enabled: true,
        formatter: function () {
          return '<span style="font-size:14px; color:#FFF;">' + FormatNumber(this.y) + '</span>'
        },
        useHTML: true,
        distance: '-40%',
        filter: {
          property: 'percentage',
          operator: '>',
          value: 4
        }
      }
    }
  },
  series: [{ data: [] }]
})

//取得資料
const queryLatestLifeCycleSummary = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  if (activeHall.hall_code === '') return
  try {
    const result = await apiQueryLatestLifeCycleSummary({
      hall_name: activeHall.hall_code,
      search_date: formatDateDuration(stepDataDuration.value)
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      if (result.data.result && result.data.result.length !== 0) {
        apiSuccess.value = true
        //整理table對應的資料
        transformLifeCycleData(result.data.result)
      } else {
        messageKey.value = 'noResult'
      }
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

// // 轉換資料
const transformLifeCycleData = (result) => {
  clearChart()
  let data = result.map((ele) => {
    return {
      name: tableConfig.value[ele.this_day_step]['step_name'],
      y: ele.total_num,
      color: generateRGBColors(RFM_NAPL_step_config[ele.this_day_step].step_color, 1),
      borderColor: generateRGBColors(RFM_NAPL_step_config[ele.this_day_step].step_color, 1)
    }
  })

  chartOptions.series[0].data = data
}

const clearChart = () => {
  chartOptions.series[0].data = []
}

onMounted(() => {
  queryLatestLifeCycleSummary()
})
</script>
<template>
  <section class="cdp-section h-444">
    <SectionTitle class="mb-15" :title="$t('home.member_life_cycles')">
      <template #tooltip>
        <div class="font-size-14">
          {{ $t('home.excluding_who_did_not_bet_for_the_last_30_days') }}
          <br />
          {{ $t('date.statistical_time_period') + stepDataDuration }}
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
