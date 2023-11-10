<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryActionScoreDetail } from '@/api/registeredNoDepositAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { useRegisteredNoDepositAnalysis } from '@/stores/registeredNoDepositAnalysis.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { FormatNumber, errorRespond } from '@/utils/commonUtils.js'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const deoositStore = useRegisteredNoDepositAnalysis()
const { selectDepositValue, deatilRangeDate, ipDuplicateRange } = storeToRefs(deoositStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const { t } = useI18n()

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('clickForDetail')

//存款機率區間
const depositProb = ref(null)

const refDetailTable = ref(null)

const tableData = ref([])
const tableOrigData = ref([])
const tableColumns = computed(() => {
  return [
    {
      label: t('data_name.member_name'),
      prop: 'user_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.ag_name'),
      prop: 'ag_name',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.register_date'),
      prop: 'register_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('data_name.updated_time'),
      prop: 'update_date',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    },
    {
      label: t('register_no_deposit_analysis.deposit_prob'),
      prop: 'action_score',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('register_no_deposit_analysis.deposit_status'),
      prop: 'deposit_status',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('register_no_deposit_analysis.repeated_ip'),
      prop: 'ip_count',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    }
  ]
})

const queryActionScoreDetail = async (actionScore) => {
  apiSuccess.value = false
  if (actionScore === undefined) {
    messageKey.value = 'clickForDetail'
    return false
  }
  messageKey.value = 'shortLoading'
  depositProb.value = actionScore.split(';')
  try {
    const result = await apiQueryActionScoreDetail({
      hall_name: activeHall.hall_code,
      action_score_analysis_date: deatilRangeDate.value,
      deposit_status: selectDepositValue.value,
      ip_duplicate_range: ipDuplicateRange.value,
      barChart_action_score_click_span_hide: actionScore
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = []
      tableData.value = transformActionScoreDetail(result.data.result)
      tableOrigData.value = JSON.parse(JSON.stringify(tableData.value))
      refDetailTable.value.goToFirstPage()
    } else {
      messageKey.value = 'queryFailed'
      let failMsg = errorRespond(result.data.status)
      console.error(failMsg)
    }
  } catch (error) {
    console.error(error)
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'queryFailed' //更改message內容
    }
  }
}

// 轉換資料
const transformActionScoreDetail = (data) => {
  return data.map((item) => {
    return {
      ...item,
      action_score: FormatNumber(item.action_score * 100, '', 2) + '%',
      deposit_status: item.enabled
    }
  })
}

//sort
const handleSort = (data) => {
  tableData.value = JSON.parse(JSON.stringify(tableOrigData.value))
  if (data.order === 'descending') {
    tableData.value.sort((x, y) => {
      const xValue = sortGetValue(x[data.prop])
      const yValue = sortGetValue(y[data.prop])
      return yValue - xValue
    })
  }
  if (data.order === 'ascending') {
    tableData.value.sort((x, y) => {
      const xValue = sortGetValue(x[data.prop])
      const yValue = sortGetValue(y[data.prop])
      return xValue - yValue
    })
  }
}

// 整理排序欄位數值
const sortGetValue = (value) => {
  if (typeof value === 'string' && value.includes('%')) {
    return parseFloat(value.replace('%', ''))
  } else if (typeof value === 'boolean') {
    return value ? 1 : 0
  } else {
    return value
  }
}

defineExpose({ queryActionScoreDetail })
</script>
<template>
  <div class="cdp-section-in">
    <div class="flex justify-between mb-15">
      <SectionTitle :title="$t('register_no_deposit_analysis.deposit_span_member_detail')">
        <template #tooltip>
          {{ $t('register_no_deposit_analysis.click_for_detail') }}
        </template>
      </SectionTitle>
      <div class="cdp-text-blue" v-if="apiSuccess === true">
        *{{ $t('register_no_deposit_analysis.action_score') }} {{ depositProb[0] }}%{{
          $t('common.contain_yes')
        }}
        ~ {{ depositProb[1] }}%{{ $t(`common.contain_${depositProb[1] === '100' ? 'yes' : 'no'}`) }}
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
    <div v-show="apiSuccess === true">
      <CustomTable
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="10"
        :stripe="true"
        class="customTable2 registeredNoDepositAnalysisTable"
        ref="refDetailTable"
        @sort="handleSort"
      >
        <template #user_name="scope">
          <div class="cdp-link-click" @click="updateMemberData(scope.row)">
            {{ scope.row.user_name }}
          </div>
        </template>
        <template #deposit_status="scope">
          <div
            :class="{
              'cdp-text-blue': scope.row.deposit_status === true,
              'cdp-text-red': scope.row.deposit_status === false
            }"
          >
            {{
              scope.row.deposit_status === true
                ? $t('register_no_deposit_analysis.deposited')
                : $t('register_no_deposit_analysis.not_deposit')
            }}
          </div>
        </template>
      </CustomTable>
    </div>
  </div>
</template>
<style lang="scss">
.registeredNoDepositAnalysisTable {
  .el-table {
    &__body {
      .cell {
        padding-top: 6px;
        padding-bottom: 6px;
      }
    }
  }
}
</style>
