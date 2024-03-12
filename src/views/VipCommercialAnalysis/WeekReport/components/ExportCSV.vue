<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiExportWeekReport } from '@/api'
import { ElNotification } from 'element-plus'
import { errorRespond } from '@/utils/commonUtils.js'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/ExportReport.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const vipStore = useVipCommercialAnalysisStore()
const { weekReportFilter } = vipStore

const exportDialogVisible = ref(false)

const handelExportReport = async () => {
  globalStore.isLoading = true
  const { financialMonth, financialWeek, financialYear, vipTag } = weekReportFilter
  try {
    const result = await apiExportWeekReport({
      hall_name: activeHall.hall_code,
      financial_month: financialMonth,
      financial_week: financialWeek,
      financial_year: financialYear,
      locale: i18nLocale.value,
      vip_tag: vipTag.split(',')
    })
    const { return_code } = result.data.status
    globalStore.isLoading = false
    if (return_code === '0000') {
      window.location.href = result.data.result.url
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
      if (error.response.status === 401) {
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
