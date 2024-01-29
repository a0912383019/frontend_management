<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import { formatDateDuration } from '@/utils/commonUtils.js'

const { date_range_picker_config_1, date_range_picker_config_7, shortcutsConfig1 } = useDateStore()

const { t } = useI18n()

const props = defineProps({
  config: {
    type: Number,
    default: 11 // config_11 : 預設選取近1個月，最早可選至3年前，最晚可選至前二日
  },
  rangeDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:timestamp'])

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  if (popover.value && typeof popover.value.hide === 'function') {
    popover.value.hide()
  }
}

const dateValueStartDate = ref('')
const dateValueEndDate = ref('')
const dateMinDate = ref('')
const dateMaxDate = ref('')
//根據props config決定使用的預設日期
switch (props.config) {
  case 7:
    dateValueStartDate.value = date_range_picker_config_7.startDate
    dateValueEndDate.value = date_range_picker_config_7.endDate
    dateMinDate.value = date_range_picker_config_7.minDate
    dateMaxDate.value = date_range_picker_config_7.maxDate
    break
  case 11:
    dateValueStartDate.value = date_range_picker_config_1.startDate
    dateValueEndDate.value = date_range_picker_config_1.endDate
    dateMinDate.value = date_range_picker_config_1.minDate
    dateMaxDate.value = date_range_picker_config_1.maxDate
    break
}
//如果props rangedate有值，優先使用
if (props.rangeDate !== '') {
  dateValueStartDate.value = props.rangeDate.split('~')[0].trim()
  dateValueEndDate.value = props.rangeDate.split('~')[1].trim()
}
const dateValue = ref([dateValueStartDate.value, dateValueEndDate.value])

const selectDate = ref([dateValueStartDate.value, dateValueEndDate.value]) // 目前選擇的起始日，用來判斷disabledDate

// 日曆禁用日期
const disabledDate = (day) => {
  // 禁選條件一：選擇的起始日往前往後大於三個月的日期disabled
  let diff = null
  if (selectDate.value !== null && selectDate.value[1] === null) {
    diff = dayjs(selectDate.value[0]).diff(day, 'month')
    if (diff >= 3 || diff <= -3) {
      return true
    }
  }

  // 禁選條件二：日期小於最小日期 或 日期大於結束日
  let activeDate = dayjs(day).format('YYYY-MM-DD')
  let minDate = dayjs(dateMinDate.value).format('YYYY-MM-DD')
  let maxDate = dayjs(dateMaxDate.value).format('YYYY-MM-DD')
  if (activeDate < minDate || activeDate > maxDate) {
    return true
  }

  return false
}

// 快捷選項
const shortcuts = computed(() => {
  return shortcutsConfig1()
})

// 送出篩選
const handleClick = () => {
  emit('update:timestamp', {
    timestamp: new Date().getTime(),
    rangeDate: formatDateDuration(
      dayjs(dateValue.value[0]).format('YYYY-MM-DD') +
        '~' +
        dayjs(dateValue.value[1]).format('YYYY-MM-DD')
    )
  })
  closePopover()
}

// 選擇日期後將日期放入
const handleCalendarChange = (val) => {
  selectDate.value = val
}

// 當使用者清空日曆後，將selectDate一併清空
watch(
  () => dateValue.value,
  () => {
    if (dateValue.value === null) {
      selectDate.value = null
    }
  }
)
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :title="$t('date.date')"
      :width="320"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover"
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
        <div class="drop__item">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            :unlink-panels="false"
            popper-class="cdp-datepicker-range-popper cdp-datepicker-range-popper__purple"
            range-separator="~"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
            :teleported="false"
            :disabled-date="disabledDate"
            @calendar-change="handleCalendarChange"
          />
        </div>
        <div class="drop__footer">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleClick"
            :name="$t('common.filter')"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.drop {
  &__search {
    margin-bottom: 12px;
  }
  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
  }
}
:deep(.el-popper.el-picker__popper.cdp-datepicker-range-popper__purple) {
  right: 0 !important;
  inset: 90px 0 auto auto !important;
}
</style>
