<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Tab from '@/components/Tab.vue'
import { apiQueryBetAmountAndPayoff } from '@/api'
import { useGlobalStore, useTargetGroupStore } from '@/stores'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import { FormatNumber, errorRespond, generateRGBColors } from '@/utils/commonUtils.js'
import { tooltipDarkConfig, tooltipShared } from '@/utils/highchartsConfig.js'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const targetGroup = useTargetGroupStore()
const { groupFilterDate, filtered } = storeToRefs(targetGroup)

const props = defineProps({
  targetId: {
    type: String
  }
})

//當前顯示的tab
const currentTabs = ref('DailyBetAmount')
const tabList = computed(() => {
  return [
    {
      name: 'DailyBetAmount',
      label: t('target_group_analysis.daily_bet_amount')
    },
    {
      name: 'DailtProfit',
      label: t('target_group_analysis.daily_payoff')
    }
  ]
})

const BetAmountOptions = reactive({
  chart: {
    type: 'area',
    height: 300
  },
  legend: {
    verticalAlign: 'top',
    align: 'center',
    useHTML: true,
    symbolRadius: 0,
    symbolWidth: 0,
    symbolHeight: 0,
    labelFormatter: function () {
      return `
        <div class="flex">
          <div style="
            background-color:${this.options.color};
            width: 40px;
            height: 12px;
            margin-right: 6px;
            margin-top: 3px;
          "></div>
          <div>${this.name}</div>
        </div>
      `
    }
  },
  xAxis: {
    gridLineColor: '#e8e8e8',
    gridLineWidth: 1,
    lineColor: '#e8e8e8',
    tickmarkPlacement: 'on',
    tickColor: '#e8e8e8',
    tickWidth: 1,
    tickInterval: 1,
    categories: [],
    labels: {
      style: {
        fontSize: '14px'
      }
    }
  },
  yAxis: {
    gridLineColor: '#e8e8e8'
  },
  tooltip: {
    ...tooltipDarkConfig,
    crosshairs: true,
    shared: true,
    useHTML: true,
    formatter: function () {
      return tooltipShared({ data: this.points, date: this.x, hallCode: activeHall.hall_code })
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        enabled: false,
        formatter: function () {
          return FormatNumber(this.y)
        }
      }
    }
  },
  series: []
})

const profitOptions = Object.assign({}, BetAmountOptions)

const apiSuccess = ref(false) //會員生命週期階段api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

//取得資料
const queryBetAmountAndPayoff = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryBetAmountAndPayoff({
      search_date: groupFilterDate.value,
      hall_name: activeHall.hall_code,
      id: props.targetId
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      transformApiData(result.data.result)
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
      messageKey.value = 'noPermission' // 更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' // 更改message內容
    }
  }
}

const transformApiData = (data) => {
  clearChart()

  //複製第一筆資料
  let dataClone = { ...data[0].custom_tag_bet_amount_payoff_data }
  let dataKey = Object.keys(dataClone)

  let dateArr = data.map((ele) => dayjs(ele.date).format(t('date.format_date_rule'))) // x軸日期
  let dataSet = {}
  let dataSet2 = {}
  dataKey.map((ele, idx) => {
    dataSet[ele] = {
      name: dataClone[ele].custom_tags_name,
      marker: {
        symbol: 'circle'
      },
      lineWidth: 2,
      fillColor: generateRGBColors(chart_fixed_bgColor[idx], 0.3),
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      data: data.map((item) => {
          return parseFloat(item.custom_tag_bet_amount_payoff_data[ele].bet_amount)
      })
    }
    dataSet2[ele] = {
      name: dataClone[ele].custom_tags_name,
      marker: {
        symbol: 'circle'
      },
      lineWidth: 2,
      fillColor: generateRGBColors(chart_fixed_bgColor[idx], 0.3),
      color: generateRGBColors(chart_fixed_bgColor[idx], 1),
      data: data.map((item) => {
          return parseFloat(item.custom_tag_bet_amount_payoff_data[ele].payoff)
      })
    }
  })

  //當資料量太大時，關閉dataLabels
  if (data.length > 40) {
    BetAmountOptions.plotOptions.series.dataLabels.enabled = false
    BetAmountOptions.xAxis.labels.style.fontSize = '12px'
    profitOptions.plotOptions.series.dataLabels.enabled = false
    profitOptions.xAxis.labels.style.fontSize = '12px'
  } else {
    BetAmountOptions.plotOptions.series.dataLabels.enabled = true
    BetAmountOptions.xAxis.labels.style.fontSize = '12.8px'
    profitOptions.plotOptions.series.dataLabels.enabled = false
    profitOptions.xAxis.labels.style.fontSize = '12px'
  }

  BetAmountOptions.xAxis.categories = dateArr
  profitOptions.xAxis.categories = dateArr

  Object.keys(dataSet).forEach((item) => {
    BetAmountOptions.series.push(dataSet[item])
  })
  Object.keys(dataSet2).forEach((item) => {
    profitOptions.series.push(dataSet2[item])
  })
}

const clearChart = () => {
  BetAmountOptions.xAxis.categories = []
  BetAmountOptions.series = []
  profitOptions.xAxis.categories = []
  profitOptions.series = []
}

watch(
  () => filtered.value,
  () => {
    queryBetAmountAndPayoff()
  }
)

onMounted(() => {
  queryBetAmountAndPayoff()
})
</script>
<template>
  <section class="cdp-section-in h-400">
    <div class="cdp-dialog__content">
      <el-row :gutter="20" class="mb-16">
        <el-col :span="13">
          <Tab
            :tabData="tabList"
            :activeName="currentTabs"
            class="tabs-manage-analysis"
            v-model="currentTabs"
          ></Tab>
        </el-col>
      </el-row>
      <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" class="mt-100" />
      <div v-if="apiSuccess && currentTabs === 'DailyBetAmount'" class="cursor-pointer">
        <highcharts :options="BetAmountOptions"></highcharts>
      </div>
      <div v-if="apiSuccess && currentTabs === 'DailtProfit'" class="cursor-pointer">
        <highcharts :options="profitOptions"></highcharts>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cdp-dialog {
  &__component {
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    border-radius: 5px;
    border: 1px #e6eaf2 solid;
  }
  &__header {
    color: #fff;
  }
}
.mt-100 {
  margin-top: 100px;
}
</style>
