<script setup>
import { ref, watch, computed, onMounted, toRefs, defineProps, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { FormatNumber, generateRGBColors, generateMultipleColors } from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  apiObject: {
    apiSuccess: Boolean,
    messageKey: String,
    apiRecordsTotal: Number,
    result: Object
  }
})
const { apiObject } = toRefs(props)

const apiSuccess = ref(apiObject.value.apiSuccess)
const messageKey = ref(apiObject.value.messageKey)

const chartOptions = reactive({
  chart: {
    type: 'line',
    height: 500
  },
  legend: {
    verticalAlign: 'top',
    useHTML: true,
    symbolWidth: 0,
    labelFormatter: function () {
      return (
        `<div style="display: flex;">
            <div style="width: 14px; height: 14px; background-color:` +
        this.color +
        `; display: inline-block; margin-right: 6px"></div><span>` +
        this.name +
        `</span></div>`
      )
    }
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
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipShared({ data: this.points, date: this.x, hallCode: activeHall.hall_code })
    },
    stickOnContact: true // 需要加這個才能使overflow 生效
  },
  series: []
})

//轉換資料
const transformBetAmountDailyRank = (data) => {
  clearChart()
  chartOptions.xAxis.categories = data.daily.map((ele) =>
    dayjs(ele.date).format(t('date.format_date_rule'))
  )

// 儲存排名會員名稱
  let userNameList = []
  for (let i = 0; i < data.rank.length; i++) {
    userNameList.push(data.rank[i].user_name)
  }

  let series = []
  let color = []

  // 會員超過20人產生隨機50種顏色
  if (userNameList.length > 20) {
    color = generateMultipleColors(50)['bg']
  }
  for (let i = 0; i < userNameList.length; i++) {
    let userData = {
      name: '(' + (i + 1) + ') ' + userNameList[i],
      type: 'line',
      data: data.daily.map((ele) => {
        // 根據會員名稱遍歷取得該會員資料
        const index = ele.users.findIndex((item) => item.user_name === userNameList[i])
        if (index !== -1) {
          return Number(ele.users[index].commissionable)
        }
      }),
      // 超過20個會員資料時顏色使用隨機
      color: userNameList.length > 20 ? color[i] : generateRGBColors(chart_fixed_bgColor[i], 1),
      lineWidth: 3,
      marker: {
        symbol: 'circle', // 點點樣式
        radius: 5 // 點點大小
      },
      yAxis: 0
    }
    series.push(userData)
  }
  chartOptions.series = series
}

const clearChart = () => {
  chartOptions['xAxis']['categories'] = []
  chartOptions['series'] = []
}

watch(
  () => apiObject.value.apiSuccess,
  () => {
    apiSuccess.value = apiObject.value.apiSuccess
    messageKey.value = apiObject.value.messageKey
    if (apiObject.value.apiSuccess) {
      transformBetAmountDailyRank(apiObject.value.result)
    }
  }
)

onMounted(() => {
  if (apiObject.value.apiSuccess && Object.keys(apiObject.value.result).length !== 0) {
    transformBetAmountDailyRank(apiObject.value.result)
  }
})
</script>
<template>
  <section class="">
    <SectionTitle class="mb-15" :title="$t('rank_analysis.ranking_member_daily_bet_amount')">
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
