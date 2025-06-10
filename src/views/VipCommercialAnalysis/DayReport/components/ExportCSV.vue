<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiExportDayReport } from '@/api'
import { ElNotification } from 'element-plus'
import { dayjs } from 'element-plus'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const vipStore = useVipCommercialAnalysisStore()
const { dayReportFilter } = vipStore

const exportDialogVisible = ref(false)

const handelExportReport = () => {
  const { searchDate, vipTag } = dayReportFilter

  try {
    apiExportDayReport({
      hall_name: activeHall.hall_code,
      locale: i18nLocale.value,
      report_date: dayjs(searchDate).format('YYYY-MM-DD'),
      vip_tag: vipTag.split(',')
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
