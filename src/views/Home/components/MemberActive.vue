<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { formatDateDuration, errorRespond } from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import MemberActiveDetail from './MemberActiveDetail.vue'
import dayjs from 'dayjs'
import { apiQueryLivelyChangeOverview } from '@/api/home.js'
import { iconStep } from '@/../public/js/system_config.js'
import { useDateStore } from '@/stores/dateConfig.js'

const { LAST_DATE } = useDateStore()

const { t } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

//api是否成功
const apiSuccess = ref(false)

//依照不同的messageKey產生不同的message
const messageKey = ref('shortLoading')

const lastWeekDuration = ref(
  dayjs(LAST_DATE).subtract(13, 'day').format(t('date.format_date_rule')) +
    '~' +
    dayjs(LAST_DATE).subtract(7, 'day').format(t('date.format_date_rule'))
)

const thisWeekDuration = ref(
  dayjs(LAST_DATE).subtract(6, 'day').format(t('date.format_date_rule')) +
    '~' +
    dayjs(LAST_DATE).format(t('date.format_date_rule'))
)

const activityStep = computed(() => {
  let activityStep = [
    {
      title: t('member_active_level.active_level_5'),
      icon: iconStep(5).icon,
      bgColor: 'cdp-bg-cadmium__orange-1',
      iconColor: iconStep(5).color,
      icons: []
    },
    {
      title: t('member_active_level.active_level_4'),
      icon: iconStep(4).icon,
      bgColor: 'cdp-bg-glaucous-1',
      iconColor: iconStep(4).color,
      icons: []
    },
    {
      title: t('member_active_level.active_level_3'),
      icon: iconStep(3).icon,
      bgColor: 'cdp-bg-forest__green__crayola-1',
      iconColor: iconStep(3).color,
      icons: []
    },
    {
      title: t('member_active_level.active_level_2'),
      icon: iconStep(2).icon,
      bgColor: 'cdp-bg-indian__red-1',
      iconColor: iconStep(2).color,
      icons: []
    },
    {
      title: t('member_active_level.active_level_1'),
      icon: iconStep(1).icon,
      bgColor: 'cdp-bg-amethyst-1',
      iconColor: iconStep(1).color,
      icons: []
    },
    {
      title: t('member_active_level.active_level_0'),
      icon: iconStep(0).icon,
      bgColor: 'cdp-bg-light__slate__gray-1',
      iconColor: iconStep(0).color,
      icons: []
    }
  ]

  let icons = activityStep.map((ele) => {
    return {
      icon: ele.icon,
      iconColor: ele.iconColor
    }
  })
  activityStep.forEach((ele, idx) => {
    ele.icons = icons
  })

  return activityStep
})

let refPeople = ref([])

//取得資料
const queryLivelyChangeOverview = async () => {
  messageKey.value = 'shortLoading'
  apiSuccess.value = false
  if (activeHall.hall_code === '') return
  const noData = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 0))
  try {
    const result = await apiQueryLivelyChangeOverview({
      hall_name: activeHall.hall_code,
      search_date: formatDateDuration(thisWeekDuration.value)
    })
    const { return_code } = result.data.status

    if (return_code === '0000') {
      apiSuccess.value = true
      if (result.data.result.length !== 0) {
        //整理table對應的資料
        transformLivelyChangeOverview(result.data.result)
      } else {
        transformLivelyChangeOverview(noData)
      }
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        transformLivelyChangeOverview(noData)
      } else {
        messageKey.value = 'chartFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed'
    }
  }
}

// 轉換資料
const transformLivelyChangeOverview = (data) => {
  //資料倒轉為了符合v-for渲染的順序
  let reverseData = data
    .slice()
    .reverse()
    .map((ele) => ele.slice().reverse())

  refPeople.value = reverseData
}

onMounted(() => {
  queryLivelyChangeOverview()
})
const activityStepDetail = ref(null) //會員明細Dialog組件ref
const showActivityStepDetail = (lastWeek, thisWeek) => {
  activityStepDetail.value.handleOpenDialog(lastWeek, thisWeek)
}
</script>
<template>
  <section class="cdp-section mb-0">
    <SectionTitle class="margin-bottom-5-" :title="$t('home.changes_in_member_active_level')">
      <template #tooltip>
        <div class="font-size-14">
          {{ $t('member_active_level.changes') + $t('date.last_week') }}
          <cdp-icon name="doubleArrowDown" class="iconInTooltip font-size-10 ml-5 mr-5" />
          {{ $t('date.this_week') }}
          <br />
          {{ $t('date.last_week') + '：' + lastWeekDuration }}
          <br />
          {{ $t('date.this_week') + '：' + thisWeekDuration }}
        </div>
      </template>
    </SectionTitle>
    <MemberActiveDetail ref="activityStepDetail" :lastDate="LAST_DATE"></MemberActiveDetail>
    <el-row :gutter="20">
      <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" class="mt-25" />
      <el-col v-else :span="8" v-for="(item, idx) in activityStep" :key="idx" class="mt-20">
        <div class="cdp-shadow-light-sm border-radius-5 px-15 py-10">
          <div :class="['border-radius-5', 'padding-10', item.bgColor]">
            <div style="float: left">
              <font-awesome-icon
                :class="['ml-2', 'mr-8', 'mt-2', 'font-size-30', item.iconColor]"
                :icon="['fa-regular', item.icon]"
              />
            </div>
            <div class="flex justify-between mt-4 mb-4 font-size-14">
              <span>
                {{ item.title }}
              </span>
              <span>
                {{ $t('unit.unit') + $t('unit.unit_people') }}
              </span>
            </div>
          </div>
          <div>
            <el-row :gutter="5">
              <el-col
                class="text-center mt-4"
                :span="4"
                v-for="(iconItem, iconIdx) in item.icons"
                :key="iconIdx"
              >
                <cdp-icon name="doubleArrowDown" :class="['w-13', iconItem.iconColor]" />
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col
                class="text-center"
                :span="4"
                v-for="(iconItem, iconIdx) in item.icons"
                :key="iconIdx"
              >
                <font-awesome-icon
                  :class="['font-size-30', 'mt-6', 'ml-1', iconItem.iconColor]"
                  :icon="['fa-regular', iconItem.icon]"
                />
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col class="text-center" :span="4" v-for="i in 6" :key="i">
                <a
                  v-if="refPeople.length !== 0"
                  class="cdp-link-click"
                  @click="showActivityStepDetail(5 - idx, 6 - i)"
                  >{{ refPeople[idx][i - 1] }}</a
                >
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}

.border-radius-5 {
  border-radius: 5px;
}

.w-13 {
  width: 13px;
}

.mb-0 {
  margin-bottom: 0;
}

.margin-bottom-5- {
  margin-bottom: -5px;
}

.iconInTooltip {
  transform: rotate(270deg);
  margin-top: -3px;
}
</style>
