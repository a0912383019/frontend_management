<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberLobbyGame } from '@/api/manageAnalysis.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { generateRGBColors, dynamicBackgroundColors, FormatNumber } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipFormatter } from '@/utils/highchartsConfig'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { ElNotification } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { dialogMemberDetailRangeDate, filterDateDialogMemberDetailTimestamp } =
  storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

//highcharts
const chartOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
    height: 250,
    // margin: 0,
    marginRight: 170,
    marginLeft: 0,
    spacing: [0, 0, 0, 0]
    // marginRight: 180 // 右侧边距，根据图例文字长度进行调整
    // marginLeft: -50 // 右侧边距，根据图例文字长度进行调整
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
      // console.log(this)
      return `
        <div class="flex" style="width: 170px;">
          <div class="shrink-0" style="
            background-color:${this.options.color};
            width: 40px;
            height: 10px;
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
      series: {
        // pointWidth: 50,
        // groupPadding: 0
      },
      dataLabels: {
        enabled: true,
        // format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
        formatter: function () {
          // console.log(this)
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
}

//取得資料
const queryLobbyGameChart = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberLobbyGame({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      member_id: manageAnalysisStore.memberData.user_id,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    // console.log('apiQueryMemberLobbyGame', result)
    if (return_code === '0000') {
      transformLobbyGameChart(result.data.result)
      apiSuccess.value = true
    } else if (return_code === '0001') {
      messageKey.value = 'noResult'
    } else {
      messageKey.value = 'chartFailed'
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
  // console.log('transformLobbyGameChart', data)
  let chartDataBgColor = []
  for (let i = 0; i < data.length; i++) {
    if (i >= 10) {
      // 只顯示貨量前10名的遊戲
      break
    }
    let label = data[i].lobby_name + '-' + data[i].game_name
    let color = ''
    if (i < chart_fixed_bgColor.length) {
      color = generateRGBColors(chart_fixed_bgColor[i], 0.7) // 使用定義好的顏色
    } else {
      color = dynamicBackgroundColors(0.7) // 隨機產生顏色
      while (chartDataBgColor.indexOf(color) > -1) {
        // 判斷該顏色是否已經存在
        color = dynamicBackgroundColors(0.7) // 若顏色已存在陣列中，則隨機產生新顏色
      }
    }

    //highcharts
    chartOptions.series[0].data.push({
      name: label,
      y: parseFloat(data[i].total_bet_amount),
      color
    })
  }
}

onMounted(() => {
  queryLobbyGameChart()
})
watch(
  () => filterDateDialogMemberDetailTimestamp.value,
  () => {
    queryLobbyGameChart()
  }
)
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="t('customer_detail_info.total_bet_by_game')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 10 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" :height="250" bg="white" v-if="apiSuccess === false" />
    <div v-else>
      <highcharts :options="chartOptions"></highcharts>
    </div>
  </section>
</template>
<style lang="scss">
.highcharts-legend.highcharts-no-tooltip {
  z-index: 0;
}
</style>
