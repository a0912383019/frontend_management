<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { useDialogMemberDetailStore } from '@/stores/dialogMemberDetail.js'
import { apiQueryLifeCycleAnalysisDetailTbl } from '@/api/manageAnalysis.js'
import { FormatNumber, addNumberColor } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import DialogMemberHistory from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/DialogMemberHistory.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const dialogMemberDetailStore = useDialogMemberDetailStore()
const { updateMemberData } = dialogMemberDetailStore

const manageAnalysisStore = useManageAnalysisStore()
const { queryDate } = manageAnalysisStore
const {
  searchName,
  fuzzySearch,
  stepType,
  detailType,
  apiDraw,
  apiStart,
  apiLength,
  apiRecordsTotal,
  querySortRule,
  filterTimestamp,
  deatilRangeDate,
  filterDateTimestamp,
  filterCustomUserList
} = storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //會員生明細api是否成功

const refDialogMemberHistory = ref(null) //歷程紀錄Dialog組件ref

//依照不同的messageKey產生不同的message
const messageKey = ref('loading')

//會員生命週期階段總覽表格表頭
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
      label: t('data_name.deposit'),
      prop: 'deposit_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.bet_amount'),
      prop: 'bet_amount',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.payoff'),
      prop: 'payoff',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.active_days'),
      prop: 'activity_day',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.daily_avg_deposit'),
      prop: 'deposit_amount_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.daily_avg_bet_amount'),
      prop: 'bet_amount_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.daily_avg_payoff'),
      prop: 'payoff_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '11%',
      sortable: 'custom'
    },
    {
      label: t('data_name.life_cycle_step'),
      prop: 'life_cycle_step',
      headerAlign: 'center',
      align: 'center',
      minWidth: '8%'
    }
  ]
})

const tableData = ref([])

//自定義排序執行的內容
const upadteCurrentSort = (data) => {
  let order = data['order'] == 'descending' ? 'DESC' : 'ASC'
  querySortRule.value['sort'] = data['prop']
  querySortRule.value['order'] = order
  query_life_cycle_analysis_detail_tbl()
}

//頁碼切換執行的內容
const updateCurrentPage = (data) => {
  apiDraw.value = data
  apiStart.value = apiDraw.value * apiLength.value - apiLength.value

  query_life_cycle_analysis_detail_tbl()
}

const refTable = ref(null) // ref table

const query_life_cycle_analysis_detail_tbl = async () => {
  messageKey.value = 'loading'
  apiSuccess.value = false
  try {
    const result = await apiQueryLifeCycleAnalysisDetailTbl({
      custom_user_list: filterCustomUserList.value,
      detail_type: detailType.value,
      fuzzy_search: fuzzySearch.value,
      hall_name: activeHall.hall_code,
      length: apiLength.value,
      life_cycle_analysis_detail_date: deatilRangeDate.value,
      life_cycle_analysis_step: stepType.value,
      order: querySortRule.value['order'],
      query_date: queryDate,
      search_name: searchName.value,
      sort: querySortRule.value['sort'],
      start: apiStart.value
    })
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = []
      tableData.value = result.data.result.data
      apiRecordsTotal.value = result.data.result.records_total
    } else if (return_code === '0001') {
      apiSuccess.value = true
      tableData.value = []
    }
  } catch (error) {
    console.error(error)
    tableData.value = []
    apiSuccess.value = false //取得資料失敗
    if (error.response.status === 403) {
      messageKey.value = 'noPermission' //更改message內容
    } else if (error.response.status === 401) {
      globalStore.storeHandleApiError()
    } else {
      messageKey.value = 'chartFailed' //更改message內容
    }
  }
}

//歷程紀錄Dialog點擊
const handleStepClick = (val) => {
  refDialogMemberHistory.value.handleOpenDialog(val)
}

//表格頁碼切換到第一頁
const tableGoToFirstPage = () => {
  refTable.value.goToFirstPage()
}

