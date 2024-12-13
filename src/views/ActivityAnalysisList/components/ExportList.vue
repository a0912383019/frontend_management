<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { errorRespond } from '@/utils/commonUtils.js'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import LoadingBox from '@/components/Loading/LoadingBox.vue'
import { apiQueryListActivity, apiExportActivityList } from '@/api'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import { ElNotification } from 'element-plus'

const { t } = useI18n()

const activityStore = useActivityAnalysisStore()
const { dateRestraintion } = activityStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

// api是否成功
const apiSuccess = ref(false)

const exportDialogVisible = ref(false)

const dialogVisible = ref(false) //dialog開啟狀態

// exportData 的預設值
const exportData = reactive({
  selectDuration: 'week',
  analysisDate: '',
  selectReward: 1,
  activityNameList: []
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

// 取得資料
const queryListActivity = async () => {
  apiSuccess.value = false
  try {
    const result = await apiQueryListActivity({
      hall_name: activeHall.hall_code
    })

    const { return_code } = result.data.status
    if (return_code === '0000') {
      if (activityStore.chartFiltered === 0) {
        transformDefaultActivityName(result.data.result)
      } else {
        transformActivityName(result.data.result)
      }
      apiSuccess.value = true
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
  selectActivityNameOptions.value = []
  data.forEach((item) => {
    selectActivityNameOptions.value.push({
      value: item.id,
      label: item.name
    })
  })
}

const transformDefaultActivityName = (data) => {
  selectActivityNameOptions.value = []
  data.forEach((item) => {
    selectActivityNameOptions.value.push({
      value: item.id,
      label: item.name
    })
  })

  const displayData = data.slice(0, 10)
  exportData.activityNameList = displayData.length === 0 ? [-1] : displayData.map((item) => item.id)
}

const handleOpenDialog = () => {
  queryListActivity()
}

// Close事件觸發時，讓其回到初始狀態
const handleCloseDialog = () => {
  Object.assign(exportData, activityStore.filterData) // 屬性複製到目標物件
}

// 匯出名單
const handelExportList = async () => {
  globalStore.isLoading = true
  const dateArr = exportData.analysisDate.split('~')
  exportData.start_date = dateArr[0].trim()
  exportData.end_date = dateArr[1].trim()
  try {
    const result = await apiExportActivityList({
      hall_name: activeHall.hall_code,
      start_search_year: 2024,
      start_search_month: 6,
      start_search_week: 1,
      start_date: exportData.start_date,
      end_search_year: 2024,
      end_search_month: 9,
      end_search_week: 1,
      end_date: exportData.end_date,
      cut_type: exportData.selectDuration,
      reward_flag: exportData.selectReward,
      reward_date_flag: 0,
      search_activity: exportData.activityNameList
    })
    const { return_code } = result.data.status
    globalStore.isLoading = false
    if (return_code === '0000') {
      dialogVisible.value = false
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

const dateRestraint = (event) => {
  dateRestraintion(event, selectDurationOptions, exportData)
}

// 全選預設狀態
const checkAll = ref(false)
// 部份選擇預設狀態
const indeterminate = ref(false)

const handleCheckAll = (val) => {
  indeterminate.value = false
  if (val) {
    exportData.activityNameList = selectActivityNameOptions.value.map((_) => _.value)
  } else {
    exportData.activityNameList = []
  }
}

const isExportDisabled = computed(() => {
  return exportData.activityNameList.length === 0
})

// 監聽條件一：當列表長度為 0（未選中任何活動）
// 監聽條件二：當列表長度等於所有活動選項的長度（已選中所有活動）
// 監聽條件三：當列表長度既不為 0，也不等於所有活動的總數（即部分活動被選中）
watch([() => exportData.activityNameList, () => selectActivityNameOptions.value], () => {
  if (exportData.activityNameList.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (exportData.activityNameList.length === selectActivityNameOptions.value.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

watch(
  () => activityStore.chartFiltered,
  () => {
    Object.assign(exportData, activityStore.filterData) // 屬性複製到目標物件
  }
)
</script>
<template>
  <div>
    <ExportDialog v-model="exportDialogVisible" />
    <ExportReport @click="dialogVisible = true" />
    <el-dialog
      v-model="dialogVisible"
      class="cdp-dialog activity-export-dialog overflow-visible"
      @open="handleOpenDialog"
      @close="handleCloseDialog"
      :append-to-body="true"
      :destroy-on-close="true"
      :title="$t('import_export_file.export')"
    >
      <div class="dialog-inner">
        <el-row>
          <el-col class="mb-20">
            <SectionTitle
              size="small"
              class="cdp-text-blue mb-4"
              :title="$t('activity_analysis.analysis_cycle')"
            >
            </SectionTitle>
            <el-select-v2
              v-model="exportData.selectDuration"
              class="cdp-select cdp-select__blue"
              popper-class="cdp-select-popper cdp-select-popper__blue  w-full"
              :teleported="false"
              :options="selectDurationOptions"
            />
          </el-col>
          <el-col class="mb-20">
            <SectionTitle
              size="small"
              class="cdp-text-blue mb-4"
              :title="$t('activity_analysis.analysis_duration')"
            >
            </SectionTitle>
            <DatepickerRange
              v-model="exportData.analysisDate"
              :rangeDate="exportData.analysisDate"
              :config="2"
              :teleported="true"
              :enabledThreeMonth="false"
              @update:modelValue="dateRestraint"
              :shortcutsConfig="3"
              class="w-full filter-datepicker custom-tag-date-picker"
              classColor="blue"
            />
          </el-col>
          <el-col class="mb-20">
            <SectionTitle
              size="small"
              class="cdp-text-blue mb-4"
              :title="$t('activity_analysis.reward_status')"
            >
            </SectionTitle>
            <el-select
              v-model="exportData.selectReward"
              class="cdp-select cdp-select__blue"
              popper-class="cdp-select-popper cdp-select-popper__blue w-full"
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
            <SectionTitle
              size="small"
              class="cdp-text-blue mb-4"
              :title="$t('activity_analysis.activity_name')"
            >
            </SectionTitle>
            <div class="loading" v-if="!apiSuccess">
              <LoadingBox color="blue" size="sm" class="mb-12" />
            </div>
            <div v-else>
              <el-select
                v-model="exportData.activityNameList"
                multiple
                filterable
                collapse-tags
                :teleported="false"
                :placeholder="$t('common.select')"
                :max-collapse-tags="3"
                class="cdp-select-multiple cdp-select-multiple__blue"
                popper-class="cdp-select-popper cdp-select-popper__blue w-full"
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
          <el-col>
            <div class="flex justify-end mt-20">
              <ButtonIcon
                :name="$t('modal.confirm_export')"
                color="blue"
                @click="handelExportList"
                :disabled="isExportDisabled"
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
.activity-export-dialog {
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
}
</style>
