<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { apiExportActivityCompareDetail } from '@/api'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import { ElNotification } from 'element-plus'

const { t, locale: i18nLocale } = useI18n()

const props = defineProps({
  isRewarded: {
    type: Boolean,
    default: true
  }
})

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const activityStore = useActivityAnalysisStore()
const { currentChildAnalysis } = activityStore

const exportDialogVisible = ref(false)

// 匯出報表
const handelExportReport = () => {
  try {
    apiExportActivityCompareDetail({
      hall_name: activeHall.hall_code,
      id: currentChildAnalysis.id,
      is_reward: props.isRewarded,
      locale: i18nLocale.value,
      search_name: activityStore.searchChildDetailMemberName
    })
  } catch (error) {
    console.error(error)
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
