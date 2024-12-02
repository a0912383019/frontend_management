<script setup>
import { ref, computed } from 'vue'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global.js'
import { apiExportMemberList } from '@/api/customerTagList.js'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'
import DatepickerRange from '@/components/Date/DatepickerRange.vue'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'

const { t, locale: i18nLocale } = useI18n()

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const props = defineProps({
  total: {
    type: Number
  },
  formData: {
    type: Object,
    default: () => {}
  }
})

const exportDialogVisible = ref(false)

const dialogVisible = ref(false) //dialog開啟狀態

const apiTotal = computed(() => {
  return props.total
})

const averageTypeValue = ref('week')
const averageTypeOptions = ref([
  {
    label: t('customer_tag_list.weekly_average'),
    value: 'week'
  },
  {
    label: t('customer_tag_list.daily_average'),
    value: 'day'
  }
])

const currentDate = ref('') // 現況區間
const averageDate = ref('') // 平均區間
const monthAverageDate = ref('') // 月平均區間

const handelExportReport = async () => {
  globalStore.isLoading = true
  const {
    member,
    selectAcount,
    selectLevel,
    customUserList,
    activatedDate,
    registerDate,
    searchTag,
    excludeTag,
    fuzzySearch
  } = props.formData
  try {
    const result = await apiExportMemberList({
      activated_date: activatedDate,
      ag_name: selectAcount,
      average_date: averageDate.value,
      average_type: averageTypeValue.value,
      current_date: currentDate.value,
      custom_user_list: customUserList,
      exclude_tag: excludeTag,
      fuzzy_search: fuzzySearch,
      hall_name: activeHall.hall_code,
      locale: i18nLocale.value,
      month_average_date: monthAverageDate.value,
      search_date: registerDate,
      search_name: member,
      search_tag: searchTag,
      show_report_data: false, // true -> 會在response印出整張報表的資料
      user_level_id: selectLevel
    })
    globalStore.isLoading = false
    const { return_code } = result.data.status

    if (return_code === '0000') {
      window.location.href = result.data.result.url
      dialogVisible.value = false
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
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
    }
  } catch (error) {
    // 失敗需關閉loading
    globalStore.isLoading = false
    if (error.code === 'ECONNABORTED') {
      // timeout引起的錯誤
      exportDialogVisible.value = true
      dialogVisible.value = false
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
            <div class="col-title">{{ $t('customer_tag_list.current_duration') }}</div>
            <DatepickerRange v-model="currentDate" :config="1" :teleported="true" />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.average_duration') }}</div>
            <DatepickerRange v-model="averageDate" :config="1" :teleported="true" />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.monthly_avg_duration') }}</div>
            <DatepickerRange v-model="monthAverageDate" :config="1" :teleported="true" />
          </el-col>
          <el-col class="mb-20">
            <div class="col-title">{{ $t('customer_tag_list.average_type') }}</div>
            <el-select
              v-model="averageTypeValue"
              class="cdp-select cdp-select__blue mr-6"
              popper-class="cdp-select-popper cdp-select-popper__blue w-full"
              :teleported="false"
            >
              <el-option
                v-for="item in averageTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-col>
          <el-col>
            <div class="col-title">{{ $t('customer_tag_list.data_size') }}</div>
            <el-input v-model="apiTotal" class="cdp-input cdp-input-disabled" readonly>
              <template #append><font-awesome-icon icon="fa-lock" /></template>
            </el-input>
            <div class="note">
              <font-awesome-icon icon="fa-info-circle" />
              {{ $t('customer_tag_list.increase_condition_reduce_time') }}
            </div>
            <div class="flex justify-end">
              <ButtonIcon
                :name="$t('modal.confirm_export')"
                color="blue"
                @click="handelExportReport"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.cdp-input {
  :deep(.el-input__inner) {
    cursor: default !important;
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 0 !important;
  }
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
    padding-top: 5px;
    font-size: 13px;
    color: $orange;
    svg {
      margin-right: 5px;
    }
  }
}
</style>
