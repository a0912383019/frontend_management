<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQuerySmallBoxData } from '@/api/home.js'
import { useGlobalStore } from '@/stores/global.js'
import { ElNotification } from 'element-plus'
import {
  formatDateDuration,
  getHallCurrencySign,
  FormatNumber,
  errorRespond,
  addNumberColor
} from '@/utils/commonUtils.js'
import dayjs from 'dayjs'
import PercentWithIcon from '@/components/PercentWithIcon.vue'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const monthDuration = computed(() => {
  return (
    dayjs().subtract(31, 'day').startOf('day').format(t('date.format_date_rule')) +
    '~' +
    dayjs().subtract(2, 'day').startOf('day').format(t('date.format_date_rule'))
  )
})

const weekDuration = computed(() => {
  return (
    dayjs().subtract(8, 'day').startOf('day').format(t('date.format_date_rule')) +
    '~' +
    dayjs().subtract(2, 'day').startOf('day').format(t('date.format_date_rule'))
  )
})

const topCardTitle = computed(() => {
  return [
    {
      title: t('data_name.bet_amount')
    },
    {
      title: t('data_name.payoff')
    },
    {
      title: t('data_name.bonus')
    },
    {
      title: t('data_name.active_member')
    }
  ]
})

const topCardData = ref([
  {
    icon: 'fas fa-money-bill-wave',
    colorClass: 'cdp-bg-maximum__blue',
    monthAvg: '-',
    weekAvg: '-',
    growth: '-'
  },
  {
    icon: 'fas fa-chart-area',
    colorClass: 'cdp-bg-forest__green__crayola',
    monthAvg: '-',
    weekAvg: '-',
    growth: '-'
  },
  {
    icon: 'fas fa-gift',
    colorClass: 'cdp-bg-indian__yellow',
    monthAvg: '-',
    weekAvg: '-',
    growth: '-'
  },
  {
    icon: 'fas fa-users',
    colorClass: 'cdp-bg-candy__pink',
    monthAvg: '-',
    weekAvg: '-',
    growth: '-'
  }
])
//取得資料
const querySmallBoxData = async () => {
  if (activeHall.hall_code === '') return
  try {
    const result = await apiQuerySmallBoxData({
      hall_name: activeHall.hall_code,
      search_date: formatDateDuration(weekDuration.value)
    })
    const { return_code } = result.data.status

    if (return_code !== '0001') {
      if (return_code === '0000') {
        if (result.data.result.length !== 0) {
          //整理table對應的資料
          transformSmallBoxData(result.data.result)
        }
      } else {
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    } else {
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

// 轉換資料
const transformSmallBoxData = (data) => {
  const currentSign = getHallCurrencySign('BBIN', activeHall.hall_code)
  const keyArr = ['bet_amount', 'payoff', 'premium_amount', 'active_people']

  keyArr.forEach((ele, idx) => {
    if (ele === 'payoff') {
      topCardData.value[idx].monthAvg = addNumberColor(
        FormatNumber(0 - data[ele].month_avg, currentSign),
        'text-danger font-black'
      )
      topCardData.value[idx].weekAvg = addNumberColor(
        FormatNumber(0 - data[ele].week_avg, currentSign),
        'text-danger font-black'
      )
      topCardData.value[idx].growth = (0 - data[ele].growth).toString()
      return
    }

    if (ele === 'premium_amount') {
      topCardData.value[idx].monthAvg = addNumberColor(
        FormatNumber(0 - data[ele].month_avg, currentSign),
        'text-danger font-black'
      )
      topCardData.value[idx].weekAvg = addNumberColor(
        FormatNumber(0 - data[ele].week_avg, currentSign),
        'text-danger font-black'
      )
      topCardData.value[idx].growth = data[ele].growth.toString()
      return
    }

    if (ele === 'active_people') {
      topCardData.value[idx].monthAvg = FormatNumber(data[ele].month_avg)
      topCardData.value[idx].weekAvg = FormatNumber(data[ele].week_avg)
      topCardData.value[idx].growth = data[ele].growth.toString()
      return
    }

    topCardData.value[idx].monthAvg = FormatNumber(data[ele].month_avg, currentSign)
    topCardData.value[idx].weekAvg = FormatNumber(data[ele].week_avg, currentSign)
    topCardData.value[idx].growth = data[ele].growth.toString()
  })
}

onMounted(() => {
  querySmallBoxData()
})
</script>
<template>
  <el-row :gutter="20">
    <el-col :span="6" v-for="(item, idx) in topCardData" :key="idx">
      <div class="cdp-shadow-light-sm border-radius-5">
        <div
          class="padding-9 text-center cdp-text-white border-top-radius-5"
          :class="item.colorClass"
        >
          <font-awesome-icon class="mr-5" :icon="item.icon" />
          <span class="font-medium">{{ topCardTitle[idx].title }}</span>
        </div>
        <div class="padding-10">
          <div class="flex flex-wrap justify-between mb-4">
            <span class="font-size-14">{{ t('home.30-day_moving_average') }}</span>
            <span class="font-size-12">({{ monthDuration }})</span>
          </div>
          <div class="cdp-money-place py-7 px-20 mb-18 font-black">
            <span v-html="item.monthAvg"></span>
          </div>
          <div class="flex flex-wrap justify-between mb-4">
            <span class="font-size-14">{{ t('home.7-day_moving_average') }}</span>
            <span class="font-size-12">({{ weekDuration }})</span>
          </div>
          <div class="cdp-money-place py-7 px-20 mb-18 font-black flex justify-between">
            <span v-html="item.weekAvg"></span>
            <PercentWithIcon :percentData="item.growth"></PercentWithIcon>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background-color: bisque;
}

.border-radius-5 {
  border-radius: 5px;
}

.border-top-radius-5 {
  border-radius: 5px 5px 0 0;
}

.hv-2 {
  height: 16px !important;
}

.cdp-money-place {
  border-radius: 5px;
  border: solid 1px #e6eaf2;
  background-color: #fff;
}

.font-black span {
  font-weight: 900;
}
</style>
