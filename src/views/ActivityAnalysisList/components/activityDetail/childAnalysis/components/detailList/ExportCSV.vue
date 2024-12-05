<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useActivityAnalysisStore } from '@/stores'
import { apiExportActivityCompareDetail } from '@/api'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'

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
const handelExportReport = async () => {
  globalStore.isLoading = true
  try {
    const result = await apiExportActivityCompareDetail({
      hall_name: activeHall.hall_code,
      activity_id_hide: 88,
      activity_detail_id_hide: currentChildAnalysis.id,
      reward_flag: props.isRewarded,
      locale: i18nLocale.value
    })
    const { return_code } = result.data.status
    globalStore.isLoading = false
    if (return_code === '0000') {
      // window.location.href = result.data.result.url
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
