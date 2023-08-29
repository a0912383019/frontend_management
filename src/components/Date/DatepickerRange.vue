<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { formatDateDuration } from '@/utils/commonUtils.js'
import {
  date_range_picker_config_1,
  date_range_picker_config_2,
  date_range_picker_config_10,
  date_range_picker_config_11,
  date_range_picker_config_13,
  shortcutsConfig1,
  shortcutsConfig2,
  shortcutsConfig3,
  shortcutsConfig4
} from '@/utils/dateConfig.js'

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
    default: 11 // config_11 : 預設選取近1個月，最早可選至3年前，最晚可選至前二日
  },
  rangeDate: {
    type: String,
    default: ''
  },
  rangeEndDate: {
    type: Number,
    default: 2 //日期區間-結束日期回推的天數，預設兩天
  },
  shortcutsConfig: {
    type: Number,
    default: 1 // config_11 : 預設選取近1個月，最早可選至3年前，最晚可選至前二日
  },
  enabledThreeMonth: {
    type: Boolean,
    default: true // 預設開啟，選擇起始日後，結束日三個月限制
  }
})

const emit = defineEmits(['update:modelValue'])

const dateValueStartDate = ref('')
const dateValueEndDate = ref('')
const dateMinDate = ref('')
//根據props config決定使用的預設日期
switch (props.config) {
  case 1:
    dateValueStartDate.value = date_range_picker_config_1.startDate
    dateValueEndDate.value = date_range_picker_config_1.endDate
    dateMinDate.value = date_range_picker_config_1.minDate
    break
  case 2:
    dateValueStartDate.value = date_range_picker_config_2.startDate
    dateValueEndDate.value = date_range_picker_config_2.endDate
    dateMinDate.value = date_range_picker_config_2.minDate
    break
  case 10:
    dateValueStartDate.value = date_range_picker_config_10.startDate
    dateValueEndDate.value = date_range_picker_config_10.endDate
    dateMinDate.value = date_range_picker_config_10.minDate
    break
  case 11:
    dateValueStartDate.value = date_range_picker_config_11.startDate
    dateValueEndDate.value = date_range_picker_config_11.endDate
    dateMinDate.value = date_range_picker_config_11.minDate
    break
  case 13:
    dateValueStartDate.value = date_range_picker_config_13.startDate
    dateValueEndDate.value = date_range_picker_config_13.endDate
    dateMinDate.value = date_range_picker_config_13.minDate
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
  let result = formatDateDuration(
    dayjs(date[0]).format(t('date.format_date_rule')) +
      '~' +
      dayjs(date[1]).format(t('date.format_date_rule'))
  )
  emit('update:modelValue', result)
}

// 日期快捷選項
const shortcuts = computed(() => {
  switch (props.shortcutsConfig) {
    case 1:
      return shortcutsConfig1({ rangeEndDate: props.rangeEndDate })
    case 2:
      return shortcutsConfig2({ rangeEndDate: props.rangeEndDate })
    case 3:
      return shortcutsConfig3({ rangeEndDate: props.rangeEndDate })
    case 4:
      return shortcutsConfig4({ rangeEndDate: props.rangeEndDate })
    default:
      return shortcutsConfig1({ rangeEndDate: props.rangeEndDate })
  }
})

// 目前選擇的起始日，用來判斷disabledDate
const selectDate = ref(dateValueStartDate.value)

// 選擇日期後將日期放入
const handleCalendarChange = (val) => {
  selectDate.value = val[0]
}

// 日曆禁用日期
const disabledDate = (day) => {
  if (props.enabledThreeMonth) {
    const diff = dayjs(selectDate.value).diff(day, 'month') // 選擇的起始日往前往後大於三個月的日期disabled
    return diff >= 3 || diff <= -3 || day < dateMinDate.value || day > dateValueEndDate.value
  } else {
    return day < dateMinDate.value || day > dateValueEndDate.value
  }
}

onMounted(() => {
  handleDateChange(dateValue.value)
})
</script>
<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      :format="t('date.format_date_rule')"
      :unlink-panels="false"
      :clearable="false"
      popper-class="cdp-datepicker-range"
      range-separator="~"
      start-placeholder="Start date"
      end-placeholder="End date"
      :shortcuts="shortcuts"
      :teleported="false"
      :disabled-date="disabledDate"
      :disabled="props.disabled"
      @calendar-change="handleCalendarChange"
      @change="handleDateChange"
    />
  </div>
</template>
<style lang="scss" scoped></style>
