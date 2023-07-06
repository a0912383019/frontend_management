<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global.js'
import { useManageAnalysisStore } from '@/stores/manageAnalysis.js'
import { apiQueryLifeCycleAnalysisDetailTbl } from '@/api/manageAnalysis.js'
import { FormatNumber, addNumberColor } from '@/utils/commonUtils.js'
import CustomTable from '@/components/CustomTable/CustomTable.vue'
import SectionTitle from '@/components/Title/SectionTitle.vue'
import CdpMessage from '@/components/CdpMessage.vue'
import ButtonIcon from '@/components/Button/ButtonIcon.vue'
import DialogMemberHistory from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/DialogMemberHistory.vue'
import DialogMemberDetail from '@/views/ManageAnalysis/components/LifeCycleAnalysis/components/MemberDetails/DialogMemberDetail/DialogMemberDetail.vue'
import CurrencySignText from '@/components/CurrencySignText.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const { activeHall } = globalStore

const manageAnalysisStore = useManageAnalysisStore()
const { queryDate } = manageAnalysisStore
const {
  searchName,
  fuzzySearch,
  useCustomList,
  stepType,
  detailType,
  filterTimestamp,
  deatilRangeDate,
  filterDateTimestamp
} = storeToRefs(manageAnalysisStore)

const apiSuccess = ref(false) //會員生明細api是否成功

const refDialogMemberDetail = ref(null) //會員明細Dialog組件ref
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
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.daily_avg_payoff'),
      prop: 'payoff_avg',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%',
      sortable: 'custom'
    },
    {
      label: t('data_name.life_cycle_step'),
      prop: 'life_cycle_step',
      headerAlign: 'center',
      align: 'center',
      minWidth: '10%'
    }
  ]
})

const tableData = ref([])

const apiDraw = ref(1) //第幾頁
const apiStart = ref(0) //起始筆數
const apiLength = ref(15) //一頁幾筆
const apiRecordsTotal = ref(0) //資料總數

//會員明細表格排序規則
const querySortRule = reactive({
  column: 2,
  dir: 'desc'
})

//自定義排序執行的內容
const upadteCurrentSort = (data) => {
  let column = tableColumns.value.findIndex((item) => {
    return item.prop === data.prop
  })
  let dir = data['order'] == 'descending' ? 'desc' : 'asc'
  querySortRule['column'] = column
  querySortRule['dir'] = dir
  query_life_cycle_analysis_detail_tbl()
}

//頁碼切換執行的內容
const updateCurrentPage = (data) => {
  console.log(data)
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
      hall_name: activeHall.hall_code,
      life_cycle_analysis_detail_date: deatilRangeDate.value,
      life_cycle_analysis_step: stepType.value,
      detail_type: detailType.value,
      query_date: queryDate,
      search_name: searchName.value,
      fuzzy_search: fuzzySearch.value,
      use_custom_list: useCustomList.value,
      draw: apiDraw.value,
      start: apiStart.value,
      length: apiLength.value,
      order: [querySortRule], //預設排序欄位
      columns: [
        //列表表頭欄位
        {
          data: {
            hall_id: 'hall_id',
            domain_id: 'domain_id',
            user_id: 'user_id',
            user_name: 'user_name'
          },
          name: '',
          searchable: true,
          orderable: false,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'ag_name',
          name: '',
          searchable: true,
          orderable: false,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'deposit_amount',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'bet_amount',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'payoff',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'activity_day',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'deposit_amount_avg',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'bet_amount_avg',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: 'payoff_avg',
          name: '',
          searchable: true,
          orderable: true,
          search: {
            value: '',
            regex: false
          }
        },
        {
          data: {
            hall_id: 'hall_id',
            domain_id: 'domain_id',
            user_id: 'user_id',
            user_name: 'user_name'
          },
          name: '',
          searchable: true,
          orderable: false,
          search: {
            value: '',
            regex: false
          }
        }
      ]
    })
    console.log(result)
    const { return_code } = result.data.status
    if (return_code === '0000') {
      apiSuccess.value = true
      tableData.value = []
      tableData.value = result.data.data
      apiRecordsTotal.value = result.data.recordsTotal
    }
  } catch (error) {
    console.log(error)
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

//會員明細Dialog點擊
const handleMemberDetailClick = (val) => {
  //寫入store
  manageAnalysisStore.memberData = {}
  manageAnalysisStore.memberData = val
  refDialogMemberDetail.value.handleOpenDialog()
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
    <SectionTitle class="mb-15" :title="t('manage_analysis.member_details')" />
    <CurrencySignText v-show="apiSuccess" />
  </div>
  <CdpMessage :messageKey="messageKey" :height="500" v-show="apiSuccess === false" />
  <div v-show="apiSuccess">
    <DialogMemberHistory ref="refDialogMemberHistory" />
    <DialogMemberDetail ref="refDialogMemberDetail" />
    <CustomTable
      :serverSide="true"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize="apiLength"
      :tableTotal="apiRecordsTotal"
      :defaultSort="{ prop: 'deposit_amount', order: 'descending' }"
      stripe
      ref="refTable"
      class="cdp-life-cycle-member-table"
      @sort="upadteCurrentSort"
      @update:currentPage="updateCurrentPage"
    >
      <template #user_name="scope">
        <!-- 存款 -->
        <div class="cdp-link-click" @click="handleMemberDetailClick(scope.row)">
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
          icon="eye"
          :name="t('manage_analysis.life_cycle_history')"
        />
      </template>
    </CustomTable>
  </div>
</template>
<style lang="scss">
.cdp-life-cycle-member-table {
  .el-table {
    th.el-table__cell.is-leaf {
      background-color: #e9eef6;
    }
    th.el-table__cell.is-leaf,
    td.el-table__cell {
      border: none;
    }
    td.el-table__cell {
      height: 54px;
    }
  }
}
.top-box {
  display: flex;
  justify-content: space-between;
}
</style>