//處理Message
onMounted(() => {
  //顯示 點擊上方總覽表格數值顯示明細 message
  messageKey.value = 'clickNumberAboveToShow'
})

//監聽FilterMemberName.vue時間戳記
watch(
  () => filterTimestamp.value,
  () => {
    apiSuccess.value = false
    messageKey.value = 'clickNumberAboveToShow'
    tableGoToFirstPage() //表格頁碼切換到第一頁
  }
)

//監聽FilterDate.vue時間戳記
watch(
  () => filterDateTimestamp.value,
  () => {
    query_life_cycle_analysis_detail_tbl()
    tableGoToFirstPage() //表格頁碼切換到第一頁
  }
)

defineExpose({ query_life_cycle_analysis_detail_tbl, tableGoToFirstPage })
</script>
<template>
  <div class="top-box">
    <SectionTitle class="mb-15" :title="$t('manage_analysis.member_details')" />
    <CurrencySignText v-show="apiSuccess" />
  </div>
  <CdpMessage :messageKey="messageKey" :height="500" v-show="apiSuccess === false" />
  <div v-show="apiSuccess">
    <DialogMemberHistory ref="refDialogMemberHistory" />
    <CustomTable
      :serverSide="true"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="apiLength"
      :tableTotal="apiRecordsTotal"
      :defaultSort="{ prop: 'deposit_amount', order: 'descending' }"
      stripe
      ref="refTable"
      class="customTable2 cdp-life-cycle-member-table"
      @sort="upadteCurrentSort"
      @update:currentPage="updateCurrentPage"
    >
      <template #user_name="scope">
        <!-- 存款 -->
        <div
          class="cdp-link-click"
          :class="{ 'line-through': scope.row.is_deleted === 1 }"
          @click="updateMemberData(scope.row)"
        >
          {{ scope.row.user_name }}
        </div>
      </template>
      <template #deposit_amount="scope">
        <!-- 存款 -->
        <div>
          {{ FormatNumber(scope.row.deposit_amount) }}
        </div>
      </template>
      <template #bet_amount="scope">
        <!-- 貨量 -->
        <div>
          {{ FormatNumber(scope.row.bet_amount) }}
        </div>
      </template>
      <template #payoff="scope">
        <!-- 損益 -->
        <div v-html="addNumberColor(FormatNumber(scope.row.payoff), 'cdp-text-candypink')"></div>
      </template>
      <template #deposit_amount_avg="scope">
        <!-- 日均存款 -->
        <div>
          {{ FormatNumber(scope.row.deposit_amount_avg) }}
        </div>
      </template>
      <template #bet_amount_avg="scope">
        <!-- 日均獲量 -->
        <div>
          {{ FormatNumber(scope.row.bet_amount_avg) }}
        </div>
      </template>
      <template #payoff_avg="scope">
        <!-- 日均損益 -->
        <div
          v-html="addNumberColor(FormatNumber(scope.row.payoff_avg), 'cdp-text-candypink')"
        ></div>
      </template>
      <template #life_cycle_step="scope">
        <ButtonIcon
          @click="handleStepClick(scope.row)"
          color="slateblue"
          class="history-button"
          icon="history"
          :isSvg="true"
          :name="$t('custom_tags_setting.history')"
        />
      </template>
    </CustomTable>
  </div>
</template>
<style lang="scss">
.cdp-life-cycle-member-table {
  tr.el-table__row {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 54px;
    }
  }
  // .el-table {
  //   th.el-table__cell.is-leaf {
  //     background-color: #e9eef6;
  //   }
  //   th.el-table__cell.is-leaf,
  //   td.el-table__cell {
  //     border: none;
  //   }
  //   td.el-table__cell {
  //     height: 54px;
  //   }
  // }
}
.top-box {
  display: flex;
  justify-content: space-between;
}
.history-button {
  min-width: 80px !important;
  width: 80px !important;
  width: 100%;
}
</style>
