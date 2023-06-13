<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { date_range_picker_config_11 } from '@/utils/dateConfig.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import { formatDateDuration } from '@/utils/commonUtils.js'

const { t } = useI18n()

const emit = defineEmits(['query:filter'])

const manageAnalysisStore = useManageAnalysisStore()

//popover 開啟狀態
const popoverVisible = ref(false)

// config_11 : 預設選取近1個月，最早可選至3年前，最晚可選至前二日
const dateValue = ref([date_range_picker_config_11.startDate, date_range_picker_config_11.endDate])
const disabledDate = (day) => {
  return day > dayjs().startOf('day').subtract(2, 'day')
}
const shortcuts = [
  {
    text: t('date_range_picker.last_week'),
    value: () => {
      return [dayjs().subtract(7, 'day'), dayjs().startOf('day').subtract(2, 'day')]
    }
  },
  {
    text: t('date_range_picker.last_two_weeks'),
    value: () => {
      return [dayjs().subtract(14, 'day'), dayjs().startOf('day').subtract(2, 'day')]
    }
  },
  {
    text: t('date_range_picker.last_month'),
    value: () => {
      return [dayjs().add(1, 'day').subtract(1, 'month'), dayjs().startOf('day').subtract(2, 'day')]
    }
  },
  {
    text: t('date_range_picker.last_two_months'),
    value: () => {
      return [dayjs().add(1, 'day').subtract(2, 'month'), dayjs().startOf('day').subtract(2, 'day')]
    }
  },
  {
    text: t('date_range_picker.last_three_months'),
    value: () => {
      return [dayjs().add(1, 'day').subtract(3, 'month'), dayjs().startOf('day').subtract(2, 'day')]
    }
  },
  {
    text: t('date_range_picker.last_six_months'),
    value: () => {
      return [dayjs().add(1, 'day').subtract(6, 'month'), dayjs().startOf('day').subtract(2, 'day')]
    }
  },
  {
    text: t('date_range_picker.last_year'),
    value: () => {
      return [dayjs().add(1, 'day').subtract(1, 'year'), dayjs().startOf('day').subtract(2, 'day')]
    }
  }
]

const handleClick = () => {
  //將資料寫到pinia
  manageAnalysisStore.filterDateTimestamp = new Date().getTime()
  manageAnalysisStore.deatilRangeDate = formatDateDuration(
    dayjs(dateValue.value[0]).format('YYYY-MM-DD') +
      '~' +
      dayjs(dateValue.value[1]).format('YYYY-MM-DD')
  )
  popoverVisible.value = false
  emit('query:filter')
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
            unlink-panels
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
