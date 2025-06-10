<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiExportMemberLivelyList } from '@/api'
import { ElNotification } from 'element-plus'
import { dayjs } from 'element-plus'
import { formatDateDuration, stringToIntArray } from '@/utils/commonUtils.js'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const vipStore = useVipCommercialAnalysisStore()
const { livelyAnalysisFilter } = vipStore

const exportDialogVisible = ref(false)

const handelExportReport = () => {
  let startDate = dayjs(livelyAnalysisFilter.searchDate).subtract(6, 'day').format('YYYY-MM-DD')
  let endDate = dayjs(livelyAnalysisFilter.searchDate).format('YYYY-MM-DD')
  const { customUserList, detailType, fuzzySearch, livelyLevel, searchName, vipTag, filePath } =
    livelyAnalysisFilter

  try {
    apiExportMemberLivelyList({
      custom_user_list: customUserList,
      detail_type: detailType,
      fuzzy_search: fuzzySearch,
      hall_name: activeHall.hall_code,
      locale: i18nLocale.value,
      lively_level: livelyLevel,
      search_date: formatDateDuration(`${startDate}~${endDate}`),
      search_name: searchName,
      vip_tag: stringToIntArray(vipTag),
      file_path: filePath
    })
  } catch (error) {
    if (error.response.status === 403) {
      ElNotification({
        title: t('msg.no_permission'),
        type: 'error'
      })
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      ElNotification({
        title: t('msg.export_failed'),
        type: 'error'
      })
    }
  }

  exportDialogVisible.value = true
}
</script>
<template>
  <div>
    <ExportDialog v-model="exportDialogVisible" />
    <ExportReport @click="handelExportReport" />
  </div>
</template>
<style lang="scss" scoped></style>
