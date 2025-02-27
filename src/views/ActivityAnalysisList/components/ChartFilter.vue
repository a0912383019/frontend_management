<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryListActivity } from '@/api'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { errorRespond } from '@/utils/commonUtils.js'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'

const { t } = useI18n()

const activityStore = useActivityAnalysisStore()
const { filterData, dateRestraintion } = activityStore

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
const queryListActivity = async () => {
  apiSuccess.value = false
  try {
    const result = await apiQueryListActivity({
      hall_name: activeHall.hall_code
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      transformActivityName(result.data.result)
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

const transformActivityName = (data) => {
  const displayData = data.slice(0, 10)
  filterData.activityNameList = displayData.length === 0 ? [-1] : displayData.map((item) => item.id)
  handleSubmitClick()

  selectActivityNameOptions.value = []
  data.forEach((item) => {
    selectActivityNameOptions.value.push({
      value: item.id,
      label: item.name
    })
  })
}

const checkAll = ref(false)
const indeterminate = ref(false)

const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    filterData.activityNameList = selectActivityNameOptions.value.map((_) => _.value)
  } else {
    filterData.activityNameList = []
  }
}

const popover = ref(null) //popover

// 關閉 popover
const closePopover = () => {
  popover.value.hide()
}

const dateRestraint = (event) => {
  dateRestraintion(event, selectDurationOptions, filterData)
}

// 確認篩選
const handleSubmitClick = () => {
  popoverVisible.value = false
  activityStore.transformChartParams()
  activityStore.chartFiltered = Date.now()
  closePopover()
}

const filterDisabled = ref(false)

onMounted(() => {
  queryListActivity()
})

watch(
  () => activityStore.activityChange,
  () => {
    queryListActivity()
  }
)

watch(
  () => filterData.activityNameList,
  (val) => {
    if (val.length === 0) {
      filterDisabled.value = true
      checkAll.value = false
      indeterminate.value = false
    } else if (val.length === selectActivityNameOptions.value.length) {
      filterDisabled.value = false
      checkAll.value = true
      indeterminate.value = false
    } else {
      filterDisabled.value = false
      indeterminate.value = true
    }
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
            :enabledThreeMonth="false"
            @update:modelValue="dateRestraint"
            :shortcutsConfig="3"
            class="w-full activity-filter-date-picker"
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
            class="cdp-select cdp-select__purple"
            popper-class="cdp-select-popper cdp-select-popper__purple w-full"
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
            <el-select
              v-model="filterData.activityNameList"
              multiple
              filterable
              collapse-tags
              :teleported="false"
              :placeholder="$t('common.select')"
              :max-collapse-tags="5"
              class="cdp-select-multiple cdp-select-multiple__purple"
              popper-class="cdp-select-popper cdp-select-popper__purple w-full"
            >
              <template #header>
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="indeterminate"
                  @change="handleCheckAll"
                >
                  {{ $t('common.select_all_option') }}
                </el-checkbox>
              </template>
              <el-option
                v-for="item in selectActivityNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="drop">
        <div class="drop__item">
          <ButtonIcon
            icon="search"
            :disabled="filterDisabled"
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
.activity-filter-date-picker {
  :deep(.el-popper.el-picker__popper) {
    inset: 70px 8px auto auto !important;
  }
}
</style>
