<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberLobbyGame } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import {
  generateRGBColors,
  errorRespond,
  FormatNumber
} from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipFormatter } from '@/utils/highchartsConfig'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { ElNotification } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

//highcharts
const chartOptions = reactive({
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
    height: 250,
    marginRight: 170,
    marginLeft: 0,
    spacing: [0, 0, 0, 0]
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    useHTML: true,
    width: 170,
    symbolRadius: 0,
    symbolWidth: 0,
    symbolHeight: 0,
    labelFormatter: function () {
      return `
        <div class="flex" style="width: 170px;">
          <div class="shrink-0" style="
            background-color:${this.options.color};
            width: 40px;
            height: 12px;
            margin-right: 6px;
            margin-top: 3px;
          "></div>
          <div style="width: calc(100% - 46px); white-space: normal; padding-right: 5px;">${this.name}</div>
        </div>
      `
    }
  },
  tooltip: {
    ...tooltipDarkConfig,
    useHTML: true,
    formatter() {
      return tooltipFormatter({ data: this, hallCode: activeHall.hall_code })
    }
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      borderRadius: 0,
      borderWidth: 0,
      innerSize: '55%',
      showInLegend: true,
      dataLabels: {
        enabled: true,
        formatter: function () {
          return FormatNumber(this.y)
        },
        useHTML: true,
        distance: '-20%',
        filter: {
          property: 'percentage',
          operator: '>',
          value: 6
        }
      }
    }
  },
  series: [
    {
      data: []
    }
  ]
})

//取得資料
const queryLobbyGameChart = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberLobbyGame({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformLobbyGameChart(result.data.result)
      apiSuccess.value = true
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
const transformLobbyGameChart = (data) => {
  clearChart()
  for (let i = 0; i < data.length; i++) {
    if (i >= 10) {
      // 只顯示貨量前10名的遊戲
      break
    }
    let label = data[i].lobby_name + '-' + data[i].game_name
    let color = ''
    color = generateRGBColors(chart_fixed_bgColor[i], 0.7) // 使用定義好的顏色

    //highcharts
    chartOptions.series[0].data.push({
      name: label,
      y: parseFloat(data[i].total_bet_amount),
      color
    })
  }
}

//清空chart資料
const clearChart = () => {
  chartOptions.series[0].data = []
}

onMounted(() => {
  queryLobbyGameChart()
})
</script>
<template>
  <section class="cdp-section-in margin-bottom-0">
    <SectionTitle class="mb-15" :title="$t('customer_detail_info.total_bet_by_game')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 10 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" :height="221" bg="white" v-if="apiSuccess === false" />
    <div v-else>
      <highcharts :options="chartOptions"></highcharts>
    </div>
  </section>
</template>
<style lang="scss">
.highcharts-legend.highcharts-no-tooltip {
  z-index: 0;
}

.margin-bottom-0 {
  margin-bottom: 0;
}
</style>
