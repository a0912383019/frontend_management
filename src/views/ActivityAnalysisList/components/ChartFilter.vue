<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryListActiveLimit } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'
import { ElNotification } from 'element-plus'

const { t } = useI18n()

const activityStore = useActivityAnalysisStore()
const { filterData } = activityStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

// popover 開啟狀態
const popoverVisible = ref(false)

// api是否成功
const apiSuccess = ref(false)

// 分析週期 options
const selectDurationOptions = computed(() => {
  return [
    {
      value: 'week',
      label: t('tag_synchronization.activity_date_cycle_week'),
      disabled: false
    },
    {
      value: 'month',
      label: t('tag_synchronization.activity_date_cycle_month'),
      disabled: false
    },
    {
      value: 'season',
      label: t('tag_synchronization.activity_date_cycle_season'),
      disabled: false
    },
    {
      value: 'year',
      label: t('tag_synchronization.activity_date_cycle_year'),
      disabled: false
    }
  ]
})

// 達檻狀態 options
const selectRewardOptions = computed(() => {
  return [
    {
      value: 1,
      label: t('activity_analysis.award')
    },
    {
      value: 0,
      label: t('activity_analysis.not_award')
    }
  ]
})

// 活動名稱 options
const selectActivityNameOptions = ref([])

// 取得資料
const queryActivityName = async (isFirst = false) => {
  apiSuccess.value = false

  try {
    const result = await apiQueryListActiveLimit({
      hall_name: activeHall.hall_code,
      duration: filterData.selectDuration,
      reward: filterData.selectReward,
      name: filterData.activityNameList
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true

      transformActivityName(isFirst, result.data.result)
    } else {
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    if (error.response && error.response.status === 401) {
      globalStore.storeHandleApiError()
    }
  }
}

const defaultValue = ref([])

const transformActivityName = (isFirst, data) => {
  selectActivityNameOptions.value = []

  data.forEach((item) => {
    selectActivityNameOptions.value.push({
      value: item.activity_id,
      label: item.activity_name
    })
  })

  if (isFirst) {
    const displayData = data.slice(0, 10)
    displayData.forEach((item) => {
      defaultValue.value.push({
        value: item.activity_id,
        label: item.activity_name
      })
    })
    filterData.activityNameList =
      displayData.length === 0 ? '-1' : displayData.map((item) => item.activity_id).join(',')

    handleSubmitClick()
  }
}

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

// 處理時間變化
const dateCount = (data) => {
  selectDurationOptions.value.forEach((option) => {
    option.disabled = false
  })

  const dateArr = data.split('~')
  const start = dateArr[0].trim()
  const end = dateArr[1].trim()

  const diffDays = calculateDayDifference(start, end)
  const diffMonth = diffDays / 31

  if (
    diffMonth > 3 &&
    diffMonth <= 12 &&
    (filterData.selectDuration === 'week' ||
      filterData.selectDuration === 'season' ||
      filterData.selectDuration === 'year')
  ) {
    filterData.selectDuration = 'month'
    selectDurationOptions.value[0].disabled = true
    ElNotification({
      title: t('activity_analysis.week_duration_validation_msg'),
      type: 'warning'
    })
  } else if (
    diffMonth > 12 &&
    diffMonth <= 36 &&
    (filterData.selectDuration === 'month' ||
      filterData.selectDuration === 'week' ||
      filterData.selectDuration === 'year')
  ) {
    filterData.selectDuration = 'season'
    selectDurationOptions.value[0].disabled = true
    selectDurationOptions.value[1].disabled = true
    ElNotification({
      title: t('activity_analysis.month_duration_validation_msg'),
      type: 'warning'
    })
  } else if (diffMonth > 36) {
    filterData.selectDuration = 'year'
    selectDurationOptions.value[0].disabled = true
    selectDurationOptions.value[1].disabled = true
    selectDurationOptions.value[2].disabled = true
    ElNotification({
      title: t('activity_analysis.season_duration_validation_msg'),
      type: 'warning'
    })
  } else {
    filterData.selectDuration = 'week'
  }
}

const calculateDayDifference = (startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)
  const timeDifference = endDate - startDate // 毫秒差
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24) // 換算為天數
  return dayDifference
}

const updateActivityName = () => {
  queryActivityName()
}

// 確認篩選
const handleSubmitClick = () => {
  popoverVisible.value = false
  activityStore.transformChartParams()
  activityStore.chartFiltered = Date.now()
  closePopover()
}

onMounted(() => {
  queryActivityName(true)
})

watch(
  [() => filterData.selectDuration, () => filterData.analysisDate, () => filterData.selectReward],
  () => {
    updateActivityName()
  }
)
</script>
<template>
  <div class="cdp-popover-container">
    <el-popover
      ref="popover"
      placement="bottom-end"
      :width="600"
      trigger="click"
      :teleported="false"
      popper-class="cdp-popover unit-test-filter"
    >
      <template #reference>
        <ButtonIcon
          icon="filter"
          :isSvg="true"
          size="large"
          color="purple"
          :name="$t('common.advanced_filter')"
        />
      </template>
      <el-row :gutter="15">
        <el-col :span="12" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('activity_analysis.analysis_cycle')"
          >
          </SectionTitle>
          <el-select-v2
            v-model="filterData.selectDuration"
            class="cdp-select cdp-select__purple w-full"
            popper-class="cdp-select-popper cdp-select-popper__purple"
            :teleported="false"
            :options="selectDurationOptions"
          />
        </el-col>
        <el-col :span="12" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('activity_analysis.analysis_duration')"
          >
          </SectionTitle>
          <DatepickerRange
            v-model="filterData.analysisDate"
            :config="2"
            :disableDate="false"
            @update:modelValue="dateCount"
            :shortcutsConfig="1"
            class="w-full filter-datepicker custom-tag-date-picker"
            classColor="purple"
          />
        </el-col>
        <el-col :span="24" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('activity_analysis.reward_status')"
          >
          </SectionTitle>
          <el-select
            v-model="filterData.selectReward"
            class="cdp-select cdp-select__purple w-full"
            popper-class="cdp-select-popper cdp-select-popper__purple"
            :teleported="false"
          >
            <el-option
              v-for="item in selectRewardOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :selected="item.selected"
            />
          </el-select>
        </el-col>

        <el-col :span="24" class="mb-19">
          <SectionTitle
            size="small"
            class="cdp-text-purple mb-4"
            :title="$t('activity_analysis.activity_name')"
          >
          </SectionTitle>
          <div class="loading" v-if="!apiSuccess">
            <LoadingBox color="purple" size="sm" class="mb-12" />
          </div>
          <div v-else>
            <SelectTagSingle
              :defaultValue="defaultValue"
              :lists="selectActivityNameOptions"
              :showAllOption="false"
              :placeholder="$t('common.select')"
              v-model="filterData.activityNameList"
            />
          </div>
        </el-col>
      </el-row>
      <div class="drop">
        <div class="drop__item">
          <ButtonIcon
            icon="search"
            size="large large-120"
            color="purple"
            @click="handleSubmitClick"
            :name="$t('common.filter')"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
}
.drop {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  &__item {
    display: flex;
    margin-left: 30px;
  }
}

.custom-tag-date-picker {
  :deep(.el-popper.el-picker__popper) {
    inset: 70px 8px auto auto !important;
  }
}
</style>
<style lang="scss">
.filter-datepicker {
  .el-date-editor {
    width: 100%;
    height: 36px;
  }
}
</style>
