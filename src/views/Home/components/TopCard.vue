<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQuerySmallBoxData } from '@/api/home.js'
import { useGlobalStore } from '@/stores/global.js'
import { storeToRefs } from 'pinia'
import CdpMessage from '@/components/CdpMessage.vue'
import { ElNotification } from 'element-plus'
import { formatDateDuration } from '@/utils/commonUtils.js'
import dayjs from 'dayjs'

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const monthDuration = formatDateDuration(
  dayjs().subtract(31, 'day').startOf('day').format(t('date.format_date_rule')) +
    '~' +
    dayjs().subtract(2, 'day').startOf('day').format(t('date.format_date_rule'))
)

const weekDuration = formatDateDuration(
  dayjs().subtract(8, 'day').startOf('day').format(t('date.format_date_rule')) +
    '~' +
    dayjs().subtract(2, 'day').startOf('day').format(t('date.format_date_rule'))
)

const topCard = computed(() => {
  const iconTitleColor = [
    {
      icon: 'fas fa-money-bill-wave',
      title: t('data_name.bet_amount'),
      colorClass: 'cdp-bg-maximum__blue'
    },
    {
      icon: 'fas fa-chart-area',
      title: t('data_name.payoff'),
      colorClass: 'cdp-bg-forest__green__crayola'
    },
    {
      icon: 'fas fa-gift',
      title: t('data_name.bonus'),
      colorClass: 'cdp-bg-indian__yellow'
    },
    {
      icon: 'fas fa-users',
      title: t('data_name.active_member'),
      colorClass: 'cdp-bg-candy__pink'
    }
  ]

  let topCardData = []
  for (let i = 0; i < iconTitleColor.length; i++) {
    topCardData.push({
      title: iconTitleColor[i].title,
      icon: iconTitleColor[i].icon,
      colorClass: iconTitleColor[i].colorClass,
      monthAvg: '-',
      weekAvg: '-',
      growth: '-'
    })
  }
  return topCardData
})
//取得資料
const querySmallBoxData = async () => {
  try {
    const result = await apiQuerySmallBoxData({
      hall_name: activeHall.hall_code,
      search_date: '2023-08-02 ~ 2023-08-08'
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
  console.log(data)
}

onMounted(() => {
  querySmallBoxData()
})
</script>
<template>
  <el-row :gutter="20" class="mb-20">
    <el-col :span="6" v-for="(item, key) in topCard" :key="key">
      <div class="cdp-shadow-light-sm border-radius-5">
        <div
          class="padding-9 text-center cdp-text-white border-top-radius-5"
          :class="item.colorClass"
        >
          <font-awesome-icon class="mr-5" :icon="item.icon" />
          <span class="font-medium">{{ item.title }}</span>
        </div>
        <div class="padding-10">
          <div class="flex justify-between mb-4">
            <span class="font-size-14">{{ t('home.30-day_moving_average') }}</span>
            <span class="font-size-12">({{ monthDuration }})</span>
          </div>
          <div class="cdp-money-place py-7 px-20 mb-18">
            <span class="font-black">$271,212,982,776</span>
          </div>
          <div class="flex justify-between mb-4">
            <span class="font-size-14">{{ t('home.7-day_moving_average') }}</span>
            <span class="font-size-12">( {{ weekDuration }})</span>
          </div>
          <div class="cdp-money-place py-7 px-20 mb-18 font-black flex justify-between">
            <span class="font-black">$271,212,982,776</span>
            <span class="font-black">^3%</span>
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
</style>
