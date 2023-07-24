<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { date_range_picker_config_11, date_range_picker_config_13 } from '@/utils/dateConfig.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import { formatDateDuration } from '@/utils/commonUtils.js'

const { t } = useI18n()

const props = defineProps({
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
  }
})

const emit = defineEmits(['update:timestamp'])

//popover 開啟狀態
const popoverVisible = ref(false)

const dateValueStartDate = ref('')
const dateValueEndDate = ref('')
const dateMinDate = ref('')
//根據props config決定使用的預設日期
switch (props.config) {
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

const disabledDate = (day) => {
  return day < dateMinDate.value || day > dateValueEndDate.value
}
const shortcuts = [
  {
    text: t('date_range_picker.last_week'),
    value: () => {
      return [
        dayjs().subtract(7, 'day'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  },
  {
    text: t('date_range_picker.last_two_weeks'),
    value: () => {
      return [
        dayjs().subtract(14, 'day'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  },
  {
    text: t('date_range_picker.last_month'),
    value: () => {
      return [
        dayjs().add(1, 'day').subtract(1, 'month'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  },
  {
    text: t('date_range_picker.last_two_months'),
    value: () => {
      return [
        dayjs().add(1, 'day').subtract(2, 'month'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  },
  {
    text: t('date_range_picker.last_three_months'),
    value: () => {
      return [
        dayjs().add(1, 'day').subtract(3, 'month'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  },
  {
    text: t('date_range_picker.last_six_months'),
    value: () => {
      return [
        dayjs().add(1, 'day').subtract(6, 'month'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  },
  {
    text: t('date_range_picker.last_year'),
    value: () => {
      return [
        dayjs().add(1, 'day').subtract(1, 'year'),
        dayjs().startOf('day').subtract(props.rangeEndDate, 'day')
      ]
    }
  }
]

const handleClick = () => {
  emit('update:timestamp', {
    timestamp: new Date().getTime(),
    rangeDate: formatDateDuration(
      dayjs(dateValue.value[0]).format('YYYY-MM-DD') +
        '~' +
        dayjs(dateValue.value[1]).format('YYYY-MM-DD')
    )
  })
  popoverVisible.value = false
}
</script>
<template>
  <div>
    <el-popover
      placement="bottom-end"
      :visible="popoverVisible"
      :title="t('date.date')"
      :width="320"
      trigger="click"
      popper-class="cdp-popover"
    >
      <template #reference>
        <ButtonIcon
          icon="sliders"
          size="large"
          :name="t('common.advanced_filter')"
          @click="popoverVisible = !popoverVisible"
        />
      </template>
      <div class="drop">
        <div class="drop__item">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            :unlink-panels="false"
            :clearable="false"
            popper-class="cdp-datepicker-range"
            range-separator="~"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
            :teleported="false"
            :disabled-date="disabledDate"
          />
        </div>
        <div class="drop__footer">
          <ButtonIcon
            icon="search"
            size="large large-120"
            @click="handleClick"
            :name="t('common.filter')"
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
</style>
