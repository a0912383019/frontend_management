<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore } from '@/stores'
import { apiWeekProfitReport } from '@/api'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const vipStore = useVipCommercialAnalysisStore()
const { weekTotalReportFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const { t } = useI18n()

// api是否取得成功
const apiSuccess = ref(false)

// 依照不同的 messageKey 產生不同的 message
const messageKey = ref('loading')

// 表格 api 資料
const apiTableResult = ref([])

// 表格資料
const tableData = ref([])

// 表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('vip_commercial_analysis.positive_profit'),
      prop: 'profit_positive',
      headerAlign: 'center',
      align: 'center',
      minWidth: '6%'
    },
    {
      label: t('vip_commercial_analysis.zero_profit'),
      prop: 'profit_zero',
      headerAlign: 'center',
      align: 'center',
      minWidth: '6%'
    },
    {
      headerSlot: t('vip_commercial_analysis.1a_profit'),
      prop: 'profit_1a',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      headerSlot: t('vip_commercial_analysis.10a_profit'),
      prop: 'profit_10a',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      headerSlot: t('vip_commercial_analysis.50a_profit'),
      prop: 'profit_50a',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      headerSlot: t('vip_commercial_analysis.100a_profit'),
      prop: 'profit_100a',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      headerSlot: t('vip_commercial_analysis.100a_up_profit'),
      prop: 'profit_over100a',
      headerAlign: 'center',
      align: 'center',
      minWidth: '16%'
    },
    {
      label: t('data_name.total_people_num'),
      prop: 'total_people',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    }
  ]
})

// 呼叫 api
const queryWeekProfitReport = async () => {
  apiSuccess.value = false
  messageKey.value = 'loading'
  try {
    const result = await apiWeekProfitReport({
      hall_name: activeHall.hall_code,
      start_date: weekTotalReportFilter.startDate,
      end_date: weekTotalReportFilter.endDate,
      vip_tag: weekTotalReportFilter.vipTag.split(',')
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true // 取得資料成功
      transformWeekProfitReport(result.data.result)
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        messageKey.value = 'noResult'
      } else {
        messageKey.value = 'queryFailed'
        let failMsg = errorRespond(result.data.status)
        console.error(failMsg)
      }
    }
  } catch (error) {
    console.error(error)
    if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed'
    }
  }
}

const transformWeekProfitReport = (data) => {
  tableData.value = [
    {
      profit_zero: FormatNumber(data['profit_zero']),
      profit_positive: FormatNumber(data['profit_positive']),
      profit_1a: FormatNumber(data['profit_1a']),
      profit_10a: FormatNumber(data['profit_10a']),
      profit_50a: FormatNumber(data['profit_50a']),
      profit_100a: FormatNumber(data['profit_100a']),
      profit_over100a: FormatNumber(data['profit_over100a']),
      total_people: FormatNumber(data['total_people'])
    }
  ]
  apiTableResult.value = tableData.value.slice(0)
}

onMounted(() => {
  queryWeekProfitReport()
})

defineExpose({ queryWeekProfitReport })
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle
      :title="$t('vip_commercial_analysis.week_profit_report_table')"
      class="mb-15"
    ></SectionTitle>
    <CdpMessage :messageKey="messageKey" v-if="apiSuccess === false" />
    <CustomTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="false"
      :stripe="true"
      border
      class="customTable3"
      v-if="apiSuccess === true"
    >
    </CustomTable>
  </section>
</template>
<style lang="scss" scoped>
.customTable3 {
  :deep(.el-table__header thead th:last-child) {
    background-color: #e8eff8;
  }
  :deep(.el-table__header thead th:last-child div) {
    font-weight: 500;
  }
  :deep(.el-table__body tbody td:last-child div) {
    font-weight: 500;
  }
}
</style>
