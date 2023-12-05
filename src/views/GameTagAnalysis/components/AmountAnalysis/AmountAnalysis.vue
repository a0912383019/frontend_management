<script setup>
import { ref, watch, onMounted, nextTick, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'
import { apiQueryTagsGameRank } from '@/api/gameTagAnalysis.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { ElNotification } from 'element-plus'
import {
  generateRGBColors,
  errorRespond,
  dynamicBackgroundColors,
  FormatNumber,
  trimBack
} from '@/utils/commonUtils.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { tooltipDarkConfig, tooltipSingleShared } from '@/utils/highchartsConfig.js'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const gameTagAnalysisStore = useGameTagAnalysis()
const { filterFormData, filterTimestamp } = storeToRefs(gameTagAnalysisStore)

//api是否成功
const apiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const chartOptions = reactive({
  chart: {
    height: 610,
    type: 'column'
  },
  legend: {
    enabled: false
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    tickInterval: 1,
    categories: [],
    overflow: 'allow',
    labels: {
      style: {
        whiteSpace: 'nowrap', // 避免文字換行
        textOverflow: 'none', // 防止省略號(...)
        fontSize: '12px'
      }
    }
  },
  yAxis: {
    gridLineColor: '#e8e8e8'
  },
  tooltip: {
    ...tooltipDarkConfig,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipSingleShared({
        data: this.points,
        date: this.x,
        hallCode: activeHall.hall_code,
        tooltipIconBorder: 1
      })
    }
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: '300'
        },
        useHTML: true,
        formatter: function () {
          return `<div class="dataLabelsBg">${FormatNumber(this.y)}</div>`
        }
      }
    }
  },
  series: []
})

// 取得資料
const queryTagsGameRank = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryTagsGameRank({
      hall_name: activeHall.hall_code,
      search_date: filterFormData.value.date,
      search_tag: trimBack(filterFormData.value.searchTag),
      exclude_tag: trimBack(filterFormData.value.excludeTag),
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      transformTagsGameRank(result.data.result)
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
const transformTagsGameRank = (data) => {
  chartOptions.xAxis.categories = []
  chartOptions.series = [
    {
      data: []
    }
  ]
  let chartDataBgColor = []
  for (let i = 0; i < data.length; i++) {
    if (i >= 20) {
      // 只列出前20名
      break
    }
    chartOptions.xAxis.categories.push(data[i].lobby_name + '-' + data[i].game_name)
    let bgColor = ''
    let borderColor = ''
    if (i < chart_fixed_bgColor.length) {
      bgColor = generateRGBColors(chart_fixed_bgColor[i], 0.7) // 使用定義好的顏色
      borderColor = bgColor.substring(0, bgColor.lastIndexOf(',')) + ',1)'
    }
    chartDataBgColor.push(bgColor)
    chartOptions.series[0].data.push({
      y: parseFloat(data[i].bet_amount.replaceAll(',', '')),
      color: bgColor,
      pointWidth: 55, //柱子寬度
      borderColor
    })
  }
}

onMounted(() => {
  nextTick(() => {
    queryTagsGameRank()
  })
})

watch([() => filterTimestamp.value, i18nLocale], () => {
  queryTagsGameRank()
})
</script>
<template>
  <section class="cdp-section-in mb-0">
    <SectionTitle class="mb-15" :title="$t('game_tag_analysis.game_bet_amount_rank')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 20 }) }}
      </template>
    </SectionTitle>
    <div class="relative" style="min-height: 610px">
      <CdpMessage :messageKey="messageKey" :cover="true" bg="white" v-if="apiSuccess === false" />
      <template v-else>
        <highcharts :options="chartOptions"></highcharts>
      </template>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cdp-section {
  position: relative;
}

:deep(.dataLabelsBg) {
  padding: 3px 5px;
}

.mb-0 {
  margin-bottom: 0px !important;
}
</style>
