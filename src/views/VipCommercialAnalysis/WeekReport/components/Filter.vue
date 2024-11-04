<script setup>
import { ref, reactive, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSessionStorageEntity } from '@/utils/commonUtils.js'
import { useGlobalStore, useVipCommercialAnalysisStore, useDateStore } from '@/stores'
import { apiFinancialWeeks } from '@/api'
import { storeToRefs } from 'pinia'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import Datepicker from '@/components/Date/Datepicker.vue'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { defaultVipTag, weekReportFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore
const { systemConfigIsOk } = storeToRefs(globalStore)

const emit = defineEmits(['update:filter'])

const popover = ref(null) // popover
// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// filter 欄位資料
const filterData = reactive({
  displayweek: '', // 畫面顯示用
  apiWeek: weekReportFilter.financialWeek, // api 參數用
  searchDate: '',
  vipTag: defaultVipTag
})

// 取得 system_config 資料
const tagsConfig = ref(getSessionStorageEntity('system_config').tags_config)

// 包含標籤選項
const selectTypeLists = computed({
  get() {
    return [
      // {
      //   value: 'all',
      //   label: t('vip_commercial_analysis.all'),
      //   disabled: false
      // },
      {
        value: 10001,
        label: tagsConfig.value[10001].tag_name,
        disabled: true
      },
      {
        value: 10003,
        label: tagsConfig.value[10003].tag_name,
        disabled: true
      }
    ]
  },
  set(newValue) {
    return newValue
  }
})

// 儲存初始資料
const originalSelectTypeLists = JSON.parse(JSON.stringify(selectTypeLists.value))

// 紀錄 key
const key = ref(0)

// 確認篩選
const handleClick = () => {
  if (filterData.vipTag === '') {
    // 如果 vip_tag 為空，要搜尋全部，且重置 SelectTagSingle 組件，恢復選擇全部選項
    filterData.vipTag = defaultVipTag
    key.value = Math.floor(Math.random() * 10000)
    // 恢復為預設值
    selectTypeLists.value = originalSelectTypeLists
  }
  weekReportFilter.financialMonth = dayjs(filterData.searchDate).format('MM')
  weekReportFilter.financialWeek = filterData.apiWeek
  weekReportFilter.financialYear = dayjs(filterData.searchDate).format('YYYY')
  weekReportFilter.date = dayjs(filterData.searchDate).format('YYYY-MM')
  weekReportFilter.vipTag = filterData.vipTag
  emit('update:filter')
  closePopover()
}

// 紀錄是否第一次載入
const isFirst = ref(true)

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

        // 轉換帳務週顯示格式
        const formatDate = `${item.fin_week}(${startDate} ~ ${endDate})`

        // 判斷日期是否在帳務週區間
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
      if (isFirst.value) {
        handleClick()
        isFirst.value = false
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

onUnmounted(() => {
  // 將篩選日期恢復成預設值
  vipStore.resetState()
})

watch(
  () => systemConfigIsOk.value,
  () => {
    tagsConfig.value = getSessionStorageEntity('system_config').tags_config
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
              :title="$t('common.include_tags')"
            >
            </SectionTitle>
            <SelectTagSingle :key="key" :lists="selectTypeLists" v-model="filterData.vipTag" />
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
