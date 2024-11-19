<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores'
import { apiExportActivityList } from '@/api'
import SelectTagSingle from '@/components/Filter/SelectTagSingle.vue'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import { apiQueryListActiveLimit } from '@/api'
import { useDateStore } from '@/stores/dateConfig.js'
import { dayjs } from 'element-plus'

const { t } = useI18n()

const { date_range_picker_config_2 } = useDateStore()

// const activityStore = useActivityAnalysisStore()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

// api是否成功
const apiSuccess = ref(false)

const exportDialogVisible = ref(false)

const dialogVisible = ref(false) //dialog開啟狀態

// options的預設值
const exportData = reactive({
  selectDuration: 'week',
  analysisDate: '',
  selectReward: 1,
  activityNameList: ''
})

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

const exportApiParams = reactive({
  start_date: dayjs(date_range_picker_config_2.startDate).format('YYYY-MM-DD'),
  end_date: dayjs(date_range_picker_config_2.endDate).format('YYYY-MM-DD'),
  cut_type: 'week',
  reward_flag: 1,
  search_activity: []
})

// const transformExportParams = () => {
//   const dateArr = exportData.analysisDate.split('~')
//   exportApiParams.start_date = dateArr[0].trim()
//   exportApiParams.end_date = dateArr[1].trim()
//   exportApiParams.cut_type = exportData.selectDuration
//   exportApiParams.reward_flag = exportData.selectReward
//   exportApiParams.search_activity = exportData.activityNameList.split(',')
// }

const handelExportList = async () => {
  globalStore.isLoading = true
  try {
    const result = await apiExportActivityList({
      hall_name: activeHall.hall_code,
      start_search_year: 2024,
      start_search_month: 6,
      start_search_week: 1,
      start_date: exportApiParams.start_date,
      end_search_year: 2024,
      end_search_month: 9,
      end_search_week: 1,
      end_date: exportApiParams.end_date,
      cut_type: exportApiParams.cut_type,
      reward_flag: exportApiParams.reward_flag,
      reward_date_flag: 0,
      search_activity: exportApiParams.search_activity
    })
    const { return_code } = result.data.status
    globalStore.isLoading = false
    if (return_code === '0000') {
      console.log(result.data.status)
      exportDialogVisible.value = true
    } else if (return_code === '0001') {
      ElNotification({
        title: t('msg.no_results'),
        type: 'error'
      })
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    } else {
      ElNotification({
        title: t('msg.query_failed'),
        type: 'error'
      })
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    // 失敗需關閉loading
    globalStore.isLoading = false
    if (error.code === 'ECONNABORTED') {
      // timeout引起的錯誤
      exportDialogVisible.value = true
    } else {
      // 處理其他錯誤
      if (error.response.status === 403) {
        ElNotification({
          title: t('msg.no_permission'),
          type: 'error'
        })
      } else if (error.response.status === 401) {
        globalStore.storeHandleApiError()
      } else {
        ElNotification({
          title: t('msg.update_failed'),
          type: 'error'
        })
      }
    }
  }
}

// 取得資料
const queryActivityName = async (isFirst = false) => {
  apiSuccess.value = false
  selectActivityNameOptions.value = []

  try {
    const result = await apiQueryListActiveLimit({
      hall_name: activeHall.hall_code,
      duration: exportData.selectDuration,
      reward: exportData.selectReward,
      name: exportData.activityNameList
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
    exportData.activityNameList =
      displayData.length === 0 ? '-1' : displayData.map((item) => item.activity_id).join(',')
  }
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
    (exportData.selectDuration === 'week' ||
      exportData.selectDuration === 'season' ||
      exportData.selectDuration === 'year')
  ) {
    exportData.selectDuration = 'month'
    selectDurationOptions.value[0].disabled = true
    ElNotification({
      title: t('activity_analysis.week_duration_validation_msg'),
      type: 'warning'
    })
  } else if (
    diffMonth > 12 &&
    diffMonth <= 36 &&
    (exportData.selectDuration === 'month' ||
      exportData.selectDuration === 'week' ||
      exportData.selectDuration === 'year')
  ) {
    exportData.selectDuration = 'season'
    selectDurationOptions.value[0].disabled = true
    selectDurationOptions.value[1].disabled = true
    ElNotification({
      title: t('activity_analysis.month_duration_validation_msg'),
      type: 'warning'
    })
  } else if (diffMonth > 36) {
    exportData.selectDuration = 'year'
    selectDurationOptions.value[0].disabled = true
    selectDurationOptions.value[1].disabled = true
    selectDurationOptions.value[2].disabled = true
    ElNotification({
      title: t('activity_analysis.season_duration_validation_msg'),
      type: 'warning'
    })
  } else {
    exportData.selectDuration = 'week'
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

onMounted(() => {
  queryActivityName(true)
})

watch(
  [() => exportData.selectDuration, () => exportData.analysisDate, () => exportData.selectReward],
  () => {
    updateActivityName()
  }
)

// watch(
//   () => activityStore.chartFiltered,
//   () => {
//     handelExportList()
//   }
// )
</script>
<template>
  <div>
    <ExportDialog v-model="exportDialogVisible" />
    <ExportReport @click="dialogVisible = true" />
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog customer-tag-dialog"
      :append-to-body="true"
      :title="$t('import_export_file.export')"
    >
      <div class="dialog-inner">
        <el-row>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('activity_analysis.analysis_cycle') }}</div>
            <el-select
              v-model="exportData.selectDuration"
              class="cdp-select cdp-select__blue mr-6"
              popper-class="cdp-select-popper"
            >
              <el-option
                v-for="item in selectDurationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('activity_analysis.analysis_duration') }}</div>
            <DatepickerRange
              v-model="exportData.analysisDate"
              :config="2"
              :teleported="true"
              :enabledThreeMonth="false"
              @update:modelValue="dateCount"
              :shortcutsConfig="3"
              class="w-full filter-datepicker custom-tag-date-picker"
            />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('activity_analysis.reward_status') }}</div>
            <el-select
              v-model="exportData.selectReward"
              class="cdp-select cdp-select__blue mr-6"
              popper-class="cdp-select-popper"
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
          <el-col class="mb-4">
            <div class="col-title">{{ $t('activity_analysis.activity_name') }}</div>
            <div class="loading" v-if="!apiSuccess">
              <LoadingBox color="blue" size="sm" class="mb-12" />
            </div>
            <div v-else>
              <SelectTagSingle
                :defaultValue="defaultValue"
                :lists="selectActivityNameOptions"
                :showAllOption="false"
                :placeholder="$t('common.select')"
                v-model="exportData.activityNameList"
              />
            </div>
          </el-col>
          <el-col>
            <div class="note">
              <font-awesome-icon icon="fa-info-circle" />
              {{ $t('customer_tag_list.increase_condition_reduce_time') }}
            </div>
            <div class="flex justify-end">
              <ButtonIcon
                :name="$t('modal.confirm_export')"
                color="blue"
                @click="handelExportList"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
}
</style>
<style lang="scss">
.customer-tag-dialog {
  max-width: 530px;
  .dialog-inner {
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #e6eaf2;
    background-color: #fff;
  }
  .col-title {
    padding-bottom: 3px;
    font-size: 14px;
    color: $blue;
  }
  .note {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    font-size: 13px;
    color: $orange;
    svg {
      margin-right: 5px;
    }
  }
}
</style>
