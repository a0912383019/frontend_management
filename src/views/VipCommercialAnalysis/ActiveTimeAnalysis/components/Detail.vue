<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGlobalStore, useVipCommercialAnalysisStore, useDialogMemberDetailStore } from '@/stores'
import { apiActiveTimeDetail } from '@/api'
import { stringToIntArray, errorRespond, sortTableData } from '@/utils/commonUtils.js'
import CdpMessage from '@/components/CdpMessage.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'

const { t } = useI18n()

const vipStore = useVipCommercialAnalysisStore()
const { activeTimeAnalysisFilter } = vipStore

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const apiSuccess = ref(false) //api是否成功

// 依照不同的messageKey產生不同的message
const messageKey = ref('clickChartForDetail')

// 表格資料
const tableData = ref([])

// 表格表頭
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '50%'
    },
    {
      label: t('data_name.login_num'),
      prop: 'total_login_count',
      headerAlign: 'center',
      align: 'center',
      minWidth: '50%',
      sortable: 'custom'
    }
  ]
})

// 資料時段
const dataTime = ref(null)

// 呼叫 api
const queryActiveTimeDetail = async ({ activeTime }) => {
  // 如果重複點擊相同時段，則直接返回
  if (dataTime.value === activeTime) {
    return
  }
  apiSuccess.value = false
  messageKey.value = 'loading'
  dataTime.value = activeTime
  try {
    const result = await apiActiveTimeDetail({
      active_time: activeTime,
      contain_weeks: stringToIntArray(activeTimeAnalysisFilter.containWeeks),
      custom_user_list: activeTimeAnalysisFilter.customUserList,
      fuzzy_search: activeTimeAnalysisFilter.fuzzySearch,
      hall_name: activeHall.hall_code,
      search_date: activeTimeAnalysisFilter.searchDate,
      search_name: activeTimeAnalysisFilter.searchName,
      vip_tag: stringToIntArray(activeTimeAnalysisFilter.vipTag)
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = result.data.result
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

// 自定義排序執行的內容
const upadteCurrentSort = ({ prop, order }) => {
  sortTableData({ prop, order, tableData: tableData.value })
}

defineExpose({ queryActiveTimeDetail, apiSuccess, messageKey })
</script>
<template>
  <section class="cdp-section-in">
    <SectionTitle class="mb-15" :title="$t('vip_commercial_analysis.active_time_member_detail')">
      <template #tooltip>
        <div class="tooltip-date">
          <div>{{ $t('date.statistic_time_based_ET') }}</div>
        </div>
      </template>
    </SectionTitle>
    <CdpMessage :messageKey="messageKey" bg="white" v-if="apiSuccess === false" />
    <div v-else>
      <div class="table-top">
        {{ $t('vip_commercial_analysis.data_time') }}
        {{ $t('vip_commercial_analysis.clock_interval', { count: dataTime }) }}
      </div>
      <CustomTable
        :tableData="tableData"
        :tableColumns="tableColumns"
        class="customTable3"
        @sort="upadteCurrentSort"
      >
        <!-- 會員名稱 -->
        <template #user_name="scope">
          <span class="cdp-link-click" @click="updateMemberData(scope.row)">
            {{ scope.row.user_name }}
          </span>
        </template>
      </CustomTable>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.cdp-section-in {
  display: flex;
  flex-direction: column;
}
:deep(.paginationBox) {
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  .totalPagination {
    position: relative;
    top: auto;
    transform: translateX(0);
    margin-bottom: 12px;
  }
}
:deep(.cdp-table) {
  border-radius: 0 0 5px 5px;
}
.customTable3 {
  border-radius: 0;
  :deep(.el-table .el-table__cell) {
    padding-top: 9px;
    padding-bottom: 9px;
  }
}

:deep(.message) {
  margin-top: auto;
  margin-bottom: auto;
}
.table-top {
  margin-top: 8px;
  text-align: center;
  background-color: #f6f8fb;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 14px;
  border: 1px solid #e6eaf2;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
}
</style>
