<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { formatDateDuration } from '@/utils/commonUtils.js'
import { useDateStore } from '@/stores/dateConfig.js'

const {
  date_range_picker_config_1,
  date_range_picker_config_2,
  date_range_picker_config_7,
  shortcutsConfig1,
  shortcutsConfig2
} = useDateStore()

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  config: {
    type: Number,
    default: 1 // config_1 : 預設選取近1個月
  },
  rangeDate: {
    type: String,
    default: ''
  },
  shortcutsConfig: {
    type: Number,
    default: 1
  },
  enabledThreeMonth: {
    type: Boolean,
    default: true // 預設開啟，選擇起始日後，結束日三個月限制
  },
  teleported: {
    type: Boolean,
    default: false //是否将 date-picker 的下拉列表插入至 body 元素
  }
})

const emit = defineEmits(['update:modelValue'])

const dateValueStartDate = ref('')
const dateValueEndDate = ref('')
const dateMinDate = ref('')
const dateMaxDate = ref('')
//根據props config決定使用的預設日期
switch (props.config) {
  case 1:
    dateValueStartDate.value = date_range_picker_config_1.startDate
    dateValueEndDate.value = date_range_picker_config_1.endDate
    dateMinDate.value = date_range_picker_config_1.minDate
    dateMaxDate.value = date_range_picker_config_1.maxDate
    break
  case 2:
    dateValueStartDate.value = date_range_picker_config_2.startDate
    dateValueEndDate.value = date_range_picker_config_2.endDate
    dateMinDate.value = date_range_picker_config_2.minDate
    dateMaxDate.value = date_range_picker_config_2.maxDate
    break
  case 7:
    dateValueStartDate.value = date_range_picker_config_7.startDate
    dateValueEndDate.value = date_range_picker_config_7.endDate
    dateMinDate.value = date_range_picker_config_7.minDate
    dateMaxDate.value = date_range_picker_config_7.maxDate
    break
}
//如果props rangedate有值，優先使用
if (props.rangeDate !== '') {
  dateValueStartDate.value = props.rangeDate.split('~')[0]
  dateValueEndDate.value = props.rangeDate.split('~')[1]
}

const dateValue = ref([dateValueStartDate.value, dateValueEndDate.value])

// 選完日期後觸發
const handleDateChange = (date) => {
  if (date !== null) {
    let result = formatDateDuration(
      dayjs(date[0]).format(t('date.format_date_rule')) +
        '~' +
        dayjs(date[1]).format(t('date.format_date_rule'))
    )
    emit('update:modelValue', result)
  }
}

// 日期快捷選項
const shortcuts = computed(() => {
  if (props.shortcutsConfig === 2) {
    return shortcutsConfig2()
  } else {
    return shortcutsConfig1()
  }
})

// 目前選擇的起始日，用來判斷disabledDate
const selectDate = ref([dateValueStartDate.value, dateValueEndDate.value]) // 目前選擇的起始日，用來判斷disabledDate

// 選擇日期後將日期放入
const handleCalendarChange = (val) => {
  selectDate.value = val
}

// 日曆禁用日期
const disabledDate = (day) => {
  // 禁選條件一：選擇的起始日往前往後大於三個月的日期disabled
  let diff = null
  if (
    selectDate.value !== null &&
    selectDate.value[1] === null &&
    props.enabledThreeMonth === true
  ) {
    diff = dayjs(selectDate.value[0]).diff(day, 'month')
    if (diff >= 3 || diff <= -3) {
      return true
    }
  }

  // 禁選條件二：日期小於最小日期 或 日期大於結束日
  let activeDate = dayjs(day).format('YYYY-MM-DD')
  let minDate = dayjs(dateMinDate.value).format('YYYY-MM-DD')
  let endDate = dayjs(dateValueEndDate.value).format('YYYY-MM-DD')

  if (activeDate < minDate || activeDate > endDate) {
    return true
  }

  return false
}

onMounted(() => {
  handleDateChange(dateValue.value)
})

// 當使用者清空日曆後，將selectDate一併清空
watch(
  () => dateValue.value,
  () => {
    if (dateValue.value === null) {
      selectDate.value = null
    }
  }
)

const handleFocus = () => {
  // dateValue.value = []
}
</script>
<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      :format="t('date.format_date_rule')"
      :unlink-panels="false"
      popper-class="cdp-datepicker-range-popper"
      class="cdp-datepicker-range"
      range-separator="~"
      start-placeholder="Start date"
      end-placeholder="End date"
      :shortcuts="shortcuts"
      :teleported="props.teleported"
      :disabled-date="disabledDate"
      :disabled="props.disabled"
      :clearable="false"
      @calendar-change="handleCalendarChange"
      @change="handleDateChange"
      @focus="handleFocus"
    />
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-popper.el-picker__popper.cdp-datepicker-range-popper) {
  right: 0 !important;
  inset: 80px 0 auto auto !important;
}
</style>
<style lang="scss">
.cdp-datepicker-range {
  justify-content: flex-start;
  &.el-date-editor {
    &.el-input__wrapper {
      position: relative;
      width: 100%;
      height: 36px;
      box-shadow: none;
      border-radius: 5px;
      border: 1px solid #cfd8e6;
      &::after {
        content: '';
        position: absolute;
        right: 13px;
        top: 50%;
        margin-top: -6px;
        width: 12px;
        height: 12px;
        background-image: url('@/assets/images/time.svg');
        background-repeat: no-repeat;
      }
    }
  }
  .el-icon {
    display: none;
  }
  .el-range-input {
    width: 70px;
    height: 32px;
    line-height: 32px;
  }
  .el-range-separator {
    flex: none;
  }
}
</style>
