<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiExportLifeCycleAnalysisDetail } from '@/api/manageAnalysis.js'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/ExportReport.vue'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { queryDate } = manageAnalysisStore
const {
  searchName,
  fuzzySearch,
  stepType,
  detailType,
  apiStart,
  apiLength,
  querySortRule,
  deatilRangeDate,
  filterCustomUserList
} = storeToRefs(manageAnalysisStore)

const exportDialogVisible = ref(false)

// 匯出報表
const handelExportReport = async () => {
  globalStore.isLoading = true
  try {
    const result = await apiExportLifeCycleAnalysisDetail({
      custom_user_list: filterCustomUserList.value,
      detail_type: detailType.value,
      fuzzy_search: fuzzySearch.value,
      hall_name: activeHall.hall_code,
      length: apiLength.value,
      life_cycle_analysis_detail_date: deatilRangeDate.value,
      life_cycle_analysis_step: stepType.value,
      locale: i18nLocale.value,
      order: querySortRule.value['order'],
      query_date: queryDate,
      search_name: searchName.value,
      sort: querySortRule.value['sort'],
      start: apiStart.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      window.location.href = result.data.result.url
      globalStore.isLoading = false
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
</script>
<template>
  <div>
    <ExportDialog v-model="exportDialogVisible" />
    <ExportReport @click="handelExportReport" />
  </div>
</template>
<style lang="scss" scoped></style>
