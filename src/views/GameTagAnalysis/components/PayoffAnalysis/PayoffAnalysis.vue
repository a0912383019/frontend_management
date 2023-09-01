<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipSingleShared } from '@/utils/highchartsConfig.js'
import CdpMessage from '@/components/CdpMessage.vue'
import { useGlobalStore } from '@/stores/global.js'
import { FormatNumber, errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { apiQueryTagsGamePayoffRank } from '@/api/gameTagAnalysis.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import { storeToRefs } from 'pinia'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const gameTagAnalysisStore = useGameTagAnalysis()
const { filterFormData, filterTimestamp } = storeToRefs(gameTagAnalysisStore)

//api是否成功
const apiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = {
  chart: {
    type: 'column',
    height: 300,
    marginLeft: 80
  },
  legend: {
    enabled: false
  },
  tooltip: {
    ...tooltipDarkConfig,
    shared: true,
    useHTML: true,
    formatter() {
      return tooltipSingleShared({
        data: this.points,
        hallCode: activeHall.hall_code,
        tooltipIconBorder: 1
      })
    }
  },
  yAxis: {
    tickPixelInterval: 50 // 設定 y 軸刻度間距的間隔
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        formatter: function () {
          return FormatNumber(this.y)
        },
        style: {
          fontWeight: 'normal'
        }
      }
    }
  }
}

const pChartOptions = reactive({
  ...chartOptions,
  xAxis: {
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    rotation: -30,
    labels: {
      style: {
        whiteSpace: 'nowrap', // 避免文字換行
        textOverflow: 'none',
        fontSize: 12
      },
      rotation: -25
    }
  },
  series: [{ data: [] }]
})
const nChartOptions = reactive({
  ...chartOptions,
  xAxis: {
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    labels: {
      style: {
        whiteSpace: 'nowrap', // 避免文字換行
        textOverflow: 'none',
        fontSize: 12
      },
      rotation: -25
    }
  },
  series: [{ data: [] }]
})

//取得資料
const queryTagsGamePayoffRank = async (filterData) => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryTagsGamePayoffRank({
      hall_name: activeHall.hall_code,
      game_payoff_analysis_date: filterData.date,
      search_tag_2: filterData.searchTag,
      exclude_tag_2: filterData.excludeTag,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status

    if (return_code === '0001') {
      messageKey.value = 'noResult'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
      return
    }
    if (return_code === '0000' && result.data.result.length !== 0) {
      apiSuccess.value = true
      //整理table對應的資料
      transformTagsGamePayoffRank(result.data.result)
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

const transformTagsGamePayoffRank = (data) => {
  pChartOptions.series[0].data = []
  pChartOptions.xAxis.categories = []
  nChartOptions.series[0].data = []
  nChartOptions.xAxis.categories = []

  //英文版x軸名稱會太長所以整個長度拉長
  chartOptions.chart.height = 300
  chartOptions.chart.marginLeft = 80
  if (i18nLocale.value === 'en') {
    chartOptions.chart.height = 500
    chartOptions.chart.marginLeft = 140
  }
  let sortData = data.sort((a, b) => {
    return parseInt(a['payoff']) - parseInt(b['payoff'])
  })

  let positive20 = []
  let positive20xAxis = []
  let negative20 = []
  let negative20xAxis = []
  for (let i = 0; i < 20; i++) {
    negative20.push({
      y: 0 - parseFloat(sortData[sortData.length - i - 1].payoff),
      color: generateRGBColors(chart_fixed_bgColor[i], 0.7),
      pointWidth: 55 //柱子寬度
    })
    negative20xAxis.push(
      sortData[sortData.length - i - 1].lobby_name +
        '-' +
        sortData[sortData.length - i - 1].game_name
    )

    positive20.push({
      y: 0 - parseFloat(sortData[i].payoff),
      color: generateRGBColors(chart_fixed_bgColor[i], 0.7),
      pointWidth: 55 //柱子寬度
    })
    positive20xAxis.push(sortData[i].lobby_name + '-' + sortData[i].game_name)
  }
  pChartOptions.series[0].data = positive20
  pChartOptions.xAxis.categories = positive20xAxis
  nChartOptions.series[0].data = negative20
  nChartOptions.xAxis.categories = negative20xAxis
}

onMounted(() => {
  queryTagsGamePayoffRank(filterFormData.value)
})

watch([() => filterTimestamp.value, i18nLocale], () => {
  queryTagsGamePayoffRank(filterFormData.value)
})
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-10" :title="t('game_tag_analysis.game_payoff_rank_positive20')">
      <template #tooltip>
        <div class="font-size-14">
          {{ $t('game_tag_analysis.aggregated_from_total_payoff') }}
        </div>
      </template>
    </SectionTitle>
    <CdpMessage
      :messageKey="messageKey"
      bg="white"
      v-if="apiSuccess === false"
      class="mt-25 font-size-16"
    />
    <highcharts v-else :options="pChartOptions"></highcharts>
  </section>
  <section class="cdp-section mb-0">
    <SectionTitle class="mb-10" :title="t('game_tag_analysis.game_payoff_rank_negative20')">
      <template #tooltip>
        <div class="font-size-14">
          {{ $t('game_tag_analysis.aggregated_from_total_payoff') }}
        </div>
      </template>
    </SectionTitle>
    <CdpMessage
      :messageKey="messageKey"
      bg="white"
      v-if="apiSuccess === false"
      class="mt-25 font-size-16"
    />
    <highcharts v-else :options="nChartOptions"></highcharts>
  </section>
</template>
<style lang="scss" scoped>
.mb-0 {
  margin-bottom: 0px;
}
</style>
