<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryMemberHealthChart } from '@/api/dialogMemberDetail.js'
import { useGlobalStore } from '@/stores/global.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import Chart from 'chart.js/auto'
import { generateRGBColors, errorRespond } from '@/utils/commonUtils.js'
import { chart_fixed_bgColor } from '@/../public/js/system_config.js'
import CdpMessage from '@/components/CdpMessage.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()

const apiSuccess = ref(false) //會員生命週期階段api是否成功
//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const memberHealthValue = ref(null) //會員健康度

const refChart = ref(null)

let chart

const chartSetting = {
  id: 'healthChart',
  type: 'doughnut',
  data: {
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    cutout: 98,
    plugins: {
      labels: {
        render: () => {
          return ''
        }
      },
      tooltip: {
        enabled: false //關閉Tooltip
      }
    }
  }
}

//註冊chart js
const register_chart = () => {
  let ctx = refChart.value.getContext('2d')
  chart = new Chart(ctx, chartSetting)
}

//取得會員健康度
const queryMemberHealthChart = async () => {
  apiSuccess.value = false
  messageKey.value = 'shortLoading'
  try {
    const result = await apiQueryMemberHealthChart({
      hall_name: activeHall.hall_code,
      user_id: dialogMemberDetailStore.state.memberData.user_id
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      const { action_score } = result.data.result
      let chart_data = []
      let chart_data_bgColor = [generateRGBColors([255, 255, 255], 0)]
      let chart_data_borderColor = [generateRGBColors([255, 255, 255], 0)]
      let health_value = action_score
      memberHealthValue.value = health_value
      chart_data.push(100 - health_value)
      chart_data.push(health_value)

      if (health_value > 80) {
        chart_data_bgColor.push(generateRGBColors(chart_fixed_bgColor[1], 0.7))
        chart_data_borderColor.push(generateRGBColors(chart_fixed_bgColor[1], 1))
      } else {
        chart_data_bgColor.push(generateRGBColors(chart_fixed_bgColor[0], 0.7))
        chart_data_borderColor.push(generateRGBColors(chart_fixed_bgColor[0], 1))
      }

      chartSetting.data.datasets.push({
        data: chart_data,
        backgroundColor: chart_data_bgColor,
        borderWidth: 1,
        hoverBorderWidth: 2,
        borderColor: chart_data_borderColor
      })
      setTimeout(() => {
        register_chart()
      }, 100)
    } else if (return_code === '0001') {
      apiSuccess.value = true
      memberHealthValue.value = t('common.none')
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      apiSuccess.value = false
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

onMounted(() => {
  queryMemberHealthChart()
})
</script>
<template>
  <section class="cdp-section-in">
    <div class="member">
      <CdpMessage :messageKey="messageKey" cover bg="white" v-if="apiSuccess === false" />
      <template v-else>
        <div class="member__top">
          <div class="member__photo"><img src="@/assets/images/user-01.png" alt="" /></div>
          <canvas
            ref="refChart"
            style="min-height: 220px; height: 220px; max-height: 220px; max-width: 100%"
            width="260"
            height="220"
          ></canvas>
        </div>
        <div class="member__text">
          {{ $t('customer_detail_info.health_value') }}{{ memberHealthValue }}
        </div>
      </template>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.member {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  min-height: 255px;
  &__top {
    position: relative;
    width: 100%;
    max-width: 260px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
  &__photo {
    position: absolute;
    left: 50%;
    top: 25px;
    margin-left: -90px;
    width: 180px;
    height: 180px;
    img {
      display: block;
      width: 100%;
    }
  }
  &__text {
    text-align: center;
    font-size: 16px;
    color: #212259;
  }
}
.cdp-section-in {
  height: calc(100% - 20px);
}
</style>
