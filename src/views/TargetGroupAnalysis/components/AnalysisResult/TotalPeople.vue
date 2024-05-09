<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryTotalPeople } from '@/api'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipFormatter } from '@/utils/highchartsConfig.js'
import { FormatNumber, errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'

const { t } = useI18n()

const props = defineProps({
  targetId: {
    type: String
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()
const { filtered } = storeToRefs(targetGroup)

const apiSuccess = ref(true) // api是否成功
// 依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    type: 'pie',
    height: 280
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
      return tooltipFormatter({ data: this, unit: t('unit.people'), tooltipIconBorder: false })
    }
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
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
          value: 5
        }
      }
    }
  },
  series: [{ data: [] }]
})

// 取得資料
const queryTotalPeople = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryTotalPeople({
      hall_name: activeHall.hall_code,
      id: props.targetId
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      if (result.data.result) {
        transformTotalPeople(result.data.result)
        apiSuccess.value = true
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
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' // 更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' // 更改message內容
    }
  }
}

// 轉換資料
const transformTotalPeople = (result) => {
  clearChart()
  let data = result.map((ele, idx) => {
    return {
      name: ele.custom_tags_name,
      y: ele.total_people,
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      borderColor: generateRGBColors(chart_fixed_bgColor[idx], 1)
    }
  })

  chartOptions.series[0].data = data
}

const clearChart = () => {
  chartOptions.series[0].data = []
}

watch(
  () => filtered.value,
  () => {
    queryTotalPeople()
  }
)

onMounted(() => {
  queryTotalPeople()
})
</script>
<template>
  <section class="cdp-section-in h-350">
    <SectionTitle class="mb-5" :title="$t('target_group_analysis.total_people')"></SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" :height="290" v-if="apiSuccess === false" />
    <template v-else>
      <highcharts :options="chartOptions"></highcharts>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
