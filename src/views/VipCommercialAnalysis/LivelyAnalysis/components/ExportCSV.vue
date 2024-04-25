<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiExportMemberLivelyList } from '@/api'
import { ElNotification } from 'element-plus'
import { dayjs } from 'element-plus'
import { errorRespond, formatDateDuration, stringToIntArray } from '@/utils/commonUtils.js'
import ExportDialog from '@/components/ExportDialog.vue'
import ExportReport from '@/components/Button/ExportReport.vue'

const { t, locale: i18nLocale } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const vipStore = useVipCommercialAnalysisStore()
const { livelyAnalysisFilter } = vipStore

const exportDialogVisible = ref(false)

const handelExportReport = async () => {
  globalStore.isLoading = true
  let startDate = dayjs(livelyAnalysisFilter.searchDate).subtract(6, 'day').format('YYYY-MM-DD')
  let endDate = dayjs(livelyAnalysisFilter.searchDate).format('YYYY-MM-DD')
  const { customUserList, detailType, fuzzySearch, livelyLevel, searchName, vipTag } =
    livelyAnalysisFilter
  try {
    const result = await apiExportMemberLivelyList({
      custom_user_list: customUserList,
      detail_type: detailType,
      fuzzy_search: fuzzySearch,
      hall_name: activeHall.hall_code,
      locale: i18nLocale.value,
      lively_level: livelyLevel,
      search_date: formatDateDuration(`${startDate}~${endDate}`),
      search_name: searchName,
      vip_tag: stringToIntArray(vipTag)
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
