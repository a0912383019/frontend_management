<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from 'element-plus'
import { useDateStore } from '@/stores/dateConfig.js'

const { date_range_picker_config_4 } = useDateStore()

const { t, locale: i18nLocale } = useI18n()

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
    default: 4
  },
  teleported: {
    type: Boolean,
    default: false //是否将 date-picker 的下拉列表插入至 body 元素
  },
  classColor: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'date'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const key = ref(0)

const dateValueEndDate = ref('')
const dateMinDate = ref('')
const dateMaxDate = ref('')

//根據props config決定使用的預設日期
switch (props.config) {
  case 4:
    dateValueEndDate.value = dayjs(date_range_picker_config_4.endDate).format('YYYY-MM-DD')
    dateMinDate.value = dayjs(date_range_picker_config_4.minDate).format('YYYY-MM-DD')
    dateMaxDate.value = dayjs(date_range_picker_config_4.maxDate).format('YYYY-MM-DD')
    break
}

const singleDateValue = ref(dateValueEndDate.value)

// 選完日期後觸發
const handleDateChange = (date) => {
  if (date !== null) {
    let result = dayjs(singleDateValue.value).format(t('date.format_date_rule'))
    emit('update:modelValue', result)
    emit('change', result)
  }
}

// 目前選擇的起始日，用來判斷disabledDate
const selectDate = ref(dateValueEndDate.value)

// 選擇日期後將日期放入
const handleCalendarChange = (val) => {
  selectDate.value = val
}

const disabledDate = (time) => {
  let day = dayjs(time).format('YYYY-MM-DD')
  let minDate = dayjs(dateMinDate.value).format('YYYY-MM-DD')
  let maxDate = dayjs(dateMaxDate.value).format('YYYY-MM-DD')
  if (day > maxDate || day < minDate) {
    return true
  }
  return false
}

// format date 格式
const formatDate = computed(() => {
  if (props.type === 'month') return t('date.format_date_rule_month')
  return t('date.format_date_rule')
})

const popperClass = computed(() => {
  if (props.classColor !== '') {
    return 'cdp-datepicker-single-popper cdp-datepicker-single-popper__' + props.classColor
  }
  return 'cdp-datepicker-single-popper'
})

onMounted(() => {
  handleDateChange(singleDateValue.value)
})

// 當使用者清空日曆後，將selectDate一併清空
watch(
  () => singleDateValue.value,
  () => {
    if (singleDateValue.value === null) {
      selectDate.value = null
    }
  }
)

// 語系切換重置key
watch(i18nLocale, () => {
  key.value = Date.now()
})
</script>
<template>
  <div>
    <el-date-picker
      v-model="singleDateValue"
      :key="key"
      :type="props.type"
      :popper-class="popperClass"
      class="cdp-datepicker-single"
      :format="formatDate"
      :teleported="props.teleported"
      :disabled-date="disabledDate"
      :clearable="false"
      :editable="false"
      @calendar-change="handleCalendarChange"
      @change="handleDateChange"
    />
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-popper.el-picker__popper) {
  right: 0 !important;
  inset: 80px 0 auto auto !important;
}
</style>
