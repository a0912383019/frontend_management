<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiExportWeekReport } from '@/api'
import { ElNotification } from 'element-plus'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const vipStore = useVipCommercialAnalysisStore()
const { weekReportFilter } = vipStore

const exportDialogVisible = ref(false)

const handelExportReport = () => {
  const { financialMonth, financialWeek, financialYear, vipTag } = weekReportFilter

  try {
    apiExportWeekReport({
      hall_name: activeHall.hall_code,
      financial_month: financialMonth,
      financial_week: financialWeek,
      financial_year: financialYear,
      locale: i18nLocale.value,
      vip_tag: vipTag.split(',')
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
