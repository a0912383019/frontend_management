<script setup>
import { ref, reactive, watch, computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useDataRankAnalysisStore, useDateStore } from '@/stores'
import { apiFinancialWeeks } from '@/api'
import { storeToRefs } from 'pinia'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Datepicker from '@/components/Date/Datepicker.vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const { t } = useI18n()

const dataRankStore = useDataRankAnalysisStore()
const { growthDecayFilter } = dataRankStore
// const { searchDate, rank } = toRefs(growthDecayFilter)

const dateStore = useDateStore()
const { LAST_DATE } = dateStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const popover = ref(null) // popover
// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// filter 欄位資料
const filterData = reactive({
  displayweek: '', // 畫面顯示用
  apiWeek: growthDecayFilter.financialWeek, // api 參數用
  searchDate: growthDecayFilter.searchDate,
  rank: growthDecayFilter.rank
})

// 排名選項
const selectRankLists = computed(() => {
  return [
    {
      value: 10,
      label: t('rank_analysis.top_10')
    },
    {
      value: 20,
      label: t('rank_analysis.top_20')
    },
    {
      value: 50,
      label: t('rank_analysis.top_50')
    }
  ]
})

// 紀錄 key
const key = ref(0)

// 確認篩選
const handleClick = () => {
  growthDecayFilter.searchDate = filterData.searchDate
  growthDecayFilter.rank = filterData.rank
  growthDecayFilter.financialMonth = dayjs(filterData.searchDate).format('MM')
  growthDecayFilter.financialWeek = filterData.apiWeek
  growthDecayFilter.financialYear = dayjs(filterData.searchDate).format('YYYY')
  dataRankStore.growthDecayAgainNum = Date.parse(new Date())
  closePopover()
}

// 週次下拉選單
const selectWeeks = ref([])

// 日期變動觸發
const handleDateChange = async (date) => {
  // call 帳務週 api
  try {
    const result = await apiFinancialWeeks({
      hall_name: activeHall.hall_code,
      month: dayjs(date).format('MM'),
      year: dayjs(date).format('YYYY')
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      // 清空週次
      filterData.displayweek = ''

      // 產生週次下拉選單
      selectWeeks.value = result.data.result[0].weeks.map((item) => {
        const startDate = dayjs(item.week_duration.split('~')[0]).format(t('date.format_date_rule'))
        const endDate = dayjs(item.week_duration.split('~')[1]).format(t('date.format_date_rule'))
        // 依照 dayjs 處理 isBetween 邏輯，以確保今天的日期如果剛好是 endDate 也可以被包含在區間內，需要將結束日期 isBetweenEndDate 加上一天，這樣才符合帳務週的時間邏輯
        const isBetweenEndDate = dayjs(item.week_duration.split('~')[1])
          .add(1, 'day')
          .format(t('date.format_date_rule'))

        // 轉換帳務週顯示格式
        const formatDate = `${item.fin_week}(${startDate} ~ ${endDate})`

        // 判斷日期是否在帳務週區間
        const isBetween = dayjs(LAST_DATE).isBetween(startDate, isBetweenEndDate)
        if (isBetween) {
          filterData.displayweek = formatDate
          filterData.apiWeek = item.fin_week
        }
        return {
          label: formatDate,
          value: formatDate
        }
      })

      // 如果 displayweek 為空，預設顯示第一週
      if (filterData.displayweek === '') {
        const weekData = Number(selectWeeks.value[0].label.split('(')[0])
        filterData.displayweek = selectWeeks.value[0].label
        filterData.apiWeek = weekData
      }

      // 第一次載入執行這段，須等帳戶週處理完今日的日期對應的週次，再進行篩選
      if (growthDecayFilter.isFirst) {
        handleClick()
        growthDecayFilter.isFirst = false
      }
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

// 週次變動觸發
const handleWeekChange = (value) => {
  filterData.apiWeek = Number(value.split('(')[0])
}

watch(
  () => systemConfigIsOk.value,
  () => {
    key.value = Math.floor(Math.random() * 100)
    handleDateChange()
  }
)
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="310"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover unit-test-people-changes"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          color="purple"
          :name="$t('common.advanced_filter')"
        />
      </template>
      <div class="drop">
        <div class="drop__top">
          <div class="drop__top__item full">
            <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('date.month')">
            </SectionTitle>
            <Datepicker
              v-model="filterData.searchDate"
              type="month"
              :config="4"
              classColor="purple"
              @change="handleDateChange"
            />
          </div>
          <div class="drop__top__item full">
            <SectionTitle size="small" class="cdp-text-purple mb-4" :title="$t('date.week')">
            </SectionTitle>
            <el-select
              v-model="filterData.displayweek"
              class="cdp-select cdp-select__purple w-full"
              popper-class="cdp-select-popper cdp-select-popper__purple"
              :teleported="false"
              @change="handleWeekChange"
            >
              <el-option
                v-for="item in selectWeeks"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="drop__top__item full">
            <SectionTitle
              size="small"
              class="cdp-text-purple mb-4"
              :title="$t('rank_analysis.ranking')"
            >
            </SectionTitle>
            <el-select
              v-model="filterData.rank"
              class="cdp-select cdp-select__purple w-full"
              popper-class="cdp-select-popper cdp-select-popper__purple"
              :teleported="false"
            >
              <el-option
                v-for="item in selectRankLists"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="drop__footer">
          <div class="drop__footer__item">
            <ButtonIcon
              icon="search"
              size="medium "
              color="purple"
              @click="handleClick"
              :name="$t('common.filter')"
            />
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  &__footer {
    display: flex;
    justify-content: flex-end;
    &__item {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
}
</style>
