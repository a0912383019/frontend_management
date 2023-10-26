<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberPeriodOfferAmount } from '@/api/dialogMemberDetail.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import {
  getHallCurrencySign,
  errorRespond,
  generateRGBColors,
  FormatNumber,
  formatNumberWithK
} from '@/utils/commonUtils.js'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { dialogMemberDetailRangeDate } = storeToRefs(dialogMemberDetailStore)

const apiSuccess = ref(false) //api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const refChart = ref(null)

const chartSetting = {
  type: 'polarArea',
  plugins: [ChartDataLabels],
  data: {
    labels: [],
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      r: {
        ticks: {
          callback(label) {
            return formatNumberWithK(label)
          }
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: function (value) {
          return FormatNumber(value)
        },
        display: (context) => {
          //找出最大值
          let maxNum = Math.max(...context.dataset.data) / 3
          //只有當數據大於最大值的1/3時才顯示標籤
          return context.dataset.data[context.dataIndex] > maxNum
        },
        color: '#000',
        font: {
          weight: 'bold'
        },
        clamp: true
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (tooltipItem) => {
            let value =
              getHallCurrencySign('BBIN', activeHall.hall_code) + FormatNumber(tooltipItem['raw'])
            let title = tooltipItem['label'] + ' : '
            return title + value
          }
        }
      }
    }
  }
}

//取得資料
const queryMemberPeriodOfferAmount = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  try {
    const result = await apiQueryMemberPeriodOfferAmount({
      search_date: dialogMemberDetailRangeDate.value,
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      apiSuccess.value = true
      //整理及地圖對應的資料
      transformPeriodOfferAmount(result.data.result)
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
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformPeriodOfferAmount = (data) => {
  let chartData = {
    labels: Object.values(data).map((ele) => ele.opcode_name),
    datasets: [
      {
        data: Object.values(data).map((ele) => Number(ele.total_premium_amount)),
        backgroundColor: Object.values(data).map((ele, idx) =>
          generateRGBColors(chart_fixed_bgColor[idx], 0.7)
        ),
        borderWidth: 1,
        hoverBorderWidth: 3,
        borderColor: Object.values(data).map((ele, idx) =>
          generateRGBColors(chart_fixed_bgColor[idx], 1)
        )
      }
    ]
  }
  chartSetting.data = chartData

  nextTick(() => {
    let ctx = refChart.value.getContext('2d')
    new Chart(ctx, chartSetting)
  })
}

onMounted(() => {
  queryMemberPeriodOfferAmount()
})
</script>
<template>
  <section class="cdp-section">
    <SectionTitle class="mb-15" :title="$t('customer_detail_info.total_bonuses')">
      <template #tooltip>
        {{ $t('common.show_top_only', { rank: 5 }) }}
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <template v-else>
      <canvas
        ref="refChart"
        style="
          min-height: 300px;
          height: 300px;
          max-height: 300px;
          min-width: 100%;
          max-width: 100%;
        "
      ></canvas>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
