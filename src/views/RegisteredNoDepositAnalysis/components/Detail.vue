<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiQueryActionScoreDetail } from '@/api/registeredNoDepositAnalysis.js'
import { useGlobalStore } from '@/stores/global.js'
import { useRegisteredNoDepositAnalysisStore } from '@/stores/registeredNoDepositAnalysis.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { storeToRefs } from 'pinia'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import { roundDecimal } from '@/utils/commonUtils.js'
import { dayjs } from 'element-plus'

const globalStore = useGlobalStore()
const { activeHall } = globalStore

const depositStore = useRegisteredNoDepositAnalysisStore()
const { selectDepositValue, ipDuplicateRange } = storeToRefs(depositStore)

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const { t } = useI18n()

const apiSuccess = ref(false) //api是否成功

//依照不同的messageKey產生不同的message
const messageKey = ref('clickForDetail')

const actionScoreData = ref('')

// 會員明細表格
const apiDraw = ref(1) //第幾頁
const apiStart = ref(0) //起始筆數
const apiLength = ref(15) //一頁幾筆
const apiRecordsTotal = ref(0) //資料總數

//會員明細表格排序規則
const querySortRule = reactive({
  sort: 'action_score',
  order: 'DESC'
})

//自定義排序執行的內容
const upadteCurrentSort = (data) => {
  let order = data['order'] == 'descending' ? 'DESC' : 'ASC'
  querySortRule['sort'] = data['prop']
  querySortRule['order'] = order
  queryActionScoreDetail(actionScoreData.value)
}

//頁碼切換執行的內容
const updateCurrentPage = (data) => {
  apiDraw.value = data
  apiStart.value = apiDraw.value * apiLength.value - apiLength.value
  queryActionScoreDetail(actionScoreData.value)
}

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
  actionScoreData.value = actionScore
  depositProb.value = actionScore.split(';')
  try {
    const result = await apiQueryActionScoreDetail({
      action_score_span: actionScore,
      deposit_status: selectDepositValue.value,
      hall_name: activeHall.hall_code,
      ip_duplicate_range: ipDuplicateRange.value,
      length: apiLength.value,
      order: querySortRule.order,
      sort: querySortRule.sort,
      start: apiStart.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      apiRecordsTotal.value = result.data.result.records_total
      tableData.value = []
      tableData.value = transformActionScoreDetail(result.data.result.data)
      tableOrigData.value = JSON.parse(JSON.stringify(tableData.value))
    } else {
      const { error_code } = result.data.status
      if (error_code === '210400000') {
        apiRecordsTotal.value = 0
        messageKey.value = 'noResult'
      } else {
        apiRecordsTotal.value = 0
        messageKey.value = 'queryFailed'
      }
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
      register_date: dayjs(item.register_date).format(t('date.format_datetime_rule')),
      update_date: dayjs(item.update_date).format(t('date.format_datetime_rule')),
      action_score: roundDecimal(item.action_score) + '%',
      deposit_status: item.deposit_status
    }
  })
}

//表格頁碼切換到第一頁
const tableGoToFirstPage = () => {
  apiStart.value = 0
  refDetailTable.value.goToFirstPage()
}

defineExpose({ queryActionScoreDetail, tableGoToFirstPage })
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
        *{{ $t('register_no_deposit_analysis.action_score') }}
        {{
          $t('register_no_deposit_analysis.span_desc', {
            lower: depositProb[0] + '%',
            contain_yes: $t('common.contain_yes'),
            upper: depositProb[1] + '%',
            contain: $t(`common.contain_${depositProb[1] === '100' ? 'yes' : 'no'}`)
          })
        }}
      </div>
    </div>
    <CdpMessage :messageKey="messageKey" v-show="apiSuccess === false" />
    <div v-show="apiSuccess">
      <CustomTable
        :serverSide="true"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize="apiLength"
        :tableTotal="apiRecordsTotal"
        :defaultSort="{ prop: 'action_score', order: 'descending' }"
        stripe
        ref="refDetailTable"
        class="customTable2 registeredNoDepositAnalysisTable"
        @sort="upadteCurrentSort"
        @update:currentPage="updateCurrentPage"
      >
        <template #user_name="scope">
          <div
            class="cdp-link-click"
            :class="{ 'line-through': scope.row.is_deleted === 1 }"
            @click="updateMemberData(scope.row)"
          >
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
